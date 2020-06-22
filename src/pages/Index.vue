<template>
  <q-page id="page-index">
    <div id="firebaseui-auth-container"></div>
  </q-page>
</template>

<script lang="ts">
import Vue from "vue";

import "firebaseui/dist/firebaseui.css";

import firebase from "firebase/app";
import * as firebaseui from "firebaseui";

export default Vue.extend({
  name: "PageLogin",
  mounted() {
    const uiConfig = {
      callbacks: {
        signInSuccess: async user => {
          const idTokenResult = await user.getIdTokenResult();

          this.$store.commit("setUser", user);
          this.$store.commit("setClaims", idTokenResult.claims);
        }
      },
      signInSuccessUrl: "#/delivery",
      signInOptions: [
        {
          provider: firebase.auth.PhoneAuthProvider.PROVIDER_ID,
          recaptchaParameters: {
            type: "image", // 'audio'
            size: "invisible", // 'invisible' or 'compact'
            badge: "bottomleft" // ' bottomright' or 'inline' applies to invisible.
          },
          defaultCountry: "IQ", // Set default country
          whitelistedCountries: ["+964"]
        }
      ]
    };
    if (!firebaseui.auth.AuthUI.getInstance()) {
      let ui = new firebaseui.auth.AuthUI(firebase.auth());
      if (firebaseui.auth.AuthUI.getInstance()) {
        ui = firebaseui.auth.AuthUI.getInstance();
      }

      ui.start("#firebaseui-auth-container", uiConfig);
    } else {
      firebaseui.auth.AuthUI.getInstance().start(
        "#firebaseui-auth-container",
        uiConfig
      );
    }
  }
});
</script>
<style>
#page-index {
  padding: 20px;
}
</style>
