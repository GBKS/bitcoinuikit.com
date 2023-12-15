<template>
  <div class="component-info">
    <div class="top">
      <h1 v-if="title">{{ title }}</h1>
      <p v-if="description">{{ description }}</p>
    </div>
    <div class="content">
      <slot></slot>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ComponentInfo',

  props: [
    'title',
    'description'
  ]
}
</script>

<style lang="scss" scoped>

.component-info {
  display: flex;
  flex-direction: column;
  align-items: stretch;
  background-color: var(--background);
  border-radius: 15px;

  .top {
    display: flex;
    flex-direction: column;
    gap: 5px;
    padding: 25px;
    background-color: var(--neutral-2);
    border-top-left-radius: 15px;
    border-top-right-radius: 15px;

    h1 {
      margin: 0;
      color: var(--foreground);
      font-size: 18px;
      font-weight: 500;
    }

    p {
      margin: 0;
      color: var(--neutral-7);
      font-size: 15px;
    }
  }

  .content {
    padding: 25px;
  }
}

</style>
