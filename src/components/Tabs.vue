<template>
  <div class="tabs">
    <template
      v-for="(item, id) in items"
      :key="id"
    >
      <router-link
        :class="id == activeId ? '-active' : null"
        v-if="item.to"
        :to="item.to"
      >{{ item.label }}</router-link>
      <a
        :class="id == activeId ? '-active' : null"
        v-if="item.href"
        :href="item.href"
      >{{ item.label }}</a>
      <button
        :class="id == activeId ? '-active' : null"
        v-if="!item.to && !item.href"
        @click="click(id)"
      >{{ item.label }}</button>
    </template>
  </div>
</template>

<script>
export default {
  name: 'Tabs',

  props: [
    'items',
    'activeId'
  ],

  methods: {
    click(itemId) {
      this.$emit('select', itemId);
    }
  }
}
</script>

<style lang="scss" scoped>

.tabs {
  display: flex;
  justify-content: center;
  @include r('gap', 20, 40);

  a,
  button {
    appearance: none;
    border-width: 0;
    padding: 0;
    background-color: transparent;
    color: var(--foreground);
    @include r('font-size', 14, 16);
    text-decoration: none;
    border-bottom: 1px dashed transparent;

    &:hover {
      border-color: var(--primary);
      cursor: pointer;
    }

    &:hover,
    &.-active {
      color: var(--primary);
    } 
  }
}

</style>
