<template>
  <div id="install-banner" v-if="shown">
    <span>Use Our App For Better Experince</span>
    <button @click="doInstall">Install App</button>

    <span class="closeBanner" @click="shown = false">&times;</span>
  </div>
</template>

<script>
export default {
  name: "InstallBanner",
  data: function(){
    return{
      shown: true
    }
  },
  methods: {
    doInstall() {
      this.$emit("install-app");
    },
  },
};
</script>

<style scoped>
#install-banner {
  background: #2a9b4c;
  padding: 30px 70px;
  display: flex;
  justify-content: center;
  align-items: center;
  color: white;
}

button {
  color: white;
  background: transparent;
    border: 1px solid white;
  cursor: pointer;
  margin:0 30px;
  padding: 5px 20px;
  border-radius: 5px;
}

.closeBanner{
  font-size: 30px;
  color: white;
  cursor: pointer;
}
</style>
