<template>
  <div class="site-header">
    <h1>Bitcoin UI Kit</h1>
    <p>This design system and UI kit provides a design foundation for prototypes, concept explorations and open-source projects to kickstart the design process. So you can focus on what makes your Bitcoin product&nbsp;unique.</p>
    <div class="links">
      <template
        v-for="(item, index) in links"
      >
      <a
        v-if="item.url"
        :key="index"
        :href="item.url"
      >{{ item.name }}</a>
      <router-link
        v-if="item.to"
        :key="index"
        :to="item.to"
      >{{ item.label }}</router-link>
      </template>
    </div>
    <a
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
export default {
  name: 'SiteHeader',

  props: {
    figmaLink: Object,
    links: Array
  }
}
</script>

<style lang="scss" scoped>

@import '@/assets/css/variables.scss';
@import '@/assets/css/mixins.scss';
@import '@/assets/css/animations.scss';

.site-header {
  @include r('padding-top', 50, 100);
  @include r('padding-bottom', 25, 50);
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;

  h1 {
    margin: 0;
    @include r('font-size', 48, 80);
    line-height: 1.2;
    letter-spacing: -3px;
    font-weight: 300;
    color: var(--front);
    transition: color 250ms $ease;
  }

  p {
    margin: 5px 0 0 0;
    max-width: 800px;
  }

  > a {
    margin: 0;
    @include r('margin-top', 25, 30);
  }

  .links {
    @include r('margin-top', 15, 20);

    a {
      display: inline-block;
      @include r('font-size', 16, 22);
      color: var(--front);
      transition: color 250ms $ease;
      text-decoration: none;

      &:hover {
        color: $primary;
        text-decoration: underline;
      }
    }
  }

  @include media-query(small) {
    .links {
      display: flex;
      flex-direction: column;
      
      a {
        & + a {
          margin-top: 10px;
        }
      }
    }
  }

  @include media-query(medium-up) {
    .links {
      a {
        & + a {
          margin-left: 30px;
        }
      }
    }
  }
}

</style>
