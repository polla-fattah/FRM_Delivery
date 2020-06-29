<template>
  <q-page id="page-index">
    <div id="section1">
      <div style=" max-width: 90%; min-width: 50%; flex-grow:3 ; align-text:center;">
        <q-img src="~assets/index-delivery.png" spinner-color="white" />
      </div>
      <div class="login-container">
        <div class="moto">
          <a href="http://frm-co.com" target="frm-co" style="text-decoration:none">
            <div class="moto-element">Fast</div>
          </a>
          <a href="http://frm-co.com" target="frm-co" style="text-decoration:none">
            <div class="moto-element">Easy</div>
          </a>
          <a href="http://frm-co.com" target="frm-co" style="text-decoration:none">
            <div class="moto-element">Secure</div>
          </a>
        </div>
        <div id="firebaseui-auth-container" style="margin-bottom:10px;"></div>
      </div>
    </div>
    <div id="social-buttons">
      <q-space />

      <div style="fill:#435F9C;">
        <svg viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg">
          <path
            d="m437 0h-362c-41.351562 0-75 33.648438-75 75v362c0 41.351562 33.648438 75 75 75h151v-181h-60v-90h60v-61c0-49.628906 40.371094-90 90-90h91v90h-91v61h91l-15 90h-76v181h121c41.351562 0 75-33.648438 75-75v-362c0-41.351562-33.648438-75-75-75zm0 0"
          />
        </svg>
      </div>
      <div style="fill:#1DA1F2;">
        <svg viewBox="0 -47 512.00203 512" xmlns="http://www.w3.org/2000/svg">
          <path
            d="m191.011719 419.042969c-22.140625 0-44.929688-1.792969-67.855469-5.386719-40.378906-6.335938-81.253906-27.457031-92.820312-33.78125l-30.335938-16.585938 32.84375-10.800781c35.902344-11.804687 57.742188-19.128906 84.777344-30.597656-27.070313-13.109375-47.933594-36.691406-57.976563-67.175781l-7.640625-23.195313 6.265625.957031c-5.941406-5.988281-10.632812-12.066406-14.269531-17.59375-12.933594-19.644531-19.78125-43.648437-18.324219-64.21875l1.4375-20.246093 12.121094 4.695312c-5.113281-9.65625-8.808594-19.96875-10.980469-30.777343-5.292968-26.359376-.863281-54.363282 12.476563-78.851563l10.558593-19.382813 14.121094 16.960938c44.660156 53.648438 101.226563 85.472656 168.363282 94.789062-2.742188-18.902343-.6875-37.144531 6.113281-53.496093 7.917969-19.039063 22.003906-35.183594 40.722656-46.691407 20.789063-12.777343 46-18.96875 70.988281-17.433593 26.511719 1.628906 50.582032 11.5625 69.699219 28.746093 9.335937-2.425781 16.214844-5.015624 25.511719-8.515624 5.59375-2.105469 11.9375-4.496094 19.875-7.230469l29.25-10.078125-19.074219 54.476562c1.257813-.105468 2.554687-.195312 3.910156-.253906l31.234375-1.414062-18.460937 25.230468c-1.058594 1.445313-1.328125 1.855469-1.703125 2.421875-1.488282 2.242188-3.339844 5.03125-28.679688 38.867188-6.34375 8.472656-9.511718 19.507812-8.921875 31.078125 2.246094 43.96875-3.148437 83.75-16.042969 118.234375-12.195312 32.625-31.09375 60.617187-56.164062 83.199219-31.023438 27.9375-70.582031 47.066406-117.582031 56.847656-23.054688 4.796875-47.8125 7.203125-73.4375 7.203125zm0 0"
          />
        </svg>
      </div>
      <div style="fill:#1DA1F2">
        <svg viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg">
          <path
            d="m437 0h-362c-41.351562 0-75 33.648438-75 75v362c0 41.351562 33.648438 75 75 75h362c41.351562 0 75-33.648438 75-75v-362c0-41.351562-33.648438-75-75-75zm-256 406h-60v-210h60zm0-240h-60v-60h60zm210 240h-60v-120c0-16.539062-13.460938-30-30-30s-30 13.460938-30 30v120h-60v-210h60v11.308594c15.71875-4.886719 25.929688-11.308594 45-11.308594 40.691406.042969 75 36.546875 75 79.6875zm0 0"
          />
        </svg>
      </div>
    </div>
  </q-page>
</template>

<script>
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
  display: flex;
  flex-direction: column;
}
#section1 {
  flex-direction: row;
  display: flex;
  align-items: center;
  flex-wrap: wrap;
}
#login-container {
  flex-grow: 2;
  display: flex;
}
.moto {
  display: flex;
  justify-content: space-around;
  margin: 30px 0px;
}
.moto-element {
  border-radius: 10px 100px / 120px;

  transform: skew(-18deg, 0deg);
  border: 0px solid #000000;
  width: 100px;
  height: 70px;
  line-height: 70px;
  text-align: center;
  font-size: 1.3rem;
  font-weight: 700;
  color: #105687;
  background: linear-gradient(135deg, #dabea7 15%, #e0d0c4 90%);
}
.moto-element:hover {
  color: #339e62;
}
.firebaseui-card-footer {
  visibility: hidden;
  height: 0px;
}
#social-buttons {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-around;
}
#social-buttons div {
  margin: 0px 10px 0px 10px;
  width: 30px;
  height: 30px;
}
</style>
