<template>
  <q-page id="page-show-delivery" class="column" :style-fn="styleFn">
    <q-card>
      <q-card-section id="detail">
        <div style="color:#105783;" class="text-h4 text-center">{{ $t("delivery_details") }}</div>
        <div class="delivery-info text-subtitle2">
          <div class="delivery-info-item">
            <span class="delivery-info-item-lable">{{ $t("from") }} :</span>
            <a
              :href="`tel:${delivery.fromMobile}`"
              class="delivery-info-item-data"
            >{{ delivery.fromName }}</a>
          </div>
          <div class="delivery-info-item">
            <span class="delivery-info-item-lable">{{ $t("address") }} :</span>
            <span class="delivery-info-item-data">
              {{
              delivery.fromAddress
              }}
            </span>
          </div>
          <q-separator />
          <div class="delivery-info-item">
            <span class="delivery-info-item-lable">{{ $t("to") }} :</span>
            <a
              :href="`tel:${delivery.toMobile}`"
              class="delivery-info-item-data"
            >{{ delivery.toName }}</a>
          </div>

          <div class="delivery-info-item">
            <span class="delivery-info-item-lable">{{ $t("address") }} :</span>
            <span class="delivery-info-item-data">
              {{
              delivery.toAddress
              }}
            </span>
          </div>
          <q-separator />
          <div class="delivery-info-item">
            <span class="delivery-info-item-lable">{{ $t("items") }} :</span>
            <span class="delivery-info-item-data">{{ delivery.items }}</span>
          </div>
          <div class="delivery-info-item">
            <span class="delivery-info-item-lable">{{ $t("price") }} :</span>
            <span class="delivery-info-item-data">{{ delivery.price }}</span>
          </div>
          <q-separator v-if="delivery.status != 50" />

          <div v-if="delivery.status != 50" class="delivery-info-item">
            <span class="delivery-info-item-lable">{{ $t("driver") }} :</span>
            <span class="delivery-info-item-data">{{ delivery.driverName }}</span>
          </div>
        </div>
      </q-card-section>
    </q-card>
    <div
      v-if="delivery.status == 50"
      style="color:#105783;"
      class="text-h4 text-center"
    >{{ $t("drivers") }}</div>
    <q-scroll-area
      v-if="delivery.status == 50"
      :thumb-style="thumbStyle"
      :bar-style="barStyle"
      id="scroll-area-with-virtual-scroll-1"
      :style="generalStyle"
      class="fill-window"
    >
      <q-virtual-scroll
        scroll-target="#scroll-area-with-virtual-scroll-1 > .scroll"
        :items="driversList"
        :virtual-scroll-item-size="32"
        separator
        class="col"
      >
        <template v-slot="{ item }">
          <q-item clickable v-ripple @click="assignDriver(item)" class="driver-list-item">
            <q-item-section avatar>
              <q-avatar>
                <q-icon class="icon-class" name="local_shipping" />
              </q-avatar>
            </q-item-section>

            <q-item-section>
              <q-item-label lines="1" class="driver-name">{{ item.name }}</q-item-label>
              <q-item-label caption lines="2">
                <span class="text-weight-bold">{{ item.car }}</span>
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
        height: "450px",
      },
      thumbStyle: {
        right: "3px",
        borderRadius: "4px",
        backgroundColor: "#0299e3",
        width: "8px",
        opacity: 0.75,
      },

      barStyle: {
        borderRadius: "8px",
        backgroundColor: "#999999",
        width: "14px",
        opacity: 0.2,
        marginTop: "-3px",
        marginBottom: "-3px",
        paddingTop: "3px",
        paddingBottom: "3px",
      },
    };
  },

  computed: {
    user: function () {
      return this.$user;
    },
    driversList() {
      const dRegion = this.delivery.regionID;
      const filter = (e) => e.docid.trim() == dRegion.trim();

      const region = this.$store.state.regions.find(filter);
      console.log(region.drivers);
      return region.drivers;
    },
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
        console.log(item);
        await deliveryDB.doc(this.delivery.id).update({
          driverID: item.userId,
          driverName: item.name,
          status: 40,
        }); //item.id
      } catch (error) {
        console.error(error);
      }
      this.$router.go(-1);
    },
    styleFn(offset, height) {
      let pageheight = height - offset - 430;
      this.generalStyle = {
        height: pageheight + "px",
      };
    },
  },
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
  font-weight: bold;
  font-size: 1.3em;
  color: #105783;
}

.icon-class {
  color: #26a69a;
  font-size: 1.4em;
}
.driver-name {
  font-size: 1.3em;
  color: #105783;
}

.driver-list-item:nth-child(even) {
  background: rgba(175, 233, 168, 0.521);
}
.driver-list-item:nth-child(odd) {
  background: rgba(169, 176, 216, 0.459);
}
</style>
