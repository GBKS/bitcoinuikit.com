<template>
  <SiteNav />
  <PageTitle />
  <router-view
    :screenSize="screenSize"
  ></router-view>
  <SiteFooter />
</template>

<script>
import SiteNav from '@/components/SiteNav.vue'
import PageTitle from '@/components/PageTitle.vue'
import SiteFooter from '@/components/SiteFooter.vue'

export default {
  name: 'App',
  
  components: {
    SiteNav,
    PageTitle,
    SiteFooter
  },

  data() {
    return {
      screenSize: this.getScreenSize()
    }
  },

  beforeMount() {
    window.addEventListener('resize', this.resize.bind(this))
  },

  methods: {
    resize() {
      this.screenSize = this.getScreenSize()
    },

    getScreenSize() {
      let screenSize = 'large'
      const width = window.innerWidth

      if(width < 640) {
        screenSize = 'small'
      } else if(width < 1280) {
        screenSize = 'medium'
      }

      return screenSize
    }
  }
}

</script>

<style>
  
</style>
