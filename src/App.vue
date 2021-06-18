<template>
  <div id="app" :class="classObject">
    <div class="wrap">    
      <SiteHeader
        :figmaLink="figmaLink"
        :links="links"
      />
      <Intro />
      <IncludedContent :screenSize="screenSize" />
      <SiteInfo :figmaLink="figmaLink" />
      <SiteFooter />
    </div>
  </div>
</template>

<script>
import SiteHeader from '@/components/SiteHeader.vue'
import Intro from '@/components/Intro.vue'
import IncludedContent from '@/components/IncludedContent.vue'
import SiteInfo from '@/components/SiteInfo.vue'
import SiteFooter from '@/components/SiteFooter.vue'

export default {
  name: 'App',
  
  components: {
    SiteHeader,
    Intro,
    IncludedContent,
    SiteInfo,
    SiteFooter
  },

  data() {
    return {
      screenSize: null,
      figmaLink: {
        name: 'Duplicate on Figma',
        url: 'https://www.figma.com/community/file/916680391812923706/Bitcoin-Wallet-UI-Kit-(work-in-progress)'
      },
      links: [
        {
          name: 'What’s included',
          url: '#whats-included'
        },
        {
          name: 'How to use',
          url: '#how-to-use'
        },
        {
          name: 'Contribute',
          url: '#contribute'
        },
        {
          name: 'License',
          url: '#license'
        }
      ]
    }
  },

  computed: {
    classObject() {
      var s = [];

      s.push('--theme-' + this.theme)

      return s.join(' ')
    }
  },

  beforeMount() {
    this.resize()

    window.addEventListener('resize', this.resize.bind(this))
  },

  methods: {
    resize() {
      var isMobile = window.innerWidth < 640
      var isDesktop = window.innerWidth >= 1024
      var isTablet = !isMobile && !isDesktop
      
      if(isMobile) {
        this.screenSize = 'small'
      } else if(isTablet) {
        this.screenSize = 'medium'
      } else {
        this.screenSize = 'large'
      }
    }
  }
}
</script>

<style lang="scss">

@import "@/scss/fonts.scss";
@import "@/scss/variables.scss";
@import "@/scss/mixins.scss";
@import "@/scss/animations.scss";
@import "@/scss/normalize.scss";

#app {
  background-color: #F4F4F4;
  transition: background-color 250ms $ease;
  min-height: 100vh;
  width: 100vw;
  overflow-x: hidden;

  > .wrap {
    width: 100%;
    max-width: 1536px;
    padding-left: 20px;
    padding-right: 20px;
    box-sizing: border-box;
    margin-left: auto;
    margin-right: auto;

    p {
      @include r('font-size', 16, 22);
      color: rgba(var(--frontRGB), 0.55);
      line-height: 1.6;

      a {
        color: rgba(var(--frontRGB), 1);
        transition: all 100ms $ease;

        &:hover {
          color: $primary;
        }
      }
    }
  }
}

.button {
  display: inline-block;
  background-color: var(--front);
  color: var(--back);
  text-decoration: none;
  @include r('font-size', 16, 22);
  @include r('line-height', 44, 50);
  padding: 0 20px;
  font-weight: 600;
  transition: all 100ms $ease;

  img {
    filter: invert(100%);
    vertical-align: middle;
    display: inline-block;
    margin-left: 10px;
    transition: all 150ms $ease;
  }

  &:hover {
    background-color: $primary;

    img {
      transform: translateX(5px);
    }
  }
}

</style>
