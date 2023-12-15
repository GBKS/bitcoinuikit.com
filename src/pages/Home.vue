<template>
  <div class="home-page">
    <div class="wrap">
      <Intro />
      <Elements />
      <Themes 
        :color="color"
        :mode="mode"
        :type="type"
        @setColor="setColor" 
        @setMode="setMode" 
        @setType="setType" 
      />
      <Components />
      <Screens />
      <UserFlows />
      <IncludedContent v-if="false" :screenSize="screenSize" />
    </div>
  </div>
</template>

<script>
import Intro from '@/components/Intro.vue'
import IncludedContent from '@/components/IncludedContent.vue'
import Elements from '@/components/home/Elements.vue'
import Components from '@/components/home/Components.vue'
import Screens from '@/components/home/Screens.vue'
import UserFlows from '@/components/home/UserFlows.vue'
import Themes from '@/components/home/Themes.vue'

export default {
  name: 'HomePage',
  
  components: {
    Intro,
    IncludedContent,
    Elements,
    Components,
    Screens,
    UserFlows,
    Themes
  },

  props: [
    'screenSize',
    'color',
    'mode',
    'type'
  ],

  beforeMount() {
    document.title = 'Bitcoin UI Kit'
  },

  data() {
    return {
      title: 'Bitcoin UI Kit',
      description: 'This design system and UI kit provides a design foundation for prototypes, concept explorations and open-source projects to kickstart the design process. So you can focus on what makes your bitcoin product&nbsp;unique.',
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
          label: 'Guide',
          to: '/guide'
        },
        {
          label: 'Screens',
          to: '/screens'
        }
      ]
    }
  },

  methods: {
    setColor(value) {
      this.$emit('setColor', value)
    },

    setMode(value) {
      this.$emit('setMode', value)
    },

    setType(value) {
      this.$emit('setType', value)
    }
  }
}
</script>

<style lang="scss">

.home-page {
  transition: background-color 250ms $ease;

  > .wrap {
    width: 100%;
    max-width: 1536px;
    padding-left: 20px;
    padding-right: 20px;
    box-sizing: border-box;
    margin-left: auto;
    margin-right: auto;

    section {
      @include r('margin-top', 40, 60);
      
      .header-copy {
        max-width: 900px;

        h3 {
          margin: 0;
          font-weight: 300;
          @include r('font-size', 32, 48);
          @include r('letter-spacing', -0.5, -1);
          text-wrap: balance;
          text-align: center;
          color: var(--foreground);

          a {
            color: var(--primary);
            text-decoration: none;

            &:hover {
              border-bottom: 1px dashed var(--primary);
            }
          }
        }
        
        p {
          margin: 0;
          @include r('margin-top', 10, 20);
          text-wrap: balance;
          text-align: center;
          color: var(--neutral-7);
          @include r('font-size', 16, 22);
          line-height: 1.6;
          text-align: center;

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

      // & + section {
      //   @include r('margin-top', 25, 50);
      // }
    }
  }
}

</style>
