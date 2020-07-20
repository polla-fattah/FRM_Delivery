<template>
  <q-page id="page-show-delivery" class="column">
    <q-card>
      <q-card-section
        id="detail"
        :dir="$i18n.locale === 'en-us' ? 'ltr' : 'rtl'"
      >
        <div class="text-h6">{{ $t("delivery_details") }}</div>
        <div class="delivery-info text-subtitle2">
          <div class="delivery-info-input">
            <q-input
              outlined
              autofocus
              v-model="send.toName"
              ref="name"
              :label="$t('name')"
              :rules="[val => (val && val.length > 0) || $t('enterValidName')]"
              lazy-rules
            />
          </div>
          <div class="delivery-info-input">
            <q-input
              data-111
              outlined
              v-model="send.toMobile"
              @blur="fixMobile()"
              ref="mobile"
              :label="$t('mobile')"
              :rules="[
                val =>
                  (val && val.search(/^0[0-9]{10}$/) == 0) ||
                  $t('enterValidMobile')
              ]"
              lazy-rules
            />
          </div>
          <div class="delivery-info-input">
            <q-input
              outlined
              v-model="send.toAddress"
              ref="address"
              :label="$t('address')"
              :rules="[
                val => (val && val.length > 0) || $t('enterValidAddress')
              ]"
              lazy-rules
            />
          </div>
          <div class="delivery-info-input">
            <q-input
              outlined
              v-model="send.price"
              @blur="fixPrice()"
              ref="price"
              :label="$t('price')"
              :rules="[
                val =>
                  (val && !isNaN($parseArabic(val))) || $t('enterValidPrice')
              ]"
              lazy-rules
            />
          </div>
          <div class="delivery-info-input">
            <q-input
              outlined
              v-model="send.items"
              type="textarea"
              ref="items"
              :label="$t('items')"
            />
          </div>
        </div>
      </q-card-section>

      <q-separator dark />

      <q-card-actions id="control" class="row justify-center">
        <q-btn color="secondary" @click="submit()" :label="$t('submit')" />
        <q-btn
          color="negative"
          v-if="delivery && delivery.status == 50"
          @click="deleteRecord()"
          :label="$t('delete')"
        />
        <q-btn color="warning" @click="$router.go(-1)" :label="$t('cancel')" />
      </q-card-actions>
    </q-card>
  </q-page>
</template>

<script>
import Vue from "vue";
import firebase from "firebase/app";

import { deliveryDB } from "src/firebase/init.js";

export default Vue.extend({
  name: "EditDelivery",
  created() {
    this.send = this.delivery ? this.delivery : {};
  },
  props: ["delivery"],
  data() {
    return { send: null };
  },
  mounted() {
    if (this.delivery)
      this.delivery.toMobile = this.delivery.toMobile.replace("+964", "0");
  },
  methods: {
    fixMobile() {
      this.send.toMobile = this.$parseArabic(this.send.toMobile);
    },
    fixPrice() {
      console.log(this.send.price);
      this.send.price = this.$parseArabic(this.send.price);
    },
    setDelivery() {
      if (!this.delivery) {
        this.send.t_assigne = null;
        this.send.t_collection = null;
        this.send.t_delivering = null;
        this.send.t_request = firebase.firestore.FieldValue.serverTimestamp();

        this.send.driverID = null;
        this.send.regionID = this.$store.state.userInfo.regionID;

        this.send.fromId = this.$store.state.userInfo.id;
        this.send.fromAddress = this.$store.state.userInfo.address;
        this.send.fromLong = this.$store.state.userInfo.longitude;
        this.send.fromLat = this.$store.state.userInfo.latitude;
        this.send.fromMobile = this.$store.state.userInfo.mobile;
        this.send.fromName = this.$store.state.userInfo.name;
        this.send.status = 50;
        this.send.toId = "";
      }
      this.send.price = parseFloat(this.send.price);
      this.send.toMobile = "+964" + this.send.toMobile.substr(1);
    },
    async submit() {
      for (let ref of Object.entries(this.$refs))
        if (!ref[1].validate()) return;

      this.setDelivery();
      try {
        if (this.delivery) {
          let data = { ...this.send };

          delete data.id;

          await deliveryDB.doc(this.delivery.id).set(data);
        } else {
          console.log(this.send);
          await deliveryDB.add(this.send);
        }
      } catch (error) {
        console.error(error);
      }
      this.$router.go(-1);
    },
    deleteRecord() {
      if (this.delivery && this.delivery.status == 50) {
        deliveryDB
          .doc(this.delivery.id)
          .delete()
          .then(function() {
            console.log("Document successfully deleted!");
          })
          .catch(function(error) {
            console.error("Error removing document: ", error);
          });
        this.$router.go(-1);
      }
    }
  }
});
</script>
<style>
#page-show-delivery {
  padding: 20px;
}
#page-show-delivery #map {
  display: none;
}
#page-show-delivery #control > * {
  margin: 10px;
  width: 80px;
}
.delivery-info-item .mobile {
  color: cadetblue;
  font-size: 0.8em;
  padding: 0px 0px 0px 10px;
}
.delivery-info {
  padding: 8px;
}
.delivery-info-input {
  margin: 5px 0px;
}
[data-111].q-placeholder::before {
  color: yellow;
}
</style>
