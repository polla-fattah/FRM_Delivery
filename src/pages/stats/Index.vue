<template>
  <q-page id="stat" class="column" :style-fn="styleFn">
    <q-card class="search-card">
      <q-expansion-item class="expantionLable" :label="$t('stat')" v-model="oppened">
        <div class="stat-card-content">
          <div class="first-row">
            <q-card-section class="search-card-element">
              <q-btn-toggle
                v-model="userType"
                toggle-color="secondary"
                :options="[
          {label: 'Driver', value: 'driver', slot: 'driver'},
          {label: 'Shop', value: 'shop', slot: 'shop'}
        ]"
              >
                <template v-slot:driver>
                  <div class="row items-center no-wrap">
                    <div class="text-center"></div>
                    <q-icon right name="directions_car"></q-icon>
                  </div>
                </template>

                <template v-slot:shop>
                  <div class="row items-center no-wrap">
                    <div class="text-center"></div>
                    <q-icon right name="store"></q-icon>
                  </div>
                </template>
              </q-btn-toggle>
            </q-card-section>
            <q-card-section class="search-card-element">
              <q-btn-toggle
                v-model="recordType"
                toggle-color="secondary"
                :options="[
          {label: 'Daily', value: 'daily', slot: 'daily'},
          {label: 'Monthly', value: 'monthly', slot: 'monthly'}
        ]"
              >
                <template v-slot:daily>
                  <div class="row items-center no-wrap">
                    <div class="text-center"></div>
                    <q-icon right name="insert_invitation"></q-icon>
                  </div>
                </template>

                <template v-slot:monthly>
                  <div class="row items-center no-wrap">
                    <div class="text-center"></div>
                    <q-icon right name="event_note"></q-icon>
                  </div>
                </template>
              </q-btn-toggle>
            </q-card-section>
          </div>
          <div class="second-row">
            <q-card-section class="search-card-element">
              <q-input filled v-model="dateSelected" mask="date">
                <template v-slot:append>
                  <q-icon name="event" class="cursor-pointer">
                    <q-popup-proxy ref="qDateProxyEnd">
                      <q-date
                        class="fixed-center"
                        v-model="dateSelected"
                        @input="() => $refs.qDateProxyEnd.hide()"
                      ></q-date>
                    </q-popup-proxy>
                  </q-icon>
                </template>
              </q-input>
            </q-card-section>
            <q-card-section
              v-if="$store.getters.isAdmin && userType == 'driver'"
              class="search-card-element"
            >
              <q-select
                filled
                v-model="regionInp"
                :options="$store.getters.getRegionsForSelect"
                :label="$t('region')"
                emit-value
                map-options
                outlined
              />
            </q-card-section>
            <q-card-section
              v-if="$store.getters.isAdmin && userType == 'driver'"
              class="search-card-element"
            >
              <q-select
                filled
                v-model="driverUserId"
                :options="driversListForRegion"
                :label="$t('driver')"
                emit-value
                map-options
                outlined
              />
            </q-card-section>
            <q-card-section
              v-if="($store.getters.isAdmin ||  $store.getters.isDriver)  && userType == 'shop'"
              class="search-card-element"
            >
              <q-input filled v-model="shopMobileInp" :label="$t('shop')" />
            </q-card-section>
          </div>
        </div>
        <q-separator dark></q-separator>

        <q-card-actions>
          <div class="text-center" style="width:100%; color:black;">
            <q-btn
              color="secondary"
              @click="onSearch"
              style="margin:0px 3px;color:red"
              text-color="yellow"
            >{{$t('search')}}</q-btn>
            <q-btn
              color="warning"
              @click="onClear"
              style="margin:0px 3px;"
              text-color="brown"
            >{{$t('clear')}}</q-btn>
          </div>
        </q-card-actions>
      </q-expansion-item>
    </q-card>

    <q-scroll-area
      :thumb-style="thumbStyle"
      :bar-style="barStyle"
      id="scroll-area-with-virtual-scroll-1"
      :style="generalStyle"
      class="fill-window"
    >
      <q-virtual-scroll
        scroll-target="#scroll-area-with-virtual-scroll-1 > .scroll"
        :items="deliveryList"
        :virtual-scroll-item-size="32"
        class="col"
      >
        <template v-slot="{item}">
          <div class="delivery-list-item">
            <q-item
              clickable
              v-ripple
              @click="routing(item)"
              :dir="$i18n.locale === 'en-us' ?'ltr':'rtl'"
            >
              <q-item-section avatar>
                <q-avatar>
                  <q-icon name="double_arrow" size="2.5rem" :style="rotating" />
                </q-avatar>
              </q-item-section>

              <q-item-section>
                <q-item-label lines="1" class="delivery-list-item-title">{{showTitle(item)}}</q-item-label>
                <q-item-label caption lines="2">
                  <span class="text-weight-bold">{{item.toAddress}} - {{item.docid}}</span>
                </q-item-label>
              </q-item-section>
            </q-item>
          </div>
        </template>
      </q-virtual-scroll>
      <div v-if="showMore" class="text-center">
        <q-btn
          round
          @click="onLoad"
          color="secondary"
          icon="navigation"
          style="transform: rotate(180deg);"
        ></q-btn>
      </div>
    </q-scroll-area>
    <q-page-sticky position="bottom-right" :offset="[18, 18]">
      <q-btn fab icon="arrow_back" color="secondary" @click="$router.go(-1)" />
    </q-page-sticky>
  </q-page>
</template>

<script>
import Vue from "vue";
import { statsDB } from "src/firebase/init.js";
import firebase from "firebase/app";
import "firebase/firestore";

export default Vue.extend({
  name: "StatIndex",
  components: {},

  data() {
    return {
      oppened: true,
      showMore: false,
      offset: 0,
      height: 0,
      userType: "driver",
      recordType: "daily",
      dataRef: null,
      dateSelected: "",
      driverUserId: "",
      shopMobileInp: "",
      regionInp: "",
      lastDoc: null,
      deliveryList: [],
      rotating:
        this.$i18n.locale == "en-us" ? "" : "transform: rotate(180deg);",
      generalStyle: {
        height: "650px",
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
    driversSelection() {
      return this.$store.getters.getriversForSubSelect;
    },

    driversListForRegion() {
      this.driverUserId = "";
      return this.driversSelection[this.regionInp];
    },
    userInfo() {
      return this.$store.state.userInfo;
    },
  },
  watch: {
    oppened() {
      const shifting = this.oppened ? 420 : 100;
      console.log(this.oppened);
      let pageheight = this.height - this.offset - shifting;
      this.generalStyle = {
        height: pageheight + "px",
      };
    },
  },
  methods: {
    onClear() {
      this.dataRef = null;
      this.dateSelected = "";
      this.driverUserId = "";
      this.shopMobileInp = "";
      this.regionInp = "";
      this.deliveryList = [];
    },
    onSearch() {
      //TODO: Form Validation
      console.log("Needs Form Validation");
      this.deliveryList = [];
      this.oppened = false;
      this.fetchData();
    },
    async onLoad() {
      if (this.deliveryList && this.dataRef) {
        this.dataRef = this.dataRef.startAfter(this.lastDoc);

        const querySnapshot = await this.dataRef.get();
        if (!querySnapshot.empty) {
          querySnapshot.forEach((doc) => {
            this.lastDoc = doc;
            this.deliveryList.push({ ...doc.data(), docid: doc.id });
          });
        }
      }
    },
    showTitle(item) {
      return this.$store.getters.isShop ? item.toName : item.fromName;
    },
    async fetchData() {
      const that = this;
      const timestamp = firebase.firestore.Timestamp;
      let ref = statsDB;
      ref = ref.where("recordType", "==", this.recordType);
      ref = ref.where("userType", "==", this.userType);

      // Select the dates if exist
      if (this.dateSelected != "") {
        console.log("dateSelected dateSelected dateSelected");

        const dObj = new Date(this.dateSelected);

        let month = dObj.getMonth() + 1;
        month = month <= 9 ? "0" + month : "" + month;

        let day = dObj.getDate();
        day = day <= 9 ? "0" + day : "" + day;

        const year = dObj.getFullYear();

        ref = ref.where("strYear", "==", year).where("strMonth", "==", month);
        if (this.recordType == "daily") ref = ref.where("strDay", "==", day);
      }

      if (this.driverUserId != "") {
        ref = ref.where("userID", "==", this.driverUserId.trim());
      }
      if (this.shopMobileInp != "") {
        ref = ref.where("userID", "==", this.shopMobileInp);
      }

      this.dataRef = ref;
      const querySnapshot = await ref.get();

      console.log(querySnapshot.empty);
      if (!querySnapshot.empty) {
        querySnapshot.forEach(function (doc) {
          that.lastDoc = doc;
          that.deliveryList.push({ ...doc.data(), docid: doc.id });
        });
      }
    },

    routing(delivery) {
      this.$router.push({
        name: "ShowDelivery",
        params: { delivery, fromArchive: true },
      });
    },
    styleFn(offset, height) {
      this.height = height;
      this.offset = offset;
      let pageheight = height - offset - 420;
      this.generalStyle = {
        height: pageheight + "px",
      };
    },
  },
});
</script>
<style>
#stat {
  padding: 20px;
}
.stat-card-content {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-content: center;
}
.first-row {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: center;
  align-content: center;
}
.second-row {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: center;
  align-content: center;
}
.stat-card-content .first-row > *,
.second-row > * {
  margin: 5px;
}
.search-card-element {
  min-width: 330px;
  min-width: 330px;
  margin: 2px;
  padding: 0px;
}
.search-card-element .q-field {
  margin: 0px;
  padding: 0px;
}
.search-card {
  width: 100%;
}
#page-delivery {
  box-sizing: border-box;
  padding: 5px;
}
.expantionLable {
  font-size: 1.6em;
  color: #105783;
  text-align: center;
}
</style>
