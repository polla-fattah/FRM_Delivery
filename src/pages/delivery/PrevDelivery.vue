<template>
  <q-page id="prev-delivery" class="column" :style-fn="styleFn">
    <q-card class="search-card bg-secondary text-white">
      <div class="search-card-content">
        <q-card-section class="search-card-element">
          <q-input filled v-model="dateStart" mask="date">
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
          <q-input filled v-model="dateEnd" mask="date">
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
        <q-card-section class="search-card-element">
          <q-input v-model="driverMobileInp" label="Driver" />
        </q-card-section>
        <q-card-section class="search-card-element">
          <q-input v-model="shopMobileInp" label="Shop" />
        </q-card-section>
        <q-card-section class="search-card-element">
          <q-input v-model="receiverMobileInp" label="Reciver" />
        </q-card-section>
        <q-card-section class="search-card-element">
          <q-input v-model="regionInp" label="Region" />
        </q-card-section>
      </div>
      <q-separator dark></q-separator>

      <q-card-actions>
        <q-btn @click="onSearch">Search</q-btn>
        <q-btn @click="onClear">Clear</q-btn>
      </q-card-actions>
    </q-card>

    <q-infinite-scroll @load="onLoad" :offset="250">
      <div v-for="(item, index) in deliveryList" :key="index" class="caption">
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
            <q-item-label lines="1">{{showTitle(item)}}</q-item-label>
            <q-item-label caption lines="2">
              <span class="text-weight-bold">{{item.items}} - {{item.price}}</span>
            </q-item-label>
          </q-item-section>
        </q-item>
      </div>
      <template v-slot:loading>
        <div class="row justify-center q-my-md">
          <q-spinner-dots color="primary" size="40px"></q-spinner-dots>
        </div>
      </template>
    </q-infinite-scroll>

    <q-page-sticky position="bottom-right" :offset="[18, 18]">
      <q-btn fab icon="arrow_back" color="secondary" @click="$router.go(-1)" />
    </q-page-sticky>
  </q-page>
</template>

<script>
import Vue from "vue";
import { deliveryDB } from "src/firebase/init.js";

export default Vue.extend({
  name: "PrevDelivery",
  components: {},

  data() {
    return {
      dataRef: null,
      dateStart: "",
      dateEnd: "",
      driverMobileInp: "",
      receiverMobileInp: "",
      shopMobileInp: "",
      regionInp: "",
      lastDoc: null,

      deliveryList: [],
      rotating:
        this.$i18n.locale == "en-us" ? "" : "transform: rotate(180deg);",
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
    userInfo() {
      return this.$store.state.userInfo;
    }
  },

  methods: {
    onClear() {
      this.dataRef = null;
      this.dateStart = "";
      this.dateEnd = "";
      this.driverMobileInp = "";
      this.receiverMobileInp = "";
      this.shopMobileInp = "";
      this.regionInp = "";
      this.deliveryList = [];
    },
    onSearch() {
      this.fetchData();
    },
    async onLoad(index, done) {
      console.log("TTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTT");

      if (this.deliveryList && this.dataRef) {
        this.dataRef = this.dataRef.startAfter(this.lastDoc);

        const querySnapshot = await this.dataRef.get();
        if (!querySnapshot.empty) {
          querySnapshot.forEach(function(doc) {
            console.log("0 0 0 0 0 0 0 0 0 0 0 0 0 0 0  0 0 0 0 ");
            console.log(doc.data().fromName);
            console.log("0 0 0 0 0 0 0 0 0 0 0 0 0 0 0  0 0 0 0 ");
            that.lastDoc = doc;
            that.deliveryList.push({ ...doc.data(), docid: doc.id });
          });
          done();
        } else {
          done(ture);
        }
      }
    },
    showTitle(item) {
      return this.$store.getters.isShop ? item.toName : item.fromName;
    },
    async fetchData() {
      //this.$store.dispatch("fetchDeliveries");
      let that = this;
      let ref = deliveryDB;
      if (this.$store.getters.isDriver) {
        ref = ref.where("driverID", "==", this.userInfo.id);
      } else if (this.$store.getters.isShop) {
        ref = ref.where("fromId", "==", this.userInfo.id);
      }
      ref = ref.limit(6);
      this.dataRef = ref;
      const querySnapshot = await ref.get();
      if (!querySnapshot.empty) {
        querySnapshot.forEach(function(doc) {
          console.log("0 0 0 0 0 0 0 0 0 0 0 0 0 0 0  0 0 0 0 ");
          console.log(doc.data().fromName);
          console.log("0 0 0 0 0 0 0 0 0 0 0 0 0 0 0  0 0 0 0 ");
          that.lastDoc = doc;
          that.deliveryList.push({ ...doc.data(), docid: doc.id });
        });
      }
    },

    routing(delivery) {
      if (this.$store.getters.isDriver)
        this.$router.push({ name: "ShowDelivery", params: { delivery } });
      else if (this.$store.getters.isShop)
        this.$router.push({
          name: "EditDelivery",
          params: { delivery: delivery, role: this.$store.getters.getRole }
        });
      else if (this.$store.getters.isAdmin)
        this.$router.push({ name: "AssignDriver", params: { delivery } });
    },
    styleFn(offset, height) {
      let pageheight = height - offset - 10;
      this.generalStyle = {
        height: pageheight + "px"
      };
    }
  }
});
</script>
<style>
.search-card-content {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-around;
  align-content: center;
}
.search-card-element {
  min-width: 250px;
  min-width: 250px;
  margin: 0px;
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
.polla {
  margin: auto 1.5em;
  display: inline-block;
}
</style>
