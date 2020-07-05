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
  </q-page>
</template>

<script>
import Vue from "vue";
import firebase from "firebase/app";
import { usersDB } from "src/firebase/init.js";

export default Vue.extend({
  name: "EditShop",
  props: ["shop"],
  data() {
    return {
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
      const latLng = this.$store.getters.getLatLng;
      this.latitude = latLng.lat;
      this.longitude = latLng.lng;
    },
    async submit() {
      try {
        const data = {
          name: this.name,
          mobile: this.mobile,
          address: this.address,
          city: this.city,
          regionID: this.regionID,
          latitude: parseFloat(this.latitude),
          longitude: parseFloat(this.longitude)
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
