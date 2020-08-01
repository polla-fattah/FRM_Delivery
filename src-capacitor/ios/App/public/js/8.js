(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([[8],{"46d2":function(e,t,a){"use strict";a.r(t);var i=function(){var e=this,t=e.$createElement,a=e._self._c||t;return a("q-page",{staticClass:"column",attrs:{id:"page-show-delivery"}},[a("q-card",[a("q-card-section",{attrs:{id:"detail"}},[a("div",{staticClass:"text-h4 text-center",staticStyle:{color:"#105783"}},[e._v(e._s(e.$t("delivery_details")))]),a("div",{staticClass:"delivery-info text-subtitle2"},[a("div",{staticClass:"delivery-info-item"},[a("span",{staticClass:"delivery-info-item-lable"},[e._v(e._s(e.$t("from"))+":")]),a("a",{staticClass:"delivery-info-item-data",attrs:{href:"tel:"+e.delivery.fromMobile}},[e._v(e._s(e.delivery.fromName))])]),a("div",{staticClass:"delivery-info-item"},[a("span",{staticClass:"delivery-info-item-lable"},[e._v(e._s(e.$t("address"))+":")]),a("span",{staticClass:"delivery-info-item-data"},[e._v("\n            "+e._s(e.delivery.fromAddress)+"\n          ")])]),a("q-separator"),a("div",{staticClass:"delivery-info-item"},[a("span",{staticClass:"delivery-info-item-lable"},[e._v(e._s(e.$t("to"))+":")]),a("a",{staticClass:"delivery-info-item-data",attrs:{href:"tel:"+e.delivery.toMobile}},[e._v(e._s(e.delivery.toName))])]),a("div",{staticClass:"delivery-info-item"},[a("span",{staticClass:"delivery-info-item-lable"},[e._v(e._s(e.$t("address"))+":")]),a("span",{staticClass:"delivery-info-item-data"},[e._v("\n            "+e._s(e.delivery.toAddress)+"\n          ")])]),a("q-separator"),a("div",{staticClass:"delivery-info-item"},[a("span",{staticClass:"delivery-info-item-lable"},[e._v(e._s(e.$t("items"))+":")]),a("span",{staticClass:"delivery-info-item-data"},[e._v(e._s(e.delivery.items))])]),a("div",{staticClass:"delivery-info-item"},[a("span",{staticClass:"delivery-info-item-lable"},[e._v(e._s(e.$t("price"))+":")]),a("span",{staticClass:"delivery-info-item-data"},[e._v(e._s(e.delivery.price))])])],1)]),a("q-separator",{attrs:{dark:""}}),e.fromArchive?e._e():a("q-card-actions",{staticClass:"row justify-center",attrs:{id:"control"}},[40==e.delivery.status?a("q-btn",{attrs:{color:"dark",label:e.$t("picked")},on:{click:function(t){return e.picked()}}}):e._e(),30==e.delivery.status?a("q-btn",{staticStyle:{width:"120px"},attrs:{size:"16px",color:"dark",label:e.$t("delivered")},on:{click:function(t){return e.deliverd()}}}):e._e(),30==e.delivery.status?a("q-btn",{staticStyle:{width:"120px"},attrs:{size:"16px",color:"positive",label:e.$t("returned")},on:{click:function(t){return e.returned()}}}):e._e()],1)],1),e.fromArchive?e._e():a("div",{ref:"maps_canvas",staticStyle:{width:"100%",height:"500px"},attrs:{id:"map_canvas"}}),a("q-page-sticky",{attrs:{position:"bottom-right",offset:[18,18]}},[a("q-btn",{attrs:{fab:"",icon:"arrow_back",color:"dark"},on:{click:function(t){return e.$router.go(-1)}}})],1),a("q-dialog",{model:{value:e.alert,callback:function(t){e.alert=t},expression:"alert"}},[a("q-card",[a("q-card-section",[a("div",{staticClass:"text-h6"},[e._v("Alert")])]),a("q-card-section",{staticClass:"q-pt-none"},[e._v(e._s(e.alertMsg))]),a("q-card-actions",{attrs:{align:"right"}},[a("q-btn",{directives:[{name:"close-popup",rawName:"v-close-popup"}],attrs:{flat:"",label:"OK",color:"primary"}})],1)],1)],1)],1)},s=[],r=a("ded3"),l=a.n(r),o=a("c973"),n=a.n(o),d=a("2b0e"),c=a("032d");a("e6cf");const v="AIzaSyBP44ygxKKdl1Dtayc3J55yD0NAlCn96jQ",_="gmapsCallback";let p,y;console.log("_________________________"),console.log(d["a"].prototype.$mapInitialized),console.log("_________________________");const m=new Promise((e,t)=>{p=e,y=t});function u(){if(d["a"].prototype.$mapInitialized)return m;d["a"].prototype.$mapInitialized=!0,window[_]=()=>p(window.google);const e=document.createElement("script");return e.async=!0,e.defer=!0,e.src=`https://maps.googleapis.com/maps/api/js?key=${v}&callback=${_}`,e.onerror=y,document.querySelector("head").appendChild(e),m}var f=d["a"].extend({name:"ShowDelivery",props:["delivery","fromArchive"],data(){return{alert:!1,alertMsg:""}},mounted(){var e=this;return n()((function*(){try{const t=e.$store.getters.getLatLng,a=yield u(),i=new a.maps.DirectionsService,s=new a.maps.DirectionsRenderer,r=new a.maps.Map(e.$refs.maps_canvas,{center:{lat:36.1909883,lng:44.0068523},zoom:12,mapTypeId:"roadmap"});s.setMap(r);console.log({lat:e.delivery.fromLat,lng:e.delivery.fromLong}),i.route({origin:{lat:t.lat,lng:t.lng},destination:{lat:e.delivery.fromLat,lng:e.delivery.fromLong},travelMode:"DRIVING"},(function(e,t){t==a.maps.DirectionsStatus.OK?s.setDirections(e):console.error("Directions request failed due to "+t)}))}catch(t){console.error(t)}}))()},computed:{user:function(){return this.$user}},methods:{picked(){this.delivery.status=30,this.updateDelivery()},deliverd(){this.delivery.status=0,this.updateDelivery(),this.$router.go(-1)},returned(){this.delivery.status=10,this.updateDelivery(),this.$router.go(-1)},updateDelivery(){let e=l()({},this.delivery);delete e.id,c["c"].doc(this.delivery.id).set(e)}}}),g=f,h=(a("c07e"),a("2877")),b=a("9989"),C=a("f09f"),w=a("a370"),$=a("eb85"),q=a("4b7e"),k=a("9c40"),D=a("de5e"),x=a("24e8"),S=a("7f67"),A=a("eebe"),Q=a.n(A),z=Object(h["a"])(g,i,s,!1,null,null,null);t["default"]=z.exports;Q()(z,"components",{QPage:b["a"],QCard:C["a"],QCardSection:w["a"],QSeparator:$["a"],QCardActions:q["a"],QBtn:k["a"],QPageSticky:D["a"],QDialog:x["a"]}),Q()(z,"directives",{ClosePopup:S["a"]})},"802a":function(e,t,a){},c07e:function(e,t,a){"use strict";var i=a("802a"),s=a.n(i);s.a}}]);