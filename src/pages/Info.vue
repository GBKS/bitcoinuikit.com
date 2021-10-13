<template>
  <div class="info-page">
    <SiteInfo :figmaLink="figmaLink" />
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

  data() {
    return {
      figmaLink: {
        name: 'Duplicate on Figma',
        url: 'https://www.figma.com/community/file/916680391812923706/Bitcoin-Wallet-UI-Kit-(work-in-progress)'
      }
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
