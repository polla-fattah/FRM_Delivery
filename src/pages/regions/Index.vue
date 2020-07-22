<template>
  <q-page id="page-region" class="column" :style-fn="styleFn">
    <q-list :dir="$i18n.locale === 'en-us' ?'ltr':'rtl'">
      <q-item-section class="list-header">
        <div id="page-title" :dir="$i18n.locale === 'en-us' ?'ltr':'rtl'">{{$t('region')}}</div>
      </q-item-section>

      <q-scroll-area
        :thumb-style="thumbStyle"
        :bar-style="barStyle"
        id="scroll-area-with-virtual-scroll-1"
        :style="generalStyle"
        class="fill-window"
      >
        <q-virtual-scroll
          scroll-target="#scroll-area-with-virtual-scroll-1 > .scroll"
          :items="regions"
          :virtual-scroll-item-size="32"
          separator
          class="col"
        >
          <template v-slot="{item, index}">
            <q-item clickable v-ripple @click="routing(index)" class="list-item">
              <q-item-section avatar>
                <q-avatar>
                  <q-icon name="double_arrow" size="2.5rem" :style="rotating(item.status)" />
                </q-avatar>
              </q-item-section>

              <q-item-section>
                <q-item-label lines="1" style="font-size: 1.5em;">{{item.name}}</q-item-label>
                <q-item-label caption lines="2">
                  <span class="text-weight-bold">{{item.items}}</span>
                </q-item-label>
              </q-item-section>
            </q-item>
          </template>
        </q-virtual-scroll>
      </q-scroll-area>
    </q-list>
    <q-page-sticky position="bottom-right" :offset="[18, 18]" v-if="$store.getters.isAdmin">
      <q-btn fab icon="add" color="secondary" @click="goToAddTask" />
    </q-page-sticky>
  </q-page>
</template>

<script>
import Vue from "vue";

export default Vue.extend({
  name: "PageIndex",
  components: {},
  data() {
    return {
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
    regions() {
      return this.$store.getters.getRegions;
    }
  },
  methods: {
    rotating(status) {
      return {
        transform:
          this.$i18n.locale == "en-us" ? "rotate(0deg)" : "rotate(180deg)",
        color: "#26A69A"
      };
    },
    goToAddTask() {
      this.$router.push({
        name: "EditRegion",
        params: { regionIndx: null }
      });
    },
    routing(regionIndx) {
      this.$router.push({ name: "EditRegion", params: { regionIndx } });
    },
    styleFn(offset, height) {
      let pageheight = height - offset - 60;
      this.generalStyle = {
        height: pageheight + "px"
      };
    }
  }
});
</script>
<style>
#page-region {
  box-sizing: border-box;
  padding: 5px;
}
.list-item {
  /* border: 2px solid red;  */
  border-radius: 15px;
  margin: 0em 2em 0.5em 2em;
  background: linear-gradient(to left, #43cea28f, #185b9d8c);
  box-shadow: 1px 0px 5px 0px rgba(0, 0, 0, 0.75);
}
.list-item:nth-child(even) {
  background: rgba(175, 233, 168, 0.521);
}
.list-item:nth-child(odd) {
  background: rgba(169, 176, 216, 0.459);
}
</style>

