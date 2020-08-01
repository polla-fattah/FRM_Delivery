<template>
  <div id="q-app">
    <router-view />
  </div>
</template>

<script>
import { auth, usersDB, firebase } from "src/firebase/init.js";
import Vue from "vue";

export default {
  name: "App",
  mounted() {
    const that = this;
    const isMobile = this.$q.platform.is.mobile !== undefined;
    auth.onAuthStateChanged(async function(user) {
      if (user) {
        try {
          const idTokenResult = await user.getIdTokenResult();
          that.$store.commit("setUser", user);
          that.$store.commit("setClaims", idTokenResult.claims);
          await that.loadUserInfo(user.phoneNumber, idTokenResult.claims.role);
          if (
            idTokenResult.claims.role == "admin" ||
            idTokenResult.claims.role == "driver"
          ) {
            await that.$store.dispatch("loadRegions");
            await that.$store.dispatch("loadPosition", { isMobile });
            if (!isMobile) {
              firebase.messaging.onTokenRefresh(that.handleToken());
              firebase.messaging.onMessage(payload => {
                console.log("Message received. ", payload);
              });
              firebase.messaging
                .requestPermission()
                .then(that.handleToken())
                .catch(err => console.error("Token Error", err));
            }
          }

          that.$router.push("/delivery");
        } catch (err) {
          console.error(err);
        }
      } else {
        that.$store.commit("setUser", null);
        that.$store.commit("setClaims", null);
      }
    });
  },
  methods: {
    handleToken() {
      return firebase.messaging.getToken().then(token => {
        usersDB.doc(this.$store.state.userInfo.id).update({
          messagingToken: token
        });
      });
    },
    async loadUserInfo(mobile, role) {
      let uid = null;
      try {
        let ref = usersDB.where("mobile", "==", mobile);
        let userData = await ref.get();
        if (userData.size == 0) {
          const that = this;
          auth.signOut().then(() => {
            that.$store.commit("setUser", null);
            that.$store.commit("setClaims", null);
            that.$router.push({ name: "LoginFailed" });
          });
        } else {
          this.$store.commit("setUserInfo", {
            ...userData.docs[0].data(),
            id: userData.docs[0].id
          });
        }
      } catch (err) {
        console.log(err);
      }
    }
  }
};
</script>
