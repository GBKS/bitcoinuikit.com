<template>
  <div class="screen-list">
    <ScreenItem
      v-for="item in screenData"
      :key="item.id"
      :screenData="item"
      :activeFlowId="activeFlowId"
      :activeScreenId="activeScreenId"
      :searchTerm="searchTerm" 
       @select="select"
    />
  </div>
</template>

<script>
import ScreenItem from '@/components/screens/ScreenItem.vue'

export default {
  name: 'ScreenList',

  components: {
    ScreenItem
  },

  props: [
    'screenData',
    'activeFlowId',
    'activeScreenId',
    'searchTerm'
  ],

  methods: {
    select(value) {
      this.$emit('select', value)
    }
  }
}
</script>

<style lang="scss">

.screen-list {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  @include r('padding-left', 20, 20);
  @include r('padding-right', 20, 20);

  @include media-query(small) {
    gap: 20px;
  }

  @include media-query(medium-up) {
    gap: 50px;
  }
}

</style>
