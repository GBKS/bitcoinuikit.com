<template>
  <div class="site-header">
    <h1>Bitcoin UI Kit</h1>
    <p>A design system and UI kit for Bitcoin wallet applications.</p>
    <a
      class="button"
      :href="figmaLink.url"
      target="_blank"
      rel="noreferrer noopener"
    >{{ figmaLink.name }}
      <img
        src="/assets/arrow-right.svg"
        width="24"
        height="24"
        alt="Arrow right"
      >
    </a>
    <div class="links">
      <a
        v-for="(item, index) in links"
        :key="index"
        :href="item.url"
      >{{ item.name }}</a>
    </div>
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

@import "../scss/variables.scss";
@import "../scss/mixins.scss";
@import "../scss/animations.scss";

.site-header {
  @include r('padding-top', 50, 100);
  @include r('padding-bottom', 25, 50);
  padding-left: 20px;
  padding-right: 20px;
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
  }

  > a {
    margin: 15px 0 0 0;
  }

  .links {
    @include r('margin-top', 15, 30);

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
