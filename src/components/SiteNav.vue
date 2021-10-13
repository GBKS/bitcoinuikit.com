<template>
  <div class="site-nav">
    <h1><router-link to="/">Bitcoin UI Kit</router-link></h1>
    <nav>
      <router-link
        v-for="(item, index) in links"
        :key="index"
        :to="item.to"
      >{{ item.label }}</router-link>
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

.site-nav {
  width: 100%;
  padding: 20px 30px;
  box-sizing: border-box;

  h1 {
    margin: 0;

    a {
      @include r('font-size', 14, 22);
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
      color: var(--front);
      text-decoration: none;

      &:hover,
      &.router-link-exact-active {
        color: var(--primary);
      }
    }
  }
  
  @include media-query(medium-up) {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
}

</style>
