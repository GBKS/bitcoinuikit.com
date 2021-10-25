<template>
  <SiteNav />
  <PageTitle />
  <NuxtPage
    :screenSize="screenSize"
  ></NuxtPage>
  <SiteFooter />
</template>

<script>

export default {
  name: 'App',

  data() {
    return {
      screenSize: this.getScreenSize()
    }
  },

  beforeMount() {
    if (process.browser){
      // window.addEventListener('resize', this.resize.bind(this))
    }
  },

  methods: {
    resize() {
      if (process.browser){
        this.screenSize = this.getScreenSize()
      }
    },

    getScreenSize() {
      let screenSize = 'large'
      // const width = window.innerWidth

      // if(width < 640) {
      //   screenSize = 'small'
      // } else if(width < 1280) {
      //   screenSize = 'medium'
      // }

      return screenSize
    }
  }
}

</script>

<style>
  
</style>
