<template>
  <div id="updateBanner">
    <span>New Update Available!</span>
    <button @click="refresh">Refresh Now</button>
  </div>
</template>

<script>
export default {
  name: "UpdateBanner",
  methods: {
    refresh() {
      this.$emit("refresh-app");
    },
  },
};
</script>

<style scoped>
#updateBanner {
  background: #2a9b4c;
  padding: 10px;
  color: white;
  display: flex;
  justify-content: center;
  align-items: center;
}

button {
  color: white;
  border: 1px solid white;
  background-color: transparent;
  cursor: pointer;
  margin-left: 10px;
  padding: 5px 20px;
  border-radius: 5px;
}

@media screen and (max-width: 600px) {
  #updateBanner,
  button {
    font-size: 12px !important;
    font-style: normal !important;
  }
}
</style>
