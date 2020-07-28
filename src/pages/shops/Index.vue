<template>
  <q-page id="search-shops" class="column">
    <div class="fixed-center fixed-top" style="max-width: 650px; min-width:350px">
      <div class="list-header">
        <div id="page-title">{{$t('searchShop')}}</div>
      </div>
      <div class="q-gutter-md">
        <q-input
          v-model="code"
          debounce="500"
          filled
          :placeholder="$t('code')"
          @keypress.enter="submit()"
          @keydown="noResult = false"
        >
          <template v-slot:append>
            <q-icon name="search"></q-icon>
          </template>
        </q-input>
        <q-input
          v-model="mobile"
          debounce="500"
          filled
          :placeholder="$t('mobile')"
          @keypress.enter="submit()"
          @keydown="noResult = false"
          :rules="[
                val =>
                  (val && val.search(/^0[0-9]{10}$/) == 0) ||
                  $t('enterValidMobile')
              ]"
          lazy-rules
        >
          <template v-slot:append>
            <q-icon name="search"></q-icon>
          </template>
        </q-input>
        <div v-if="noResult" id="noResult">{{$t('noShopFound')}}</div>

        <div style="text-align: center;">
          <q-btn color="secondary" @click="submit()" :label="$t('submit')" />
        </div>
      </div>
    </div>
    <q-page-sticky position="bottom-right" :offset="[18, 18]">
      <q-btn fab icon="add" color="secondary" @click="$router.push({ name: 'EditShop' });" />
    </q-page-sticky>
  </q-page>
</template>

<script>
import Vue from "vue";
import { usersDB } from "src/firebase/init.js";

export default Vue.extend({
  name: "searchShop",
  data() {
    return {
      mobile: "",
      code: "",
      noResult: false,
    };
  },
  methods: {
    async submit() {
      try {
        let ref = usersDB.where("role", "==", "shop");
        if (this.mobile != "") {
          const mobile = "+964" + this.mobile.substr(1);
          console.log(mobile);
          ref = ref.where("mobile", "==", mobile);
        }
        if (this.code != "") {
          ref = ref.where("code", "==", this.code);
        }
        const shops = await ref.get();
        if (shops.docs.length == 0) {
          this.noResult = true;
        } else {
          const shop = { ...shops.docs[0].data(), docid: shops.docs[0].id };
          this.$router.push({ name: "EditShop", params: { shop } });
          console.log(shop);
        }
      } catch (err) {
        console.error(err);
      }
    },
  },
});
</script>
<style>
#search-shops {
  box-sizing: border-box;
  padding: 5px;
}
#noResult {
  color: red;
  font-size: 0.9em;
  text-align: center;
}
</style>
