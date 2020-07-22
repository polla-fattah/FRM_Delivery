<template>
  <q-page id="page-show-region" class="column" :style-fn="styleFn">
    <q-card :dir="$i18n.locale === 'en-us' ?'ltr':'rtl'">
      <q-card-section id="detail">
        <div class="text-h6" id="page-title">{{$t('regionDetails')}}</div>
        <div class="region-info text-subtitle2">
          <div class="region-info-input">
            <q-input
              outlined
              v-model="regionSend.name"
              :rules="[val => (val && val.length > 0) || $t('enterValidName')]"
              lazy-rules
              :label="$t('name')"
            />
          </div>
          <div class="region-info-input">
            <q-input
              outlined
              v-model="regionSend.city"
              :rules="[val => (val && val.length > 0) || $t('enterValidCity')]"
              lazy-rules
              :label="$t('city')"
            />
          </div>
          <div class="region-info-input">
            <q-input
              outlined
              v-model="regionSend.code"
              :rules="[val => (val && val.length > 0) || $t('enterValidCode')]"
              lazy-rules
              :label="$t('code')"
            />
          </div>
        </div>
      </q-card-section>

      <q-card-actions id="control" class="row justify-center">
        <q-btn color="secondary" @click="submit()" :label="$t('submit')" />
        <q-btn
          v-if="isRegionIndxExist()"
          color="negative"
          @click="confirm = true"
          :label="$t('delete')"
        />
        <q-btn
          color="warning"
          @click="$router.push({ name: 'ShowRegions' });"
          :label="$t('cancel')"
        />
      </q-card-actions>
    </q-card>

    <div
      v-if="isRegionIndxExist()"
      style="color:#105783;"
      class="text-h4 text-center"
    >{{ $t("drivers") }}</div>

    <q-scroll-area
      :thumb-style="thumbStyle"
      :bar-style="barStyle"
      id="scroll-area-with-virtual-scroll-1"
      :style="generalStyle"
      class="fill-window"
    >
      <q-virtual-scroll
        v-if="isRegionIndxExist()"
        scroll-target="#scroll-area-with-virtual-scroll-1 > .scroll"
        :items="regionSend.drivers"
        :virtual-scroll-item-size="32"
        separator
        class="col"
      >
        <template v-slot="{item}">
          <q-item clickable class="driver-list-item" v-ripple @click="editDriver(item)">
            <q-item-section avatar>
              <q-avatar>
                <q-icon class="icon-class" name="local_shipping" size="2.5rem" />
              </q-avatar>
            </q-item-section>

            <q-item-section>
              <q-item-label lines="1" class="driver-name">{{item.name}}</q-item-label>
              <q-item-label caption lines="2">
                <span class="text-weight-bold">{{item.items}}</span>
              </q-item-label>
            </q-item-section>
          </q-item>
        </template>
      </q-virtual-scroll>
    </q-scroll-area>
    <q-page-sticky v-if="isRegionIndxExist()" position="bottom-right" :offset="[18, 18]">
      <q-btn fab icon="add" color="secondary" @click="editDriver(null)" />
    </q-page-sticky>
    <q-dialog v-model="confirm" persistent>
      <q-card>
        <q-card-section class="row items-center">
          <q-avatar icon="highlight_off" color="red" text-color="white"></q-avatar>
          <span class="q-ml-sm">{{$t('areYouSureDelete')}}</span>
        </q-card-section>

        <q-card-actions align="center">
          <q-btn :label="$t('yes')" color="negative" v-close-popup @click="deleteRegion"></q-btn>
          <q-btn :label="$t('no')" color="primary" v-close-popup></q-btn>
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script>
import Vue from "vue";
import { regionsDB } from "src/firebase/init.js";

export default Vue.extend({
  name: "EditRegion",

  props: ["regionIndx"],
  data() {
    return {
      regionSend: this.isRegionIndxExist()
        ? this.$store.state.regions[this.regionIndx]
        : { name: "", city: "", code: "" },
      confirm: false,
      generalStyle: {
        height: "650px"
      },
      thumbStyle: {
        right: "3px",
        borderRadius: "4px",
        backgroundColor: "#0299e3",
        width: "8px",
        opacity: 0.75
      },

      barStyle: {
        borderRadius: "8px",
        backgroundColor: "#999999",
        width: "14px",
        opacity: 0.2,
        marginTop: "-3px",
        marginBottom: "-3px",
        paddingTop: "3px",
        paddingBottom: "3px"
      }
    };
  },

  methods: {
    isRegionIndxExist() {
      return this.regionIndx !== null && this.regionIndx !== undefined;
    },
    styleFn(offset, height) {
      let pageheight = height - offset - 500;
      this.generalStyle = {
        height: pageheight + "px"
      };
    },
    editDriver(_driver) {
      this.$router.push({
        name: "EditDriver",
        params: { driver: _driver, regionIndx: this.regionIndx }
      });
    },
    async deleteRegion() {
      try {
        await regionsDB.doc(this.regionSend.docid).delete();
        console.log("Hi");
      } catch (error) {}
      this.$router.push({ name: "ShowRegions" });
    },
    async submit() {
      try {
        if (this.regionIndx) {
          let data = { ...this.regionSend };

          delete data.id;

          await regionsDB.doc(this.regionSend.docid).set(data);
        } else {
          await regionsDB.add(this.regionSend);
        }
      } catch (error) {
        console.error(error);
      }
      this.$router.push({ name: "ShowRegions" });
    }
  }
});
</script>
<style>
#page-show-region {
  padding: 20px;
}
#page-show-region #map {
  display: none;
}
#page-show-region #control > * {
  margin: 10px;
  width: 80px;
}
.region-info-item .mobile {
  color: cadetblue;
  font-size: 0.8em;
  padding: 0px 0px 0px 10px;
}
.region-info {
  padding: 8px;
}
.region-info-input {
  margin: 5px 0px;
}
.driver-list-item:nth-child(even) {
  background: rgba(175, 233, 168, 0.521);
}
.driver-list-item:nth-child(odd) {
  background: rgba(169, 176, 216, 0.459);
}
.icon-class {
  color: #26a69a;
  font-size: 1.4em;
}
.driver-name {
  font-size: 1.3em;
  color: #105783;
}
</style>
