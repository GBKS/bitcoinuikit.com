<template>
  <div class="home-page">
    <div class="wrap">
      <Intro />
      <IncludedContent :screenSize="screenSize" />
      <Tabs
        v-if="false"
        :items="links"
      />
    </div>
  </div>
</template>

<script>
import Intro from '@/components/Intro.vue'
import IncludedContent from '@/components/IncludedContent.vue'
import Tabs from '@/components/Tabs.vue'

export default {
  name: 'HomePage',
  
  components: {
    Intro,
    IncludedContent,
    Tabs
  },

  props: [
    'screenSize'
  ],

  beforeMount() {
    document.title = 'Bitcoin UI Kit'
  },

  data() {
    return {
      title: 'Bitcoin UI Kit',
      description: 'This design system and UI kit provides a design foundation for prototypes, concept explorations and open-source projects to kickstart the design process. So you can focus on what makes your Bitcoin product&nbsp;unique.',
      figmaLink: {
        label: 'Duplicate on Figma',
        url: 'https://www.figma.com/community/file/916680391812923706/Bitcoin-Wallet-UI-Kit-(work-in-progress)'
      },
      links: [
        {
          label: 'Info',
          to: '/info'
        },
        {
          label: 'Foundation',
          to: '/foundation'
        },
        {
          label: 'Screens',
          to: '/screens'
        }
      ]
    }
  }
}
</script>

<style lang="scss">

.home-page {
  background-color: #F4F4F4;
  transition: background-color 250ms $ease;

  > .wrap {
    width: 100%;
    max-width: 1536px;
    padding-left: 20px;
    padding-right: 20px;
    box-sizing: border-box;
    margin-left: auto;
    margin-right: auto;

    p,
    ul li {
      @include r('font-size', 16, 22);
      color: var(--neutral-7);
      line-height: 1.6;

      a {
        color: var(--primary);
        text-decoration: none;
        transition: all 100ms $ease;

        &:hover {
          border-bottom: 1px dashed var(--primary);
        }
      }
    }
  }
}

</style>
