(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([[5],{3911:function(t,e,i){"use strict";var s=i("8b93"),a=i.n(s);a.a},"8b93":function(t,e,i){},f778:function(t,e,i){"use strict";i.r(e);var s=function(){var t=this,e=t.$createElement,i=t._self._c||e;return i("q-page",{staticClass:"column",attrs:{id:"page-show-delivery","style-fn":t.styleFn}},[i("q-card",[i("q-card-section",{attrs:{id:"detail"}},[i("div",{staticClass:"text-h4 text-center",staticStyle:{color:"#105783"}},[t._v(t._s(t.$t("delivery_details")))]),i("div",{staticClass:"delivery-info text-subtitle2"},[i("div",{staticClass:"delivery-info-item"},[i("span",{staticClass:"delivery-info-item-lable"},[t._v(t._s(t.$t("from"))+" :")]),i("a",{staticClass:"delivery-info-item-data",attrs:{href:"tel:"+t.delivery.fromMobile}},[t._v(t._s(t.delivery.fromName))])]),i("div",{staticClass:"delivery-info-item"},[i("span",{staticClass:"delivery-info-item-lable"},[t._v(t._s(t.$t("address"))+" :")]),i("span",{staticClass:"delivery-info-item-data"},[t._v("\n            "+t._s(t.delivery.fromAddress)+"\n          ")])]),i("q-separator"),i("div",{staticClass:"delivery-info-item"},[i("span",{staticClass:"delivery-info-item-lable"},[t._v(t._s(t.$t("to"))+" :")]),i("a",{staticClass:"delivery-info-item-data",attrs:{href:"tel:"+t.delivery.toMobile}},[t._v(t._s(t.delivery.toName))])]),i("div",{staticClass:"delivery-info-item"},[i("span",{staticClass:"delivery-info-item-lable"},[t._v(t._s(t.$t("address"))+" :")]),i("span",{staticClass:"delivery-info-item-data"},[t._v("\n            "+t._s(t.delivery.toAddress)+"\n          ")])]),i("q-separator"),i("div",{staticClass:"delivery-info-item"},[i("span",{staticClass:"delivery-info-item-lable"},[t._v(t._s(t.$t("items"))+" :")]),i("span",{staticClass:"delivery-info-item-data"},[t._v(t._s(t.delivery.items))])]),i("div",{staticClass:"delivery-info-item"},[i("span",{staticClass:"delivery-info-item-lable"},[t._v(t._s(t.$t("price"))+" :")]),i("span",{staticClass:"delivery-info-item-data"},[t._v(t._s(t.delivery.price))])]),50!=t.delivery.status?i("q-separator"):t._e(),50!=t.delivery.status?i("div",{staticClass:"delivery-info-item"},[i("span",{staticClass:"delivery-info-item-lable"},[t._v(t._s(t.$t("driver"))+" :")]),i("span",{staticClass:"delivery-info-item-data"},[t._v(t._s(t.delivery.driverName))])]):t._e()],1)])],1),50==t.delivery.status?i("div",{staticClass:"text-h4 text-center",staticStyle:{color:"#105783"}},[t._v(t._s(t.$t("drivers")))]):t._e(),50==t.delivery.status?i("q-scroll-area",{staticClass:"fill-window",style:t.generalStyle,attrs:{"thumb-style":t.thumbStyle,"bar-style":t.barStyle,id:"scroll-area-with-virtual-scroll-1"}},[i("q-virtual-scroll",{staticClass:"col",attrs:{"scroll-target":"#scroll-area-with-virtual-scroll-1 > .scroll",items:t.driversList,"virtual-scroll-item-size":32,separator:""},scopedSlots:t._u([{key:"default",fn:function(e){var s=e.item;return[i("q-item",{directives:[{name:"ripple",rawName:"v-ripple"}],staticClass:"driver-list-item",attrs:{clickable:""},on:{click:function(e){return t.assignDriver(s)}}},[i("q-item-section",{attrs:{avatar:""}},[i("q-avatar",[i("q-icon",{staticClass:"icon-class",attrs:{name:"local_shipping"}})],1)],1),i("q-item-section",[i("q-item-label",{staticClass:"driver-name",attrs:{lines:"1"}},[t._v(t._s(s.name))]),i("q-item-label",{attrs:{caption:"",lines:"2"}},[i("span",{staticClass:"text-weight-bold"},[t._v(t._s(s.car))])])],1)],1)]}}],null,!1,2826355045)})],1):t._e(),i("q-page-sticky",{attrs:{position:"bottom-right",offset:[18,18]}},[i("q-btn",{attrs:{fab:"",icon:"arrow_back",color:"secondary"},on:{click:function(e){return t.back()}}})],1)],1)},a=[],r=(i("498a"),i("c973")),l=i.n(r),o=i("2b0e"),n=i("032d"),d=o["a"].extend({name:"AssignDriver",components:{},mounted(){},props:["delivery"],data(){return{seq:1,generalStyle:{height:"450px"},thumbStyle:{right:"3px",borderRadius:"4px",backgroundColor:"#0299e3",width:"8px",opacity:.75},barStyle:{borderRadius:"8px",backgroundColor:"#999999",width:"14px",opacity:.2,marginTop:"-3px",marginBottom:"-3px",paddingTop:"3px",paddingBottom:"3px"}}},computed:{user:function(){return this.$user},driversList(){const t=this.delivery.regionID,e=e=>e.docid.trim()==t.trim(),i=this.$store.state.regions.find(e);return console.log(i.drivers),i.drivers}},methods:{back(){this.$router.go(-1)},showTitle(t){return this.seq++,"name "},assignDriver(t){var e=this;return l()((function*(){try{console.log(t),yield n["c"].doc(e.delivery.id).update({driverID:t.userId,driverName:t.name,status:40})}catch(i){console.error(i)}e.$router.go(-1)}))()},styleFn(t,e){let i=e-t-430;this.generalStyle={height:i+"px"}}}}),c=d,v=(i("3911"),i("2877")),m=i("9989"),p=i("f09f"),y=i("a370"),u=i("eb85"),f=i("4983"),_=i("a12b"),b=i("66e5"),C=i("4074"),h=i("cb32"),g=i("0016"),q=i("0170"),x=i("de5e"),w=i("9c40"),S=i("714f"),$=i("eebe"),k=i.n($),Q=Object(v["a"])(c,s,a,!1,null,null,null);e["default"]=Q.exports;k()(Q,"components",{QPage:m["a"],QCard:p["a"],QCardSection:y["a"],QSeparator:u["a"],QScrollArea:f["a"],QVirtualScroll:_["a"],QItem:b["a"],QItemSection:C["a"],QAvatar:h["a"],QIcon:g["a"],QItemLabel:q["a"],QPageSticky:x["a"],QBtn:w["a"]}),k()(Q,"directives",{Ripple:S["a"]})}}]);