<template>
  <div class="included-content-item">
    <div class="copy">
      <h3>{{ content.title }}</h3>
      <p v-html="content.description" />
    </div>
    <div class="image" :style="styleObject">
      <picture>
        <source
          media="(max-width: 639px)"
          :srcset="content.image.mobile + ' 1x, ' + content.image.mobileRetina + ' 2x'"
        >
          <img
            :src="content.image.url"
            :srcset="content.image.url + ' 1x, ' + content.image.retina + ' 2x'"
            :alt="content.image.alt" 
            :width="content.image.width" 
            :height="content.image.height"
            loading="lazy"
          >
      </picture>
    </div>
  </div>
</template>

<script>
export default {
  name: 'IncludedContentItem',

  props: {
    screenSize: String,
    content: Object
  },

  computed: {
    styleObject() {
      return {
        height: this.screenSize == 'large' ? (this.content.image.height + 'px') : null
        // paddingBottom: this.isDesktop ? (this.content.image.height / this.content.image.width * 100 + '%') : null
      }
    }
  },

  methods: {

  }
}
</script>

<style lang="scss" scoped>

@import "@/scss/variables.scss";
@import "@/scss/mixins.scss";

.included-content-item {
  display: flex;
  flex-wrap: wrap;

  .copy {
    h3 {
      margin: 0;
      font-weight: 300;
      @include r('font-size', 40, 64);
      @include r('letter-spacing', -2, -3);
    }
    
    p {
      margin: 0;
      @include r('margin-top', 10, 20);
    }
  }

  @include media-query(small) {
    flex-direction: column;
    align-items: center;

    picture {
      display: flex;
      flex-direction: column;
      align-items: center;
      flex-basis: 100%;
      flex-grow: 0;
      margin-top: 20px;

      img {
        width: 175%;
        height: auto;
      }
    }

    & + .included-content-item {
      margin-top: 40px;
    }
  }

  @include media-query(medium) {
    flex-direction: column;

    img {
      max-width: 100%;
      height: auto;
    }
  }

  @include media-query(large) {
    flex-direction: row;
    align-items: center;

    .copy {
      flex-basis: 500px;
      margin-right: 30px;
    }

    .image {
      flex-basis: 200px;
      flex-grow: 1;
      position: relative;

      picture {
        position: absolute;
        left: 0;
        top: 0
      }
    }
  }
}

</style>
