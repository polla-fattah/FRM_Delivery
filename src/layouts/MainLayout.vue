<template>
  <q-layout view="lHh Lpr fff" class="bg-grey-1">
    <q-header elevated class="bg-white text-grey-8" height-hint="64">
      <q-toolbar class="GPL__toolbar" style="height: 64px">
        <q-btn
          flat
          dense
          round
          @click="leftDrawerOpen = !leftDrawerOpen"
          aria-label="Menu"
          icon="menu"
          class="q-mx-md"
        />
        
        <q-toolbar-title class="row items-center no-wrap">
          <span id="logo">
            <span id="frmLogo">
              <img class="q-pl-md" style="width:130px;" src="~assets/logo.png" />
            </span>
            <span :style="userName">{{$store.getters.getUserName}}</span>
          </span>
        </q-toolbar-title>

      </q-toolbar>
    </q-header>

    <q-drawer v-model="leftDrawerOpen" bordered behavior="mobile" @click="leftDrawerOpen = false">
      <q-scroll-area class="fit">
        <q-toolbar class="GPL__toolbar">
          <q-toolbar-title class="row items-center text-grey-8">
            <img class="q-pl-md" src="~assets/logo.png" />
          </q-toolbar-title>
        </q-toolbar>

        <q-list padding>
          <template v-for="link in links">
            <template v-if="canSee(link.level)">
              <q-item
                clickable
                class="GPL__drawer-item"
                @click="navigate(link)"
                :key="link.text"
              >
                <q-item-section avatar>
                  <q-icon size="2em" color="secondary" :name="link.icon" />
                </q-item-section>
                <q-item-section>
                  <q-item-label>{{ link.text }}</q-item-label>
                </q-item-section>
              </q-item>
            </template>
          </template>
          <q-item class="GPL__drawer-item">
            <q-item-section id="menu-language">
              <div class="langu lang2" @click="changeLang('krd')">کوردی</div>
              <div class="langu lang2" @click="changeLang('ar')">عربي</div>
              <div class="langu" @click="changeLang('en-us')">English</div>
            </q-item-section>
          </q-item>
        </q-list>
      </q-scroll-area>
    </q-drawer>

    <q-page-container class="GPL__page-container">
      <router-view />

      <q-page-sticky v-if="$q.screen.gt.sm" expand position="left">
        <div class="fit q-pt-xl q-px-sm column">
          <template v-for="link in links">
            <template v-if="canSee(link.level)">
              <q-btn
                round
                flat
                color="grey-8"
                stack
                no-caps
                size="26px"
                class="GPL__side-btn main-menu-big-icons"
                :key="link.text"
                @click="navigate(link)"
              >
                <q-icon size="1.4em" :name="link.icon" />
                <div class="GPL__side-btn__label">{{link.text}}</div>
              </q-btn>
            </template>
          </template>
          <q-btn
            round
            flat
            color="grey-8"
            stack
            no-caps
            size="26px"
            class="language-activate-button"
            @click="navigate('pp')"
          >
            <q-icon size="1.4em" name="language" />
            <div class="GPL__side-btn__label">{{$t('language')}}</div>
            <div id="language-menu">
              <div
                v-if="$i18n.locale!='krd'"
                class="language-menu-item lang3"
                @click="changeLang('krd')"
              >کوردی</div>
              <div
                v-if="$i18n.locale!='ar'"
                class="language-menu-item lang3"
                @click="changeLang('ar')"
              >عربي</div>
              <div
                v-if="$i18n.locale!='en-us'"
                class="language-menu-item"
                @click="changeLang('en-us')"
              >English</div>
            </div>
          </q-btn>
        </div>
      </q-page-sticky>
    </q-page-container>
  </q-layout>
</template>

<script>
import { auth, functions } from "src/firebase/init.js";
//import Store from "src/store/index.js";

export default {
  name: "mainLayout",

  data() {
    return {
      leftDrawerOpen: false,
      userName: {
        color:
          this.$store.getUserRole == "admin"
            ? "red"
            : this.$store.getUserRole == "driver"
            ? "green"
            : "gray",
        padding: "0px 0px 0px 30px",
        fontSize: "0.8em"
      },
      links: [
        {
          icon: "inbox",
          text: this.$t("delivery"),
          type: "link",
          url: "Delivery",
          level: ["driver", "shop", "admin"]
        },

        {
          icon: "book",
          text: this.$t("archive"),
          type: "link",
          url: "PrevDelivery",
          level: ["driver", "shop", "admin"]
        },
        {
          icon: "article",
          text: this.$t("stat"),
          type: "link",
          url: "Delivery",
          level: ["driver", "shop", "admin"]
        },
        {
          icon: "store",
          text: this.$t("edit_shops"),
          type: "link",
          url: "SearchShops",
          level: ["driver", "admin"]
        },
        {
          icon: "local_shipping",
          text: this.$t("edit_regions"),
          type: "link",
          url: "ShowRegions",
          level: ["admin"]
        },
        {
          icon: "people",
          text: this.$t("sharing"),
          type: "method",
          url: "addRole",
          level: ["none"]
        },
        {
          icon: "power_settings_new",
          text: this.$t("logout"),
          type: "method",
          url: "logout",
          level: ["driver", "shop", "admin"]
        }
      ]
    };
  },
  methods: {
    changeLang(lang) {
      localStorage.setItem("language", lang);
      location.reload();
    },
    canSee(level) {
      if (!this.$store.state.claims) return false;
      if (!level) return true;

      return level.includes(this.$store.state.claims.role);
    },
    navigate(link) {
      this.leftDrawerOpen = false;
      if (link.type == "link") this.$router.push({ name: link.url });
      else if (link.type == "method") this[link.url]();
    },
    addRole() {
      console.log("Adding . . . ");

      const addRoles = functions.httpsCallable("addRoles");
      addRoles({
        mobile: "+9641111111111",
        role: "admin"
      }).then(result => {
        console.log(result);
      });
    },
    logout() {
      auth.signOut().then(() => {});
      this.$store.commit("setUser", null);
      this.$store.commit("setClaims", null);
      this.$router.push("/");
    }
  }
};
</script>

<style lang="scss">
#logo #frmLogo {
  font-size: 1.7em;
}

.language-activate-button {
  position: relative;
}
.language-activate-button #language-menu {
  position: absolute;
  display: none;
  justify-content: space-evenly;
  background-color: rgba(209, 203, 203, 0.589);
  opacity: 0.8;
  left: 60px;
  top: 30px;
  transition-duration: 2s;
}
.language-activate-button:hover #language-menu {
  display: flex;
}
.language-menu-item {
  display: inline-block;
  margin: 0px;
  padding: 0px 10px;
  font-size: 0.6em;
}

.language-menu-item:hover {
  color: $secondary;
}
.lang3 {
  font-size: 0.8em;
}
#menu-language {
  display: flex;
  flex-direction: row;
  justify-content: space-evenly;
}
.langu {
  display: inline-block;
  font-size: 1.1em;
  cursor: pointer;
}
.lang2 {
  font-size: 1.25em;
}
.langu:hover {
  color: green;
}
.main-menu-big-icons * {
  color: gray;
}
.main-menu-big-icons:hover * {
  color: $secondary;
}
.GPL__toolbar #logo {
  width: 100px;
  color: green;
}
.GPL__toolbar {
  height: 64px;
}

.GPL__toolbar-input {
  width: 35%;
}

.GPL__drawer-item {
  line-height: 24px;
  border-radius: 0 24px 24px 0;
  margin-right: 12px;
}

.GPL__drawer-item .q-item__section--avatar {
  padding-left: 12px;
}

.GPL__drawer-item .q-item__section--avatar .q-icon {
  color: #0b2e5a;
}

.GPL__drawer-item .q-item__label:not(.q-item__label--caption) {
  color: #3c4043;
  letter-spacing: 0.01785714em;
  font-size: 0.875rem;
  font-weight: 500;
  line-height: 1.25rem;
}

.GPL__side-btn__label {
  font-size: 12px;
  line-height: 24px;
  letter-spacing: 0.01785714em;
  font-weight: 500;
}

@media (min-width: 1024px) {
  .GPL__page-container {
    padding-left: 94px;
  }
}
</style>
