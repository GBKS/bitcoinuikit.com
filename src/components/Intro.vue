<template>
  <div class="intro">
    <picture>
      <source
        media="(max-width: 639px)"
        srcset="/assets/themes-mobile.png 1x, /assets/themes-mobile@2x.png 2x"
      >
        <img
          src="/assets/themes.png"
          srcset="/assets/themes.png 1x, /assets/themes@2x.png 2x"
          alt="" 
          width="1280" 
          height="642"
          loading="lazy"
        >
    </picture>
    <h2 id="whats-included">See what's included</h2>
    <img
      src="/assets/caret-down.svg"
      width="24"
      height="24"
      alt="Arrow down"
    >
  </div>
</template>

<script>
export default {
  name: 'Intro',

  props: {

  }
}
</script>

<style lang="scss" scoped>

@import "../scss/variables.scss";
@import "../scss/mixins.scss";

.intro {
  display: flex;
  flex-direction: column;
  align-items: center;

  h2 {
    margin: 0;
    @include r('margin-top', 40, 50);
    font-weight: 300;
  }

  p {
    max-width: 800px;
    text-align: center;
    @include r('font-size', 18, 22);
    line-height: 1.6;
    color: #777777;
  }

  @include media-query(small) {
    picture {
      display: flex;
      flex-direction: column;
      flex-basis: 100%;
      align-items: flex-end;
      overflow-x: hidden;
      margin-left: -20px;
      margin-right: -20px;
      padding-right: 10px;

      img {
        display: block;
        width: 175%;
        height: auto;
      }
    }
  }

  @include media-query(medium-up) {
    picture {
      img {
        max-width: 100%;
        height: auto;
      }
    }
  }

  @include media-query(large) {

  }
}

</style>
