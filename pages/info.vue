<template>
  <div class="info-page">
    <SiteInfo :figmaLink="figmaLink" />
  </div>
</template>

<script>
import SiteInfo from '@/components/site/Info.vue'

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
      }
    }
  }
}
</script>

<style lang="scss">

@import '@/assets/css/variables.scss';
@import '@/assets/css/mixins.scss';
@import '@/assets/css/animations.scss';

.info-page {
  display: flex;
  flex-direction: column;
  align-items: center;
  @include r('gap', 25, 50);
  @include r('padding-top', 10, 20);
}

</style>
