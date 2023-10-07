<template>
  <div id="app" class="is-max-desktop">
    <router-view />
    <notifications position="top center" />
  </div>
</template>

<script>
export default {
  name: "App",
};
</script>

<style>
@import "~bulma/css/bulma.css";
</style>
