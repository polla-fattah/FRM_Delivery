<template>
  <q-page id="page-delivery" class="column" :style-fn="styleFn">
    <q-list>
      <q-item-section class="list-header">
        <div id="page-title" :dir="$i18n.locale === 'en-us' ?'ltr':'rtl'">{{$t('delivery')}}</div>
      </q-item-section>

      <q-item-section id="delivery-noresult-container" v-if="deliveryList.length == 0">
        <q-img src="~assets/askdelivery.png" style="width:90wv" spinner-color="white"  />
        <q-item-label class="delivery-noresult">{{$t('noResult')}}</q-item-label>
      </q-item-section>
      <q-scroll-area
        v-else
        :thumb-style="thumbStyle"
        :bar-style="barStyle"
        id="scroll-area-with-virtual-scroll-1"
        :style="generalStyle"
        class="fill-window"
      >
        <q-virtual-scroll
          scroll-target="#scroll-area-with-virtual-scroll-1 > .scroll"
          :items="deliveryList"
          :virtual-scroll-item-size="16"
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
                    <q-icon name="double_arrow" size="2.5rem" :style="rotating(item.status)" />
                  </q-avatar>
                </q-item-section>

                <q-item-section>
                  <q-item-label lines="1" class="delivery-list-item-title">{{showTitle(item)}}</q-item-label>
                  <q-item-label caption lines="2">
                    <span class="delivery-list-item-subtitle">{{item.toAddress}}</span>
                  </q-item-label>
                </q-item-section>
              </q-item>
            </div>
          </template>
        </q-virtual-scroll>
        <q-img src="~assets/loading.png" spinner-color="white" style="width:30vw"/>
      </q-scroll-area>
    </q-list>
    <q-page-sticky position="bottom-right" :offset="[18, 18]" v-if="$store.getters.isShop">
      <q-btn fab icon="add" color="dark" style="background:#105783;" @click="goToAddTask" />
    </q-page-sticky>
  </q-page>
</template>

<script>
import Vue from "vue";
import { deliveryDB } from "src/firebase/init.js";

export default Vue.extend({
  name: "PageIndex",
  components: {},
  mounted() {
    if (this.userInfo && !this.dataFetched) this.fetchData();
  },
  data() {
    return {
      dataFetched: false,
      seq: 1,
      deliveryList: [],

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
  watch: {
    deliveryList(val) {},
    userInfo(val) {
      if (val && !this.dataFetched) {
        this.fetchData();
      }
    }
  },
  methods: {
    rotating(status) {
      return {
        transform:
          this.$i18n.locale == "en-us" ? "rotate(0deg)" : "rotate(180deg)",
        color:
          status == 50 ? "moccasin" : status == 40 ? "lime" : "DarkSlateBlue"
      };
    },
    showTitle(item) {
      return this.$store.getters.isShop ? item.toName : item.fromName;
    },
    fetchData() {
      /*
      the status change from larger to smaller
      50- created
      40- assigned
      30- picked up (start)
      20- in the storage
      10- returned to the shop
      0-  delivered to the customer

    */
      //this.$store.dispatch("fetchDeliveries");
      this.dataFetched = true;
      let that = this;
      let ref = deliveryDB;
      if (this.$store.getters.isDriver) {
        console.log(
          "this.userInfo.idthis.userInfo.idthis.userInfo.idthis.userInfo.id"
        );
        console.log(this.userInfo.id);
        console.log(
          "this.userInfo.idthis.userInfo.idthis.userInfo.idthis.userInfo.id"
        );
        ref = ref.where("driverID", "==", this.userInfo.id);
        ref = ref.where("status", ">", 11);
      } else if (this.$store.getters.isShop) {
        ref = ref.where("fromId", "==", this.userInfo.id);
        ref = ref.where("status", ">", 11);
      } else if (this.$store.getters.isAdmin) {
        ref = ref.where("status", ">", 11);
      }

      ref.onSnapshot(function(querySnapshot) {
        querySnapshot.docChanges().forEach(function(change) {
          if (change.type === "added") {
            that.deliveryList.push({
              ...change.doc.data(),
              id: change.doc.id,
              key: that.seq
            });
            that.seq++;
          }
          if (change.type === "modified") {
            const condition = element => {
              return element.id === change.doc.id;
            };
            const indx = that.deliveryList.findIndex(condition);
            that.deliveryList[indx] = {
              ...change.doc.data(),
              id: change.doc.id,
              key: that.seq
            };
            that.seq++;
          }
          if (change.type === "removed") {
            that.deliveryList = that.deliveryList.filter(function(element) {
              return element.id !== change.doc.id;
            });
          }
        });
      });
    },
    goToAddTask() {
      if (this.$store.getters.isShop)
        this.$router.push({
          name: "EditDelivery",
          params: { delivery: null, role: this.$store.getters.getRole }
        });
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
      let pageheight = height - offset - 50;
      this.generalStyle = {
        height: pageheight + "px"
      };
    }
  }
});
</script>
<style>
#delivery-noresult-container {
  position: relative;
  text-align: center;
}
.delivery-noresult {
  font-size: 1.5em;
  font-weight: 700;

  position: absolute;
  top: 60%;
  left: 60%;
  transform: translate(-50%, -50%);
}
@media only screen and (max-width: 600px) {
  .delivery-noresult {
    font-size: 1.2em;
    top: 65%;
    left: 55%;
  }
}
#page-title {
  width: 100%;
  color: green;
  font-size: 2em;
  text-align: center;
}

.delivery-list-item {
  /* border: 2px solid red;  */
  border-radius: 15px;
  margin: 0em 2em 0.5em 2em;
  background: linear-gradient(
    135deg,
    rgba(56, 180, 118, 1) 5%,
    rgba(94, 153, 117, 1) 32%,
    rgba(74, 155, 107, 1) 55%,
    rgba(97, 155, 121, 1) 70%,
    rgba(51, 158, 95, 1) 81%,
    rgba(58, 175, 118, 1) 100%
  );
}

.delivery-list-item-title {
  font-size: 1.5em;
}
.delivery-list-item-subtitle {
  font-size: 1.1em;
}
#page-delivery {
  height: 100%;
  padding: 5px;
}
</style>
