<template>
  <q-page id="page-show-driver" class="column">
    <q-card :dir="$i18n.locale === 'en-us' ?'ltr':'rtl'">
      <q-card-section id="detail">
        <div style="color:#105783;" class="text-h4 text-center">{{$t('driverDetail')}}</div>
        <div class="driver-info text-subtitle2">
          <div class="driver-info-input">
            <q-input
              lazy-rules
              outlined
              v-model="driverSend.name"
              :label="$t('name')"
              :rules="[val => (val && val.length > 0) || $t('enterValidName')]"
            />
          </div>
          <div class="driver-info-input">
            <q-input
              outlined
              @blur="fixMobile()"
              v-model="driverSend.mobile"
              :label="$t('mobile')"
              :rules="[
                val =>
                  (val && val.search(/^0[0-9]{10}$/) == 0) ||
                  $t('enterValidMobile')
              ]"
              lazy-rules
            />
          </div>
          <div class="driver-info-input">
            <q-input
              lazy-rules
              outlined
              v-model="driverSend.car"
              :label="$t('car')"
              :rules="[val => (val && val.length > 0) || $t('enterValidCar')]"
            />
          </div>
        </div>
        <div v-if="error" style="color:red"></div>
      </q-card-section>

      <q-separator dark />

      <q-card-actions id="control" class="row justify-center">
        <q-btn color="secondary" @click="submit()" :label="$t('submit')" />
        <q-btn v-if="driver" color="negative" @click="confirm = true" :label="$t('delete')" />

        <q-btn color="warning" @click="goBack" :label="$t('cancel')" />
      </q-card-actions>
    </q-card>
    <q-dialog v-model="confirm" persistent>
      <q-card>
        <q-card-section class="row items-center">
          <q-avatar icon="highlight_off" color="red" text-color="white"></q-avatar>
          <span class="q-ml-sm">{{$t('areYouSureDelete')}}</span>
        </q-card-section>

        <q-card-actions align="center">
          <q-btn :label="$t('yes')" color="negative" v-close-popup @click="deleteDriver"></q-btn>
          <q-btn :label="$t('no')" color="primary" v-close-popup></q-btn>
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script>
import Vue from "vue";
import firebase from "firebase/app";

import { usersDB, regionsDB, functions } from "src/firebase/init.js";

export default Vue.extend({
  name: "Editdriver",
  created() {
    this.driverSend = this.driver ? { ...this.driver } : {};
    if (this.driver)
      this.driverSend.mobile = this.driver.mobile.replace("+964", "0");
  },
  props: ["driver", "regionIndx"],
  data() {
    return { driverSend: null, error: false, confirm: false };
  },
  computed: {
    region() {
      return this.$store.state.regions[this.regionIndx];
    }
  },
  methods: {
    fixMobile() {
      this.driverSend.mobile = this.$parseArabic(this.driverSend.mobile);
    },
    async deleteDriver() {
      try {
        const data = { ...this.region };
        delete data.docid;
        delete data.id;
        data.drivers = data.drivers.filter(e => e.userId != this.driver.userId);
        console.log(this.region.docid);
        await regionsDB.doc(this.region.docid).set(data);
        this.$store.commit("updateRegion", {
          data,
          docid: this.region.docid
        });
      } catch (error) {
        console.error(error);
      }
      this.goBack();
    },
    async getDriverId(mobile) {
      let uid = null;
      try {
        let userData = await usersDB.where("mobile", "==", mobile).get();

        return userData.size
          ? userData.docs[0].id
          : await this.addNewUser(mobile);
      } catch (err) {
        console.error(err);
      }
    },
    async addNewUser(mobile) {
      try {
        const docRef = await usersDB.add({ mobile, role: "driver" });
        const addRoles = functions.httpsCallable("addRoles");
        await addRoles({ mobile, role: "driver" });
        return docRef.id;
      } catch (error) {
        console.error("Error adding document: ", error);
      }
      this.goBack();
    },

    goBack() {
      this.$router.push({
        name: "EditRegion",
        params: { regionIndx: this.regionIndx }
      });
    },
    async submit() {
      if (this.driverSend.mobile == "") {
        this.error = true;
        return;
      }
      let data = { ...this.region };
      delete data.docid;
      delete data.id;
      if (!data.drivers) data.drivers = [];
      this.driverSend.mobile = "+964" + this.driverSend.mobile.substr(1);

      try {
        if (this.driver) {
          const condition = e => e.userId == this.driver.userId;
          const indx = data.drivers.findIndex(condition);
          if (data.drivers[indx].mobile != this.driverSend.mobile) {
            const driverID = await this.getDriverId(this.driverSend.mobile);
            this.driverSend.userId = driverID;
          }
          data.drivers[indx] = this.driverSend;
        } else {
          const driverID = await this.getDriverId(this.driverSend.mobile);
          const condition = e => e.mobile == this.driverSend.mobile;
          const indx = data.drivers.findIndex(condition);
          if (indx == -1)
            data.drivers.push({
              ...this.driverSend,
              userId: driverID,
              jobs: 0
            });
          else data.drivers[indx] = { ...this.driverSend, userId: driverID };
        }
        await regionsDB.doc(this.region.docid).set(data);
        this.$store.commit("updateRegion", {
          data,
          docid: this.region.docid
        });
      } catch (error) {
        console.error("Can not update drivers", error);
      }
      this.goBack();
    }
  }
});
</script>
<style>
#page-show-driver {
  padding: 20px;
}
#page-show-driver #map {
  display: none;
}
#page-show-driver #control > * {
  margin: 10px;
  width: 80px;
}
.driver-info-item .mobile {
  color: cadetblue;
  font-size: 0.8em;
  padding: 0px 0px 0px 10px;
}
.driver-info {
  padding: 8px;
}
.driver-info-input {
  margin: 5px 0px;
}
</style>
