<template>
  <q-page id="page-edit-shops" class="column">
    <q-card>
      <q-card-section id="detail" :dir="$i18n.locale === 'en-us' ?'ltr':'rtl'">
        <div class="text-h6">{{$t('shop_details')}}</div>
        <div class="shpos-info text-subtitle2">
          <div class="shpos-info-input">
            <q-input outlined v-model="name" :label="$t('name')" />
          </div>
          <div class="shpos-info-input">
            <q-input outlined v-model="mobile" :label="$t('mobile')" />
          </div>
          <div class="shpos-info-input">
            <q-input outlined v-model="address" :label="$t('address')" />
          </div>
          <div class="shpos-info-input">
            <q-input outlined v-model="city" :label="$t('city')" />
          </div>
          <div class="shpos-info-input">
            <q-select
              filled
              v-model="regionID"
              :options="$store.getters.getRegionsForSelect"
              :label="$t('region')"
              emit-value
              map-options
              outlined
            />
          </div>
          <div style="text-align: center; padding:3px;">
            <q-btn
              color="secondary"
              @click="getCurrentPosition()"
              label="Get Location"
              icon="my_location"
            />
          </div>
          <div class="shpos-info-input">
            <q-input outlined v-model="latitude" :label="$t('lati')" />
          </div>
          <div class="shpos-info-input">
            <q-input outlined v-model="longitude" :label="$t('long')" />
          </div>
        </div>
      </q-card-section>

      <q-separator dark />

      <q-card-actions id="control" class="row justify-center">
        <q-btn color="secondary" @click="submit()" :label="$t('submit')" />
        <q-btn color="warning" @click="$router.go(-1)" :label="$t('cancel')" />
      </q-card-actions>
    </q-card>

    <q-dialog v-model="alert">
      <q-card>
        <q-card-section>
          <div class="text-h6">Alert</div>
        </q-card-section>

        <q-card-section class="q-pt-none">{{alertMsg}}</q-card-section>

        <q-card-actions align="right">
          <q-btn flat label="OK" color="primary" v-close-popup></q-btn>
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script>
import Vue from "vue";
import firebase from "firebase/app";
import { usersDB } from "src/firebase/init.js";
let Geolocation = null;

import("@capacitor/core").then(module => {
  Geolocation = module.Plugins.Geolocation;
});
export default Vue.extend({
  name: "EditShop",
  props: ["shop"],
  data() {
    return {
      alert: false,
      alertMsg: "",
      name: "",
      mobile: "",
      address: "",
      city: "",
      regionID: "",
      latitude: "",
      longitude: ""
    };
  },
  methods: {
    getCurrentPosition() {
      if (this.$q.platform.is.mobile) {
        //this.alert = true;
        //this.alertMsg = JSON.stringify(Geolocation.getCurrentPosition()); //+ position.coords.longitude;
        Geolocation.getCurrentPosition()
          .then(position => {
            // this.alert = true;
            // this.alertMsg = "Ma ma"; //+ position.coords.longitude;
            this.updateLocation(
              position.coords.longitude,
              position.coords.latitude
            );
          })
          .catch(error => {
            console.log(error);
          });
      } else {
        navigator.geolocation.getCurrentPosition(position => {
          // this.alert = true;
          // this.alertMsg = "iuiu"; //+ position.coords.longitude;
          this.updateLocation(
            position.coords.longitude,
            position.coords.latitude
          );
        });
      }
    },
    updateLocation(lng, ltd) {
      this.longitude = lng;
      this.latitude = ltd;
    },
    async submit() {
      try {
        const data = {
          name: this.name,
          mobile: this.mobile,
          address: this.address,
          city: this.city,
          regionID: this.regionID,
          latitude: this.latitude,
          longitude: this.longitude
        };
        if (this.shop) {
          await usersDB.doc(this.shop.docid).set(data);
        } else {
          await usersDB.add(data);
        }
      } catch (error) {
        console.error(error);
      }
      this.$router.go(-1);
    }
  },

  mounted() {
    if (this.shop) {
      this.name = this.shop.name;
      this.mobile = this.shop.mobile;
      this.address = this.shop.address;
      this.city = this.shop.city;
      this.regionID = this.shop.regionID;
      this.latitude = this.shop.latitude;
      this.longitude = this.shop.longitude;
    }
    // this.getCurrentPosition();
    // // we start listening
    // this.geoId = Geolocation.watchPosition({}, (position, err) => {
    //   this.alertMsg = JSON.stringify(position); //error;
    //   this.alert = true;
    //   //console.log("New GPS position");
    //   //this.position = position;
    // });
  },
  beforeDestroy() {
    console.log("+ + + + + + +  + +  D D D D D D D D D D D  ");
    console.log(this.shop);
    // we do cleanup
    //Geolocation.clearWatch(this.geoId);
  }
});
</script>
<style>
#page-edit-shops {
  padding: 20px;
}
#page-edit-shops #control > * {
  margin: 10px;
  width: 80px;
}
.shpos-info-item .mobile {
  color: cadetblue;
  font-size: 0.8em;
  padding: 0px 0px 0px 10px;
}
.shpos-info {
  padding: 8px;
}
.shpos-info-input {
  margin: 5px 0px;
}
</style>
