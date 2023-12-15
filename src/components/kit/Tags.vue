<template>
  <div class="tags">
    <button
      v-for="(item, index) in tags"
      :key="index"
      class="-body-7"
    >{{ item }}</button>
  </div>
</template>

<script>
export default {
  name: 'Tags',

  props: [
    'tags'
  ]
}
</script>

<style lang="scss" scoped>

.tags {
  button {
    background-color: var(--neutral-6);
    color: white;
    border-radius: 2px;
    padding: 4px 10px;
  }
}

</style>
