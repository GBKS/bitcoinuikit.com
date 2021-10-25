<template>
  <div class="helper-screen-list">
    <ScreenItem
      v-for="(item, index) in screenData"
      :key="index"
      :screenData="item"
       @remove="remove"
    />
  </div>
</template>

<script>
import ScreenItem from '@/components/helper/ScreenItem.vue'

export default {
  name: 'HelperScreenList',

  components: {
    ScreenItem
  },

  props: [
    'screenData'
  ],

  methods: {
    remove(value) {
      this.$emit('remove', value)
    }
  }
}
</script>

<style lang="scss" scoped>

@import '@/assets/css/variables.scss';
@import '@/assets/css/mixins.scss';
@import '@/assets/css/animations.scss';

.helper-screen-list {
  display: flex;
  flex-wrap: wrap;
  flex-basis: 40%;
  flex-grow: 1;
  justify-content: center;
  @include r('padding-left', 20, 20);
  @include r('padding-right', 20, 20);

  @include media-query(small) {
    gap: 20px;
  }

  @include media-query(medium-up) {
    gap: 20px;
  }
}

</style>
