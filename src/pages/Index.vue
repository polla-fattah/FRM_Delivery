<template>
  <q-page id="page-index">
    <div id="section1">
      <div style=" max-width: 90%; min-width: 50%; flex-grow:3 ; align-text:center;">
        <q-img src="~assets/index-delivery.png" spinner-color="white" />
      </div>
      <div class="login-container">
        <div class="moto">
          <div class="moto-element">Fast</div>
          <div class="moto-element">Easy</div>
          <div class="moto-element">Secure</div>
        </div>
        <div id="firebaseui-auth-container"></div>
      </div>
    </div>
    <div id="contackt-cards-container">
      <div class="contact-card">
        <div class="contact-card-header">About</div>
        <div>Content</div>
        <div></div>
      </div>
      <div class="contact-card">
        <div class="contact-card-header">Social</div>
        <div>Content</div>
        <div></div>
      </div>
      <div class="contact-card">
        <div class="contact-card-header">Contacts</div>
        <div>Content</div>
        <div></div>
      </div>
    </div>
    <div id="section2">
      <div id="section2-content">
        <div id="about-content">
          <div id="about-heading">
            About
            <q-img src="~assets/logo.png" spinner-color="white" width="170px" />
          </div>
          <p>
            FRM Company was established in the year 2011 with the vision to connect the logistics world. Since inception, it has come a long way today in establishing itself as a vibrant & diversified global freight logistics company guided by the principle of “Whole World is One Family”
            At F.R.M we all believe in improving ourselves at each step & adding value to all our activities at each stage. We deal in all segments of logistics corresponding both to the export & import trades.
            Company is managed by motivated professional achievers and is operated by an excellent team of skilled and talented personnel which has been made possible by hiring right and young talent; nurturing and honing their skills to achieve the highest levels of quality.
            Company growth has been inclusive of its team who along with their families have shared positives of our success & by its virtue have always been benefited.
          </p>
        </div>
      </div>
    </div>
    <div id="section3"></div>
    <div id="footer-login">
      Copyright 2020
      <a href="http://frm-co.com">FRM</a>
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
#contackt-cards-container {
  display: flex;
  margin: 20px 0px;
  justify-content: space-around;
  flex-wrap: wrap;
  align-content: space-between;
}
.contact-card {
  display: flex;
  flex-direction: column;
  min-width: 300px;
  margin: 20px 0px;

  background-color: darkkhaki;
  min-height: 200px;
}
.contact-card-header {
  text-align: center;
  padding: 20px;
  font-size: 1.5em;
  font-weight: 800;
}
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
  position: relative;
  margin-bottom: 60px;
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

  width: 100px;
  height: 70px;
  line-height: 70px;
  text-align: center;
  font-size: 1.3rem;
  font-weight: 700;
  font-style: italic;
  color: #105687;
  background: linear-gradient(135deg, #f0a15c 15%, #f9cba7 90%);
}
.moto-element:hover {
  color: #339e62;
}
.firebaseui-card-footer {
  visibility: hidden;
  height: 0px;
}

#section2 {
  background: powderblue;
  height: 400px;
  position: relative;
  box-shadow: 0px 9px 29px -5px rgba(0, 0, 0, 0.66);
  transform: skew(0, 2deg);
  margin-bottom: 30px;
}
#section2-content {
  transform: skew(0, -2deg);
  display: flex;
}
#section2-content #about-logo {
  order: 1;
  flex-grow: 1;
  width: 30%;
  min-width: 200px;
}
#section2-content #about-content {
  order: 2;
}
#section3 {
  height: 20px;
}
#footer-login {
  width: 100%;
  height: 60px;
  text-align: center;
  font-size: 1em;
}
#about-heading {
  font-size: 3em;
  font-weight: 500;
  padding: 10px 20px;
}

#about-content p {
  padding: 20px;
  font-size: 1.3em;
}
@media only screen and (max-width: 600px) {
  #about-content p {
    font-size: 0.9em;
  }
}
</style>
