<template>
  <div class="site-nav">
    <h1><NuxtLink to="/">Bitcoin UI Kit</NuxtLink></h1>
    <nav>
      <NuxtLink
        v-for="(item, index) in links"
        :key="index"
        :to="item.to"
      >{{ item.label }}</NuxtLink>
    </nav>
  </div>
</template>

<script>
export default {
  name: 'SiteNav',
  
  data() {
    const links = [
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

    return {
      links
    }
  }
}
</script>

<style lang="scss" scoped>

@import '@/assets/css/variables.scss';
@import '@/assets/css/mixins.scss';
@import '@/assets/css/animations.scss';

.site-nav {
  width: 100%;
  @include r('padding-left', 15, 30);
  @include r('padding-right', 15, 30);
  @include r('padding-top', 15, 20);
  // @include r('padding-bottom', 15, 20);
  box-sizing: border-box;

  h1 {
    margin: 0;
    padding: 0;
    line-height: 1.4;
    @include r('font-size', 14, 22);

    a {
      color: var(--front);
      text-decoration: none;
      font-weight: 400;

      &:hover {
        color: var(--primary);
      }
    }
  }

  nav {
    display: flex;
    gap: 20px;

    a {
      @include r('font-size', 14, 22);
      line-height: 1.4;
      color: var(--front);
      text-decoration: none;

      &:hover,
      &.router-link-active {
        color: var(--primary);
      }
    }
  }
  
  @include media-query(small) {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  
  @include media-query(medium-up) {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
}

</style>
