const functions = require('firebase-functions');

const admin = require('firebase-admin');
admin.initializeApp();

const db = admin.firestore();

exports.updateStat = functions.firestore
    .document("delivery/{deliveryId}")
    .onUpdate(async change => {
        const b = change.before.data();
        const a = change.after.data();

        if (a.status == b.status)
            return null
        const batch = db.batch();
        const increment = admin.firestore.FieldValue.increment(1)
        const decrement = admin.firestore.FieldValue.increment(-1)
        const timestamp = admin.firestore.FieldValue.serverTimestamp()


        const d = new Date();
        const month = d.getMonth() < 9 ? '0' + (d.getMonth() + 1) : '' + (d.getMonth() + 1);
        const day = d.getDate() <= 9 ? '0' + d.getDate() : '' + d.getDate();
        const year = d.getFullYear();



        const ds = [year, month, day].join('-');

        const driverDailyRef = db.collection("stats").doc(ds + "_" + a.driverID)
        const driverMonthRef = db.collection("stats").doc(ds.substr(0, 7) + "_" + a.driverID)

        const shopDailyRef = db.collection("stats").doc(ds + "_" + a.fromId)
        const shopMonthRef = db.collection("stats").doc(ds.substr(0, 7) + "_" + a.fromId)

        const driverData = (await db.collection("users").doc(a.driverID).get()).data();


        const driverObj = {
            userType: "driver",
            userID: a.driverID,
            driverName: driverData.name ? driverData.name : "",
            theDate: timestamp,
            strYear: year,
            strMonth: month,
            strDay: day
        }
        const shopObj = {
            userType: "shop",
            userID: a.fromId,
            shopName: a.fromName,
            theDate: timestamp,
            strYear: year,
            strMonth: month,
            strDay: day
        }

        const driverDailyDoc = await driverDailyRef.get()
        if (!driverDailyDoc.exists) {
            batch.set(driverDailyRef, {
                ...driverObj,
                recordType: "daily"
            })
            const driverMonthDoc = await driverMonthRef.get()

            if (!driverMonthDoc.exists) {
                batch.set(driverMonthRef, {
                    ...driverObj,
                    recordType: "monthly"
                })
            }
        }
        const shopDailyDoc = await shopDailyRef.get()
        if (!shopDailyDoc.exists) {
            batch.set(shopDailyRef, {
                ...shopObj,
                recordType: "daily"
            })

            const shopMonthDoc = await shopMonthRef.get()
            if (!shopMonthDoc.exists) {
                batch.set(shopMonthRef, {
                    ...shopObj,
                    recordType: "monthly"
                })
            }
        }

        if (a.status == 40) { // If the driver assigned
            if (driverData.messagingToken) { // Send notification to the driver
                await sendNotification([driverData.messagingToken], a.fromName)
            }

            batch.update(driverDailyRef, {
                assigned: increment
            })
            batch.update(driverMonthRef, {
                assigned: increment
            })

            batch.update(shopDailyRef, {
                requested: increment
            })
            batch.update(shopMonthRef, {
                requested: increment
            })

        } else if (a.status == 30) { // If the items picked
            batch.update(driverDailyRef, {
                picked: increment
            })
            batch.update(driverMonthRef, {
                picked: increment,
            })
        } else if (a.status == 10) { // Items returned to the Shop
            batch.update(shopDailyRef, {
                returned: increment
            })
            batch.update(shopMonthRef, {
                returned: increment
            })
        } else if (a.status == 0) { // Items delivered
            batch.update(driverDailyRef, {
                delivered: increment
            })
            batch.update(driverMonthRef, {
                delivered: increment
            })
        } else {
            return null;
        }
        return await batch.commit();
    });

exports.sendNotificationToAdmins = functions.firestore
    .document('delivery/{deliveryId}')
    .onCreate(async (snap, context) => {
        const tokens = [];
        try {
            const admins = await db.collection("users").where("role", "==", "admin").get();

            admins.forEach(function(doc) {
                if (doc.data().messagingToken)
                    tokens.push(doc.data().messagingToken)
            });
            return sendNotification(tokens, snap.data().fromName);
        } catch (error) {
            console.error(error);
            return null;
        }



    });

function sendNotification(tokens, name) {
    const payload = {
        notification: {
            title: `New Delivery!`,
            body: `New Delivery Request from ${name}`,
            icon: 'https://frmdelivery.com/img/logo.67f84470.png',
            click_action: `https://frmdelivery.com/`
        }
    }
    return admin.messaging().sendToDevice(tokens, payload);

}


exports.addRoles = functions.https.onCall(async (data, context) => {
    //TODO: only admin can ser roles. Except for the first time and setting it to the shop then anyone can do it
    try {
        try {
            await createUser(data.mobile)
        } catch (er) {}
        let user = await findUser(data.mobile)

        await addRole(user.uid, data.role)

        return {
            message: "Success !!"
        }
    } catch (err) {
        return err
    }

});

async function findUser(mobile) {
    try {
        return await admin.auth().getUserByPhoneNumber(mobile);
    } catch (err) {
        return {
            message: "Error is Error"
        }
    }
}

async function addRole(uid, role) {
    try {
        await admin.auth().setCustomUserClaims(uid, {
            role: role
        });
        return {
            message: `Success!`
        };
    } catch (err) {
        return err;
    }

}

async function createUser(phone) {
    try {
        return await admin.auth().createUser({
            phoneNumber: phone,
            disabled: false
        })
    } catch (err) {
        return err;
    }
}