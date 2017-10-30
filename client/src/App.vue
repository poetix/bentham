<template>
  <div id="app" class="container">
      <router-view></router-view>
  </div>
</template>

<script>


export default {
  name: 'app',
  props: [ 'siteBasePath', 'lambdaPath' ],
  computed: {
      userToken: function() {
        return getUserToken()
      }    
  },
  mounted: function() {
    this.$nextTick(function() {
      console.log('App: lambda: ' + this.lambdaPath)
      console.log('App: site: ' + this.siteBasePath)
    })

  },  
}
</script>

<style>

</style>
