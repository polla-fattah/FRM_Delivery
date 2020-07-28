<template>
  <q-page id="prev-delivery" class="column" :style-fn="styleFn">
    <q-card class="search-card">
      <q-expansion-item class="expantionLable" :label="$t('archive')" v-model="oppened">
        <div class="search-card-content">
          <q-card-section class="search-card-element">
            <q-input filled v-model="dateStart" mask="date" :label="$t('start')">
              <template v-slot:append>
                <q-icon name="event" class="cursor-pointer">
                  <q-popup-proxy ref="qDateProxyStart">
                    <q-date
                      class="fixed-center"
                      v-model="dateStart"
                      @input="() => $refs.qDateProxyStart.hide()"
                    ></q-date>
                  </q-popup-proxy>
                </q-icon>
              </template>
            </q-input>
          </q-card-section>
          <q-card-section class="search-card-element">
            <q-input filled v-model="dateEnd" mask="date" :label="$t('end')">
              <template v-slot:append>
                <q-icon name="event" class="cursor-pointer">
                  <q-popup-proxy ref="qDateProxyEnd">
                    <q-date
                      class="fixed-center"
                      v-model="dateEnd"
                      @input="() => $refs.qDateProxyEnd.hide()"
                    ></q-date>
                  </q-popup-proxy>
                </q-icon>
              </template>
            </q-input>
          </q-card-section>
          <q-card-section v-if="$store.getters.isAdmin" class="search-card-element">
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
          <q-card-section v-if="$store.getters.isAdmin" class="search-card-element">
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
            v-if="$store.getters.isAdmin ||  $store.getters.isDriver"
            class="search-card-element"
          >
            <q-input filled v-model="shopMobileInp" :label="$t('shop')" />
          </q-card-section>
          <q-card-section class="search-card-element">
            <q-input filled v-model="customerMobileInp" :label="$t('receiver')" />
          </q-card-section>
        </div>

        <q-separator></q-separator>

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
            <q-item clickable v-ripple @click="routing(item)">
              <q-item-section avatar>
                <q-avatar>
                  <q-icon name="double_arrow" size="2.5rem" :style="rotating" />
                </q-avatar>
              </q-item-section>

              <q-item-section>
                <q-item-label lines="1" class="delivery-list-item-title">{{showTitle(item)}}</q-item-label>
                <q-item-label caption lines="2">
                  <span class="text-weight-bold">{{item.toAddress}}</span>
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
import { deliveryDB } from "src/firebase/init.js";
import firebase from "firebase/app";
import "firebase/firestore";
export default Vue.extend({
  name: "PrevDelivery",
  components: {},

  data() {
    return {
      oppened: true,
      dataRef: null,
      dateStart: "",
      showMore: false,
      dateEnd: "",
      driverUserId: "",
      customerMobileInp: "",
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

  methods: {
    onClear() {
      this.dataRef = null;
      this.dateStart = "";
      this.dateEnd = "";
      this.driverUserId = "";
      this.customerMobileInp = "";
      this.shopMobileInp = "";
      this.regionInp = "";
      this.deliveryList = [];
    },
    onSearch() {
      this.deliveryList = [];
      this.oppened = false;
      this.fetchData();
    },
    async onLoad() {
      if (this.deliveryList && this.dataRef) {
        this.dataRef = this.dataRef.startAfter(this.lastDoc);
        this.showMore = false;
        const querySnapshot = await this.dataRef.get();
        if (!querySnapshot.empty) {
          this.showMore = true;
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
      this.showMore = false;
      let that = this;
      let ref = deliveryDB;
      // Select the right user
      if (this.$store.getters.isDriver) {
        ref = ref.where("driverID", "==", this.userInfo.id);
      } else if (this.$store.getters.isShop) {
        ref = ref.where("fromId", "==", this.userInfo.id);
      }

      // Select the dates if exist
      if (this.dateStart != "") {
        console.log("dateStart ");
        const d1 = this.dateStart.split("/").join("-");
        const s1 = firebase.firestore.Timestamp.fromDate(new Date(d1));
        ref = ref.where("t_request", ">=", s1);
      }
      if (this.dateEnd != "") {
        console.log("dateEnd ");

        const d2 = this.dateEnd.split("/").join("-");
        const s2 = firebase.firestore.Timestamp.fromDate(new Date(d2));
        ref = ref.where("t_request", "<=", s2);
      }
      if (this.regionInp != "") {
        console.log("regionInp = ", this.regionInp);
        console.log("|" + this.regionInp + "|");

        ref = ref.where("regionID", "==", this.regionInp);
      }
      if (this.driverUserId != "") {
        console.log("driverUserId = ", this.driverUserId);

        ref = ref.where("driverID", "==", this.driverUserId.trim());
      }
      if (this.shopMobileInp != "") {
        console.log("shopMobileInp ");

        ref = ref.where("fromMobile", "==", this.shopMobileInp);
      }

      if (this.customerMobileInp != "") {
        console.log("customerMobileInp ");

        ref = ref.where("deliveryGroup", "==", this.customerMobileInp);
      }

      ref = ref.limit(10).orderBy("t_request");
      this.dataRef = ref;
      const querySnapshot = await ref.get();
      console.log(querySnapshot.empty);
      if (!querySnapshot.empty) {
        this.showMore = true;
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
      let pageheight = height - offset - 500;
      this.generalStyle = {
        height: pageheight + "px",
      };
    },
  },
});
</script>
<style>
#prev-delivery {
  padding: 20px;
}
.search-card-content {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  align-content: center;
}
.search-card-element {
  max-width: 370px;
  min-width: 270px;
  margin: 2px;
  padding: 0px;
}
.search-card-element .q-field {
  max-width: 370px;
  min-width: 300px;
}
.search-card {
  margin-bottom: 10px;
  width: 100%;
}
#page-delivery {
  box-sizing: border-box;
  padding: 5px;
}
.polla {
  margin: auto 1.5em;
  display: inline-block;
}
.expantionLable {
  font-size: 1.6em;
  color: #105783;
  text-align: center;
}
</style>
