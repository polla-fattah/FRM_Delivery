<template>
  <q-page id="page-show-delivery" class="column">
    <q-card>
      <q-card-section id="detail">
        <div style="color:#105783;" class="text-h4 text-center">{{ $t("delivery_details") }}</div>
        <div class="delivery-info text-subtitle2">
          <div class="delivery-info-item">
            <span class="delivery-info-item-lable">{{ $t("from") }}:</span>
            <a
              class="delivery-info-item-data"
              :href="`tel:${delivery.fromMobile}`"
            >{{ delivery.fromName }}</a>
          </div>
          <div class="delivery-info-item">
            <span class="delivery-info-item-lable">{{ $t("address") }}:</span>
            <span class="delivery-info-item-data">
              {{
              delivery.fromAddress
              }}
            </span>
          </div>
          <q-separator />
          <div class="delivery-info-item">
            <span class="delivery-info-item-lable">{{ $t("to") }}:</span>
            <a
              class="delivery-info-item-data"
              :href="`tel:${delivery.toMobile}`"
            >{{ delivery.toName }}</a>
          </div>
          <div class="delivery-info-item">
            <span class="delivery-info-item-lable">{{ $t("address") }}:</span>
            <span class="delivery-info-item-data">
              {{
              delivery.toAddress
              }}
            </span>
          </div>
          <q-separator />
          <div class="delivery-info-item">
            <span class="delivery-info-item-lable">{{ $t("items") }}:</span>
            <span class="delivery-info-item-data">{{ delivery.items }}</span>
          </div>
          <div class="delivery-info-item">
            <span class="delivery-info-item-lable">{{ $t("price") }}:</span>
            <span class="delivery-info-item-data">{{ delivery.price }}</span>
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
          :label="$t('delivered')"
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
    <div v-if="!fromArchive" ref="maps_canvas" id="map_canvas" style="width: 100%; height: 500px;"></div>
    <q-page-sticky position="bottom-right" :offset="[18, 18]">
      <q-btn fab icon="arrow_back" color="dark" @click="$router.go(-1)" />
    </q-page-sticky>
    <q-dialog v-model="alert">
      <q-card>
        <q-card-section>
          <div class="text-h6">Alert</div>
        </q-card-section>

        <q-card-section class="q-pt-none">{{ alertMsg }}</q-card-section>

        <q-card-actions align="right">
          <q-btn flat label="OK" color="primary" v-close-popup></q-btn>
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script>
import Vue from "vue";
import { deliveryDB, auth } from "src/firebase/init.js";

import gmapsInit from "src/util/gmaps.js";

export default Vue.extend({
  name: "ShowDelivery",

  props: ["delivery", "fromArchive"],
  data() {
    return {
      alert: false,
      alertMsg: "",
    };
  },
  async mounted() {
    try {
      const latlng = this.$store.getters.getLatLng;
      const google = await gmapsInit();
      const directionsService = new google.maps.DirectionsService();
      const directionsDisplay = new google.maps.DirectionsRenderer();

      const map = new google.maps.Map(this.$refs.maps_canvas, {
        center: { lat: 36.1909883, lng: 44.0068523 },
        zoom: 12,
        mapTypeId: "roadmap",
      });
      directionsDisplay.setMap(map);

      const markerClickHandler = (marker) => {
        map.setZoom(13);
        map.setCenter(marker.getPosition());
      };
      console.log({
        lat: this.delivery.fromLat,
        lng: this.delivery.fromLong,
      });
      directionsService.route(
        {
          origin: { lat: latlng.lat, lng: latlng.lng },
          destination: {
            lat: this.delivery.fromLat,
            lng: this.delivery.fromLong,
          },
          travelMode: "DRIVING",
        },
        function (response, status) {
          if (status == google.maps.DirectionsStatus.OK) {
            directionsDisplay.setDirections(response);
          } else {
            console.error("Directions request failed due to " + status);
          }
        }
      );
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error(error);
    }
  },
  computed: {
    user: function () {
      return this.$user;
    },
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
      deliveryDB.doc(this.delivery.id).set(data);
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
