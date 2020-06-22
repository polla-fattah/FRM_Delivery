<template>
  <q-page id="page-edit-shops" class="column">
    <q-card>
      <q-card-section id="detail" :dir="$i18n.locale === 'en-us' ?'ltr':'rtl'">
        <div class="text-h6">{{$t('shop_details')}}</div>
        <div class="shpos-info text-subtitle2">
          <div class="shpos-info-input">
            <q-input outlined v-model="shopSend.name" :label="$t('name')" />
          </div>
          <div class="shpos-info-input">
            <q-input outlined v-model="shopSend.mobile" :label="$t('mobile')" />
          </div>
          <div class="shpos-info-input">
            <q-input outlined v-model="shopSend.address" :label="$t('address')" />
          </div>
          <div class="shpos-info-input">
            <q-input outlined v-model="shopSend.city" :label="$t('city')" />
          </div>
          <div class="shpos-info-input">
            <q-input outlined v-model="shopSend.latitude" :label="$t('lati')" />
          </div>
          <div class="shpos-info-input">
            <q-input outlined v-model="shopSend.longitude" :label="$t('long')" />
          </div>
          <div class="shpos-info-input">
            <q-select
              filled
              v-model="shopSend.region"
              :options="$store.getters.getRegionsForSelect"
              :label="$t('region')"
              emit-value
              map-options
              outlined
            />
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
  created() {
    this.shopSend = this.shop ? this.shop : {};
  },
  props: ["shop"],
  data() {
    return { shopSend: null };
  },
  watch: {
    shop() {
      this.shopSend = this.shop ? this.shop : {};
    }
  },
  methods: {
    setShop() {
      if (!this.shop) {
      }
    },
    async submit() {
      try {
        if (this.shop) {
          let data = { ...this.shopSend };

          delete data.docid;

          await usersDB.doc(this.shop.docid).set(data);
        } else {
          await usersDB.add(this.shopSend);
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
