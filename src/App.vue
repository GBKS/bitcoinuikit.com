<template>
  <SiteNav />
  <PageTitle />
  <router-view
    :screenSize="screenSize"
    :color="color"
    :mode="mode"
    :type="type"
    @setColor="setColor"
    @setMode="setMode"
    @setType="setType"
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
      screenSize: this.getScreenSize(),
      color: 'default',
      mode: 'light',
      type: 'inter'
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
    },

    setColor(value) {
      this.color = value
      this.updateTheme()
    },

    setMode(value) {
      this.mode = value
      this.updateTheme()
    },

    setType(value) {
      this.type = value
      this.updateType()
    },

    updateTheme() {
      if(this.currentTheme) {
        document.body.classList.remove(this.currentTheme)
        this.currentTheme = null
      }

      this.currentTheme = '--theme-'+this.color+'-'+this.mode
      document.body.classList.add(this.currentTheme)
    },

    updateType() {
      if(this.currentType) {
        document.body.classList.remove(this.currentType)
        this.currentType = null
      }

      this.currentType = '--type-'+this.type
      document.body.classList.add(this.currentType)
    }
  }
}

</script>

<style>
  
</style>
