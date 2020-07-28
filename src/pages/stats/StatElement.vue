<template>
  <q-page id="stat_element" class="column">
    <q-card>
      <q-card-section id="detail">
        <div
          style="color:#105783;"
          class="text-h4 text-center"
        >{{ stat.userType == "shop" ? $t("shop_stat") : $t("driver_stat") }}</div>
        <div class="stat_info text-subtitle2">
          <div class="stat_info-item">
            <span class="stat_info-item-lable">{{ $t("type") }}:</span>
            <span class="stat_info-item-data">{{ $t(stat.recordType) }}</span>
          </div>
          <div class="stat_info-item">
            <span class="stat_info-item-lable">{{ $t("date") }}:</span>
            <span
              class="stat_info-item-data"
            >{{ stat.recordType == 'daily' ? `${stat.strDay}-` : ""}}{{ `${stat.strMonth}-${stat.strYear}`}}</span>
          </div>
          <div class="stat_info-item">
            <span class="stat_info-item-lable">{{ $t("name") }}:</span>
            <span class="stat_info-item-data">{{ stat.name }}</span>
          </div>
          <q-separator />
          <template v-if="stat.userType == 'shop'">
            <div class="stat_info-item">
              <span class="stat_info-item-lable">{{ $t("requested") }}:</span>
              <span class="stat_info-item-data">{{ stat.requested? stat.requested: 0 }}</span>
            </div>
            <div class="stat_info-item">
              <span class="stat_info-item-lable">{{ $t("returned") }}:</span>
              <span class="stat_info-item-data">{{ stat.returned?stat.returned : 0 }}</span>
            </div>
          </template>
          <template v-else>
            <div class="stat_info-item">
              <span class="stat_info-item-lable">{{ $t("picked") }}:</span>
              <span class="stat_info-item-data">{{ stat.picked? stat.picked: 0 }}</span>
            </div>
            <div class="stat_info-item">
              <span class="stat_info-item-lable">{{ $t("delivered") }}:</span>
              <span class="stat_info-item-data">{{ stat.delivered? stat.delivered : 0 }}</span>
            </div>
          </template>
        </div>
      </q-card-section>
    </q-card>
    <q-page-sticky position="bottom-right" :offset="[18, 18]">
      <q-btn fab icon="arrow_back" color="dark" @click="$router.go(-1)" />
    </q-page-sticky>
  </q-page>
</template>

<script>
import Vue from "vue";
export default Vue.extend({
  name: "StatElement",

  props: ["stat"],
  data() {
    return {};
  },
});
</script>
<style>
#stat_element {
  padding: 20px;
}
.stat_info {
  padding: 8px;
}
.stat_info-item {
  margin: 5px;
}
.stat_info-item-lable {
  font-weight: bold;
  font-size: 1.3em;
  color: rgb(27, 95, 21);
  margin: 0px 10px;
}
.stat_info-item-data {
  font-weight: bold;
  font-size: 1.3em;
  color: #105783;
}

#map {
  height: 400px; /* The height is 400 pixels */
  width: 100%; /* The width is the width of the web page */
}
</style>
