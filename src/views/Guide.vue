<template>
  <v-container>
    <h1>Guide</h1>
    <p>Coming soon...</p>
  </v-container>
</template>
<script>
export default {
  mounted() {
    this.$ga.page({
      page: '/guide',
      title: 'Guide',
      location: window.location.href
    })
  }
}
</script>