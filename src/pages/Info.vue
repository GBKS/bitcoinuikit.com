<template>
  <div class="info-page">
    <SiteInfo 
      :figmaLink="figmaLink" 
      :androidLink="androidLink"
    />
  </div>
</template>

<script>
import SiteInfo from '@/components/SiteInfo.vue'

export default {
  name: 'InfoPage',
  
  components: {
    SiteInfo
  },

  props: [
    'screenSize'
  ],

  beforeMount() {
    document.title = 'Info | Bitcoin UI Kit'
  },

  data() {
    return {
      figmaLink: {
        name: 'Duplicate on Figma',
        url: 'https://www.figma.com/community/file/916680391812923706/Bitcoin-Wallet-UI-Kit-(work-in-progress)'
      },
      androidLink: {
        name: 'Get it for Android',
        url: 'https://www.figma.com/community/file/1134903010470945356'
      },
      toggled: false
    }
  },

  methods: {
    toggle() {
      this.toggled = !this.toggled
    }
  }
}
</script>

<style lang="scss">

.info-page {
  display: flex;
  flex-direction: column;
  align-items: center;
  @include r('gap', 25, 50);
  @include r('padding-top', 10, 20);
}

</style>
