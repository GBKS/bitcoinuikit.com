<template>
  <div class="nav-tabs">
    <NavTab
      label="Payments"
      icon="flipVertical"
    />
    <NavTab
      label="Transactions"
      icon="transactions"
      :active="true"
    />
    <NavTab
      label="Settings"
      icon="gear"
    />
  </div>
</template>

<script>
import NavTab from '@/components/kit/NavTab.vue'

export default {
  name: 'NavTabs',

  components: {
    NavTab
  }
}
</script>

<style lang="scss" scoped>

.nav-tabs {
  display: flex;
  justify-content: center;
  border-top: 1px solid var(--neutral-3);
  padding-bottom: 30px;
  background-color: var(--background);
  margin-left: calc(-1 * var(--screen-side-padding));
  margin-right: calc(-1 * var(--screen-side-padding));
}

</style>
