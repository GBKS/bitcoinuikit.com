<template>
  <div class="page-title">
    <router-link v-if="false" class="logo" to="/">Bitcoin UI Kit</router-link>
    <h1>{{ title }}</h1>
    <nav v-if="false">
      <router-link
        :class="item.to == activeLinkBase ? '-active' : null"
        v-for="(item, index) in links"
        :key="index"
        :to="item.to"
      >{{ item.label }}</router-link>
    </nav>
    <p v-html="description" />
    <a
      v-if="showFigmalink"
      class="button"
      :href="figmaLink.url"
      target="_blank"
      rel="noreferrer noopener"
    >{{ figmaLink.label }}
      <img
        src="/assets/arrow-right.svg"
        width="24"
        height="24"
        alt="Arrow right"
      >
    </a>
  </div>
</template>

<script>
import Content from '@/content.json'

export default {
  name: 'PageTitle',

  data() {
    return {
      links: Content.nav,
      figmaLink: {
        label: Content.figma.button,
        url: Content.figma.url
      }
    }
  },

  computed: {
    activeLinkBase() {
      let result = this.links[0].to

      for(let i=1; i<this.links.length; i++) {
        if(this.$route.path.indexOf(this.links[i].to) === 0) {
          result = this.links[i].to
        }
      }

      return result
    },

    title() {
      const items = {
        'screens': Content.screens.title,
        'foundation': Content.foundation.title,
        'info': Content.info.title
      }

      let result = Content.home.title

      for(let key in items) {
        if(this.$route.fullPath.indexOf(key) === 1) {
          result = items[key]
          break
        }
      }

      return result
    },

    description() {
      const items = {
        'screens': Content.screens.description,
        'foundation': Content.foundation.description,
        'info': Content.info.description
      }

      let result = Content.home.description

      for(let key in items) {
        if(this.$route.fullPath.indexOf(key) === 1) {
          result = items[key]
          break
        }
      }

      return result
    },

    showFigmalink() {
      return this.$route.fullPath == '/'
    }
  }
}
</script>

<style lang="scss">

.page-title {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  @include r('padding-top', 20, 40);

  a.logo {
    text-decoration: none;
    color: var(--front);
    transition: all 400ms $ease;

    &.router-link-exact-active {
      opacity: 0;
    }
  }

  h1 {
    margin: 0;
    @include r('margin-top', 15, 20);
    @include r('font-size', 36, 80);
    @include r('letter-spacing', -1.5, -3);
    line-height: 1.2;
    font-weight: 300;
    color: var(--front);
    transition: color 250ms $ease;
  }

  p {
    margin: 0;
    max-width: 800px;
    @include r('margin-top', 10, 15);
    @include r('padding-left', 10, 20);
    @include r('padding-right', 10, 20);
    @include r('font-size', 15, 21);
    color: var(--neutral-7);
    line-height: 1.6;

    a {
      color: var(--front);
      text-decoration: none;
      transition: all 100ms $ease;

      &:hover {
        color: var(--primary);
        border-bottom: 1px dashed var(--primary);
      }
    }
  }

  nav {
    display: flex;
    @include r('gap', 20, 40);
    @include r('margin-top', 10, 15);

    a {
      @include r('font-size', 14, 20);
      color: var(--front);
      text-decoration: none;
      border-bottom: 1px dashed transparent;

      &:hover {
        border-color: var(--primary);
      }

      &:hover,
      &.-active,
      &.router-link-exact-active {
        color: var(--primary);
      }
    }
  }

  a.button {
    @include r('margin-top', 25, 30);
  }
}

</style>
