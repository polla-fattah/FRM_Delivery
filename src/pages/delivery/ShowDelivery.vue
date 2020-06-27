<template>
  <q-page id="page-show-delivery" class="column">
    <q-card :dir="$i18n.locale === 'en-us' ?'ltr':'rtl'">
      <q-card-section id="detail">
        <div style="color:#105783;" class="text-h4 text-center">{{$t('delivery_details')}}</div>
        <div class="delivery-info text-subtitle2">
          <div class="delivery-info-item">
            <span class="delivery-info-item-lable">{{$t('from')}}:</span>
            <span class="delivery-info-item-data">{{delivery.fromName}}</span>
            <span class="delivery-info-item-data mobile">
              <a :href="`tel:${delivery.fromMobile}`">{{delivery.fromMobile}}</a>
            </span>
          </div>
          <div class="delivery-info-item">
            <span class="delivery-info-item-lable">{{$t('address')}}:</span>
            <span class="delivery-info-item-data">{{delivery.fromAddress}}:</span>
          </div>
          <q-separator />
          <div class="delivery-info-item">
            <span class="delivery-info-item-lable">{{$t('to')}}:</span>
            <span class="delivery-info-item-data">{{delivery.toName}}</span>
            <span class="delivery-info-item-data mobile">
              <a :href="`tel:${delivery.toMobile}`">{{delivery.toMobile}}</a>
            </span>
          </div>
          <div class="delivery-info-item">
            <span class="delivery-info-item-lable">{{$t('address')}}:</span>
            <span class="delivery-info-item-data">{{delivery.toAddress}}:</span>
          </div>
          <q-separator />
          <div class="delivery-info-item">
            <span class="delivery-info-item-lable">{{$t('items')}}:</span>
            <span class="delivery-info-item-data">{{delivery.items}}</span>
          </div>
          <div class="delivery-info-item">
            <span class="delivery-info-item-lable">{{$t('price')}}:</span>
            <span class="delivery-info-item-data">{{delivery.price}}</span>
          </div>
        </div>
      </q-card-section>

      <q-separator dark />

      <q-card-actions v-if="!fromArchive" id="control" class="row justify-center">
        <q-btn v-if="delivery.status == 40" color="dark" @click="picked()" :label="$t('picked')" />
        <q-btn
          v-if="delivery.status == 30"
          size="16px"
          style="width:120px"
          color="dark"
          @click="deliverd()"
          :label=" $t('delivered')"
        />
        <q-btn
          v-if="delivery.status == 30"
          size="16px"
          style="width:120px"
          color="positive"
          @click="returned()"
          :label="$t('returned')"
        />
      </q-card-actions>
    </q-card>

    <q-page-sticky position="bottom-right" :offset="[18, 18]">
      <q-btn fab icon="arrow_back" color="dark" @click="$router.go(-1)" />
    </q-page-sticky>
  </q-page>
</template>

<script>
import Vue from "vue";
import { db, auth } from "src/firebase/init.js";

export default Vue.extend({
  name: "ShowDelivery",
  components: {},
  mounted() {},
  props: ["delivery", "fromArchive"],
  data() {
    return {};
  },
  computed: {
    user: function() {
      return this.$user;
    }
  },
  methods: {
    picked() {
      this.delivery.status = 30;
      this.updateDelivery();
    },

    deliverd() {
      this.delivery.status = 0;
      this.updateDelivery();
      this.$router.go(-1);
    },
    returned() {
      this.delivery.status = 10;
      this.updateDelivery();
      this.$router.go(-1);
    },
    updateDelivery() {
      let data = { ...this.delivery };
      delete data.id;
      db.collection("delivery")
        .doc(this.delivery.id)
        .set(data);
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
  font-size: 1em;
  text-decoration: none;
  padding: 0px 10px 0px 10px;
}
.delivery-info-item .mobile::before {
  content: "(";
}
.delivery-info-item .mobile::after {
  content: ")";
}
.delivery-info {
  padding: 8px;
}
.delivery-info-item {
  margin: 5px;
}
.delivery-info-item-lable {
  font-weight: bold;
  font-size: 1.3em;
  color: rgb(27, 95, 21);
  margin: 0px 10px;
}
.delivery-info-item-data {
  font-weight: bold;
  font-size: 1.3em;
  color: #105783;
}

#map {
  height: 400px; /* The height is 400 pixels */
  width: 100%; /* The width is the width of the web page */
}
</style>
