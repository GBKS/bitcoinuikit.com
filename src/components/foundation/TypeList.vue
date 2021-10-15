<template>
  <div class="type-list">
    <TypeItem
      v-for="(item, index) in typeData"
      :key="index"
      :typeData="item"
    />
  </div>
</template>

<script>
import TypeItem from '@/components/foundation/TypeItem.vue'

export default {
  name: 'TypeList',

  components: {
    TypeItem
  },

  props: [
    'typeData'
  ]
}
</script>

<style lang="scss" scoped>

.type-list {
  display: flex;
  width: 100%;
  max-width: 1000px;
  padding-left: 20px;
  padding-right: 20px;
  box-sizing: border-box;
  flex-direction: column;
  justify-content: center;
  gap: 50px;
}

</style>
