<template>
  <div id="app">
    <InstallBanner v-if="notInstalled" v-on:install-app="installApp"></InstallBanner>

    <UpdateBanner v-if="isRefresh" v-on:refresh-app="updateApp" ></UpdateBanner>

    <img alt="Vue logo" src="./assets/logo.png" />
    <h1>PWA</h1>
    <p>With Notifications , Install and Update!</p>

    
  </div>
</template>

<script>
import InstallBanner from "./components/InstallBanner.vue";
import UpdateBanner from "./components/UpdateBanner.vue";
export default {
  name: "App",
  components: { InstallBanner, UpdateBanner },

  data: function () {
    return {
      registration: null,
      isRefresh: false,
      refreshing: false,
      deferredPrompt: null,
      notInstalled: false,
    };
  },
  methods: {
    appUpdateUI(e) {
      this.registration = e.detail;
      this.isRefresh = true;
    },
    updateApp() {
      /**
       * ACCEPTS UPDATE
       */
      this.isRefresh = false;
      if (this.registration || this.registration.waiting) {
        this.registration.waiting.postMessage({ type: "SKIP_WAITING" });
      }
    },
    async installApp() {
      /**
       * HANDLES APP INSTALL
       */

      if (this.deferredPrompt !== null) {


        this.deferredPrompt.prompt();

        const { outcome } = await this.deferredPrompt.userChoice;

        if (outcome === "accepted") {

          /**
           * IF USER INSTALLS
           */

          this.deferredPrompt = null;

        }
      }
    },
  },
  created() {

    /**
     * HANDLES INSTALL PROMPT
     */
    window.addEventListener("beforeinstallprompt", (e) => {
      e.preventDefault();      
      this.deferredPrompt = e;
        this.notInstalled = true;
    });


    /**
     * IF NEW UPDATE
     */
    document.addEventListener("serviceWorkerUpdateEvent", this.appUpdateUI, {
      once: true,
    });


    navigator.serviceWorker.addEventListener("controllerchange", () => {
      if (this.refreshing) return;
      this.refreshing = true;
      window.location.reload();
    });


  },
};
</script>

<style scoped>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;

}

h1 {
  font-size: 64px;
}

p {
  font-style: italic;
}

</style>
