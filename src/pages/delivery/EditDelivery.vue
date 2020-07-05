<template>
  <q-page id="page-show-delivery" class="column">
    <q-card>
      <q-card-section id="detail" :dir="$i18n.locale === 'en-us' ?'ltr':'rtl'">
        <div class="text-h6">{{$t('delivery_details')}}</div>
        <div class="delivery-info text-subtitle2">
          <div class="delivery-info-input">
            <q-input outlined v-model="deliverySend.toName" :label="$t('name')" />
          </div>
          <div class="delivery-info-input">
            <q-input data-111 outlined v-model="deliverySend.toMobile" :label="$t('mobile')" />
          </div>
          <div class="delivery-info-input">
            <q-input outlined v-model="deliverySend.toAddress" :label="$t('address')" />
          </div>
          <div class="delivery-info-input">
            <q-input outlined v-model="deliverySend.price" :label="$t('price')" />
          </div>
          <div class="delivery-info-input">
            <q-input outlined v-model="deliverySend.items" type="textarea" :label="$t('items')" />
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

import { deliveryDB } from "src/firebase/init.js";

export default Vue.extend({
  name: "EditDelivery",
  created() {
    this.deliverySend = this.delivery ? this.delivery : {};
  },
  props: ["delivery"],
  data() {
    return { deliverySend: null };
  },
  methods: {
    setDelivery() {
      if (!this.delivery) {
        this.deliverySend.t_assigne = null;
        this.deliverySend.t_collection = null;
        this.deliverySend.t_delivering = null;
        this.deliverySend.t_request = firebase.firestore.FieldValue.serverTimestamp();

        this.deliverySend.driverID = null;
        this.deliverySend.regionID = this.$store.state.userInfo.regionID;

        this.deliverySend.fromId = this.$store.state.userInfo.id;
        this.deliverySend.fromAddress = this.$store.state.userInfo.address;
        this.deliverySend.fromLong = this.$store.state.userInfo.longitude;
        this.deliverySend.fromLat = this.$store.state.userInfo.latitude;
        this.deliverySend.fromMobile = this.$store.state.userInfo.mobile;
        this.deliverySend.fromName = this.$store.state.userInfo.name;

        this.deliverySend.price = parseFloat(this.deliverySend.price);
        this.deliverySend.status = 50;

        this.deliverySend.toId = "";
      }
    },
    async submit() {
      this.setDelivery();
      try {
        if (this.delivery) {
          let data = { ...this.deliverySend };

          delete data.id;

          await deliveryDB.doc(this.delivery.id).set(data);
        } else {
          console.log(this.deliverySend);
          await deliveryDB.add(this.deliverySend);
        }
      } catch (error) {
        console.error(error);
      }
      this.$router.go(-1);
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
