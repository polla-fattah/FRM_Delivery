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
    const timestamp = admin.firestore.FieldValue.serverTimestamp()

    const ds = formatDate()
    const driverDailyRef = db.collection("stats").doc(ds + "_" + a.driverID)
    const driverMonthRef = db.collection("stats").doc(ds.substr(0, 7) + "_" + a.driverID)

    const shopDailyRef = db.collection("stats").doc(ds + "_" + a.fromId)
    const shopMonthRef = db.collection("stats").doc(ds.substr(0, 7) + "_" + a.fromId)

    const driverObj = {
      userType: "driver",
      userID: a.driverID,
      theDate: timestamp
    }
    const shopObj = {
      userType: "shop",
      userID: a.fromId,
      theDate: timestamp
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

function formatDate() {
  var d = new Date(),
    month = '' + (d.getMonth() + 1),
    day = '' + d.getDate(),
    year = d.getFullYear();

  if (month.length < 2)
    month = '0' + month;
  if (day.length < 2)
    day = '0' + day;

  return [year, month, day].join('-');
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



// console.log(a)
// console.log(b)
// const ds = formatDate()
// const increment = admin.firestore.FieldValue.increment(1)
// const ts1 = admin.firestore.Timestamp.fromDate(new Date(ds + "T00:00:00"))
// const ts2 = admin.firestore.Timestamp.fromDate(new Date(ds + "T23:56:56"))

// const ref = db.collection("delivery")
//   .where("t_request", ">=", ts1)
//   .where("t_request", "<=", ts2);
// const records = await ref.get();
// if (!records.empty) {
//   records.forEach(doc => console.log(doc.data()))
// }
// console.log("--------", records.empty)
