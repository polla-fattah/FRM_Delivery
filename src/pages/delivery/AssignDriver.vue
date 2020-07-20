<template>
  <q-page id="page-show-delivery" class="column">
    <q-card :dir="$i18n.locale === 'en-us' ?'ltr':'rtl'">
      <q-card-section id="detail">
        <div class="text-h6">{{$t('delivery_details')}}</div>
        <div class="delivery-info text-subtitle2">
          <div class="delivery-info-item">
            <span class="delivery-info-item-lable">{{$t('from')}}:</span>
            <span class="delivery-info-item-data">{{delivery.fromName}} :</span>
          </div>
          <div class="delivery-info-item">
            <span class="delivery-info-item-data mobile">
              <span class="delivery-info-item-lable">{{$t('mobile')}}:</span>
              <a :href="`tel:${delivery.fromMobile}`">{{delivery.fromMobile}}</a>
            </span>
          </div>
          <div class="delivery-info-item">
            <span class="delivery-info-item-lable">{{$t('address')}}:</span>
            <span class="delivery-info-item-data">{{delivery.fromLocation}}:</span>
          </div>
          <q-separator />
          <div class="delivery-info-item">
            <span class="delivery-info-item-lable">{{$t('to')}}:</span>
            <span class="delivery-info-item-data">{{delivery.toName}} :</span>
          </div>
          <div class="delivery-info-item">
            <span class="delivery-info-item-data mobile">
              <span class="delivery-info-item-lable">{{$t('mobile')}}:</span>

              <a :href="`tel:${delivery.toMobile}`">{{delivery.toMobile}}</a>
            </span>
          </div>
          <div class="delivery-info-item">
            <span class="delivery-info-item-lable">{{$t('address')}}:</span>
            <span class="delivery-info-item-data">{{delivery.fromLocation}}:</span>
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
    </q-card>
    <q-separator />
    <h4 :dir="$i18n.locale === 'en-us' ?'ltr':'rtl'">{{$t("drivers")}}</h4>
    <q-scroll-area
      :thumb-style="thumbStyle"
      :bar-style="barStyle"
      id="scroll-area-with-virtual-scroll-1"
      :style="generalStyle"
      class="fill-window"
      :dir="$i18n.locale === 'en-us' ?'ltr':'rtl'"
    >
      <q-virtual-scroll
        scroll-target="#scroll-area-with-virtual-scroll-1 > .scroll"
        :items="driversList"
        :virtual-scroll-item-size="32"
        separator
        class="col"
      >
        <template v-slot="{item}">
          <q-item clickable v-ripple @click="assignDriver(item)">
            <q-item-section avatar>
              <q-avatar>
                <q-icon name="local_shipping" size="2.5rem" />
              </q-avatar>
            </q-item-section>

            <q-item-section>
              <q-item-label lines="1">{{item.name}}</q-item-label>
              <q-item-label caption lines="2">
                <span class="text-weight-bold">{{item.items}} - {{item.price}}</span>
              </q-item-label>
            </q-item-section>
          </q-item>
        </template>
      </q-virtual-scroll>
    </q-scroll-area>
    <q-page-sticky position="bottom-right" :offset="[18, 18]">
      <q-btn fab icon="arrow_back" color="secondary" @click="back()" />
    </q-page-sticky>
  </q-page>
</template>

<script>
import Vue from "vue";
import { deliveryDB } from "src/firebase/init.js";

export default Vue.extend({
  name: "AssignDriver",
  components: {},
  mounted() {},
  props: ["delivery"],
  data() {
    return {
      seq: 1,
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

  computed: {
    user: function() {
      return this.$user;
    },
    driversList() {
      const dRegion = this.delivery.regionID;
      const filter = e => e.docid.trim() == dRegion.trim();

      const region = this.$store.state.regions.find(filter);

      return region.drivers;
    }
  },
  methods: {
    back() {
      this.$router.go(-1);
    },
    showTitle(items) {
      this.seq++;
      return "name ";
    },
    async assignDriver(item) {
      try {
        console.log(
          item
        );
        await deliveryDB
          .doc(this.delivery.id)
          .update({
            driverID: item.userId,
            driverName: item.name,
            status: 40
          }); //item.id
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
.delivery-info-item {
  margin: 2px;
}
.delivery-info-item-lable {
  font-weight: bold;
  color: dimgrey;
}
.delivery-info-item-data {
  color: black;
}
</style>
