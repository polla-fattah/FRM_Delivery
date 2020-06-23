const functions = require('firebase-functions');
const admin = require('firebase-admin');
admin.initializeApp();

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
