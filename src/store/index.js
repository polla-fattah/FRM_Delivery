import Vue from 'vue'
import Vuex from 'vuex'
import {
  db
} from 'src/firebase/init.js'
// import example from './module-example'

Vue.use(Vuex)


const store = new Vuex.Store({
  state: {
    name: [],
    getUserName: "",
    user: null,
    claims: null,
    userInfo: null,
    regions: [],
    regionSeq: 0
  },
  getters: {
    getRegions(state) {
      return [...state.regions.sort((a, b) => (a.code > b.code) ? 1 : ((b.code > a.code) ? -1 : 0))];
    },
    getRegionsForSelect(state) {
      const r = state.regions
      const result = []
      for (let i = 0; i < r.length; i++) {
        result.push({
          value: r[i].docid,
          label: r[i].name
        })
      }

      return result
    },
    getriversForSubSelect(state) {
      const r = state.regions
      const result = {}
      let drivers = []
      for (let i = 0; i < r.length; i++) {
        drivers = []
        let dr = r[i].drivers

        if (dr && dr.length != 0) {
          drivers = []

          for (let d = 0; d < dr.length; d++) {
            drivers.push({
              value: dr[d].userId,
              label: dr[d].name,
            })
          }
        }
        result[r[i].docid] = drivers

      }

      return result
    },
    getUserID(state) {
      return state.userInfo.id;
    },
    getUserName(state) {
      return state.userInfo && state.userInfo.name ? state.userInfo.name : "";
    },
    getUserRole(state) {
      return state.claims && state.claims.role ? state.claims.role : "";

    },
    getRole(state) {
      return state.claims.role
    },
    isShop(state) {
      return state.user && state.claims && state.claims.role == "shop";
    },
    isAdmin(state) {
      return state.user && state.claims && state.claims.role == "admin";
    },
    isDriver(state) {
      return state.user && state.claims && state.claims.role == "driver";
    },

  },
  mutations: {
    insertRegion(state, doc) {
      if (!doc.data.drivers)
        doc.data.drivers = []

      for (let i = 0; i < doc.data.drivers.length; i++)
        doc.data.drivers[i]["id"] = state.regionSeq++

      state.regionSeq++;
      state.regions.push({
        ...doc.data,
        docid: doc.docid,
        id: state.regionSeq
      })
    },
    updateRegion(state, doc) {

      const condition = element => {
        return element.docid === doc.docid
      };
      const indx = state.regions.findIndex(condition);

      if (!doc.data.drivers)
        doc.data.drivers = []

      for (let i = 0; i < doc.data.drivers.length; i++)
        doc.data.drivers[i]["id"] = state.regionSeq++
      state.regionSeq++;

      state.regions[indx] = {
        ...doc.data,
        docid: doc.docid,
        id: state.regionSeq
      }
      console.log("TTTTTTTTTTTTTTTTTTTTTTTTTTTTTT")
      console.log(state.regions)
      console.log("TTTTTTTTTTTTTTTTTTTTTTTTTTTTTT")
    },
    deleteRegion(state, doc) {
      state.regions = state.regions.filter(element => element.docid != doc.docid);
    },
    setUserInfo(state, data) {
      state.userInfo = data;
    },
    setUser(state, data) {
      state.user = data
    },
    setClaims(state, data) {
      state.claims = data
    },
  },
  actions: {
    async loadRegions({
      commit
    }) {
      try {
        db.collection('deliveryGroup').onSnapshot(function (querySnapshot) {
          querySnapshot.docChanges().forEach(function (change) {
            if (change.type === "added") {
              commit("insertRegion", {
                data: change.doc.data(),
                docid: change.doc.id,
              })
            } else if (change.type === "modified") {
              commit("updateRegion", {
                data: change.doc.data(),
                docid: change.doc.id,
              })
            } else if (change.type === "removed") {
              console.log(change.doc.id)
              commit("deleteRegion", {
                docid: change.doc.id
              })
            }
          });
        });
      } catch (err) {
        console.error(err)
      }
    }
  }
})




export default store
