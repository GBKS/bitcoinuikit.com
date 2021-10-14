<template>
  <div class="foundations-page">
    <div class="tab-bar">
      <Tabs
        :items="themeOptions"
        :activeId="activeThemeId"
        @select="setActiveThemeId"
      />
    </div>
    <Swatches
      :swatchesData="swatchesData" 
      :screenSize="screenSize"
    />
    <TypeList :typeData="typeData" />
  </div>
</template>

<script>
import Tabs from '@/components/Tabs.vue'
import Swatches from '@/components/foundation/Swatches.vue'
import TypeList from '@/components/foundation/TypeList.vue'

import Content from '@/content.json'

export default {
  name: 'FoundationsPage',

  components: {
    Tabs,
    Swatches,
    TypeList
  },

  props: [
    'screenSize'
  ],

  beforeMount() {
    document.title = 'Foundation | Bitcoin UI Kit'
  },

  data() {
    const swatchesLight = Content.swatches.light
    const swatchesDark = Content.swatches.dark
    const titleCopy = Content.swatches.header
    const bodyCopy = Content.swatches.body

    const typeData = [
      {
        label: 'Header 1',
        tag: 'h1',
        size: 36,
        lineHeight: 140,
        weight: 600,
        copy: titleCopy
      },
      {
        label: 'Header 2',
        tag: 'h1',
        size: 28,
        lineHeight: 140,
        weight: 600,
        copy: titleCopy
      },
      {
        label: 'Header 3',
        tag: 'h1',
        size: 24,
        lineHeight: 140,
        weight: 600,
        copy: titleCopy
      },
      {
        label: 'Header 4',
        tag: 'h1',
        size: 21,
        lineHeight: 140,
        weight: 600,
        copy: titleCopy
      },
      {
        label: 'Header 5',
        tag: 'h1',
        size: 18,
        lineHeight: 140,
        weight: 600,
        copy: titleCopy
      },
      {
        label: 'Body 1',
        tag: 'p',
        size: 24,
        lineHeight: 140,
        weight: 400,
        copy: bodyCopy,
        max: 900
      },
      {
        label: 'Body 2',
        tag: 'p',
        size: 21,
        lineHeight: 140,
        weight: 400,
        copy: bodyCopy,
        max: 800
      },
      {
        label: 'Body 3',
        tag: 'p',
        size: 18,
        lineHeight: 140,
        weight: 400,
        copy: bodyCopy,
        max: 700
      },
      {
        label: 'Body 4',
        tag: 'p',
        size: 15,
        lineHeight: 140,
        weight: 400,
        copy: bodyCopy,
        max: 600
      },
      {
        label: 'Body 5',
        tag: 'p',
        size: 13,
        lineHeight: 140,
        weight: 400,
        copy: bodyCopy,
        max: 500
      }
    ]

    const themeOptions = {
      light: {
        label: 'Light'
      },
      dark: {
        label: 'Dark'
      }
    }

    return {
      swatchesLight,
      swatchesDark,
      typeData,
      themeOptions,
      activeThemeId: 'light'
    }
  },

  mounted() {
    document.body.classList.add('-darker')
  },

  beforeUnmount() {
    document.body.classList.remove('-darker')
    document.body.classList.remove('--theme-dark')
  },

  computed: {
    swatchesData() {
      let result = this.swatchesLight

      if(this.activeThemeId == 'dark') {
        result = this.swatchesDark
      }

      return result
    }
  },

  methods: {
    setActiveThemeId(value) {
      this.activeThemeId = value

      if(value == 'dark') {
        document.body.classList.add('--theme-dark')
      } else {
        document.body.classList.remove('--theme-dark')
      }
    }
  }
}
</script>

<style lang="scss" scoped>

.foundations-page {
  display: flex;
  flex-direction: column;
  align-items: center;
  @include r('gap', 25, 50);
  @include r('padding-top', 20, 40);
}

</style>
