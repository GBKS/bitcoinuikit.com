<template>
  <div :class="classObject">
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
      <div class="icon" v-html="arrowRight" />
    </a>
  </div>
</template>

<script>
import Content from '@/content.json'
import Icons from '@/icons.js'

export default {
  name: 'PageTitle',

  data() {
    return {
      links: Content.nav,
      figmaLink: {
        label: Content.figma.button,
        url: Content.figma.url
      },
      arrowRight: Icons.arrowRight
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
        'Guide': Content.guide.title,
        'info': Content.info.title,
        'workshop': Content.workshop.title
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

    isHomePage() {
      return this.$route.path === '/'
    },

    description() {
      const items = {
        'screens': Content.screens.description,
        'Guide': Content.guide.description,
        'info': Content.info.description,
        'workshop': Content.workshop.description
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
    },

    classObject() {
      const c = ['page-title']

      const items = {
        'screens': "",
        'guide': "",
        'info': "",
        'workshop': ""
      }
      for(let key in items) {
        if(this.$route.fullPath.indexOf(key) === 1) {
          c.push('-'+key)
          break
        }
      }

      return c.join(' ')
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
    color: var(--foreground);
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
    color: var(--foreground);
    transition: color 250ms $ease;
    text-wrap: balance;
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
    text-wrap: balance;

    a {
      color: var(--foreground);
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
      color: var(--foreground);
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

  &.-workshop {
    h1 {
      // max-width: 1000px;
    }
  }
}

</style>
