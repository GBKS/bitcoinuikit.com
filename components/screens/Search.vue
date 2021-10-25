<template>
  <div :class="className">
    <input
      type="text"
      v-model="inputModel"
      placeholder="Search..."
      @change="keyUp"
      @keyup="keyUp"
    />
  </div>
</template>

<script>
export default {
  name: 'ScreenSearch',

  props: [
    'term'
  ],

  data() {
    return {
      inputModel: this.term
    }
  },

  watch: {
    term() {
      this.inputModel = this.term
    }
  },

  computed: {
    className() {
      const c = ['screen-search']

      if(this.term && this.term.length > 0) {
        c.push('-active')
      }

      return c.join(' ')
    }
  },

  methods: {
    keyUp() {
      this.$router.push('/screens?search='+this.inputModel)
    }
  }
}
</script>

<style lang="scss" scoped>

@import '@/assets/css/variables.scss';
@import '@/assets/css/mixins.scss';
@import '@/assets/css/animations.scss';

.screen-search {
  input {
    appearance: none;
    background-color: transparent;
    border-width: 0;
    @include r('font-size', 14, 16);
    color: var(--front);
    border-bottom: 1px dashed var(--neutral-4);

    &:focus {
      outline: none;
      color: var(--primary);
      border-color: var(--primary);
    }

    &:hover {
      border-color: var(--primary);
    }
  }

  &.-active {
    input {
      color: var(--primary);
      border-color: var(--primary);
    }
  }
}

</style>
