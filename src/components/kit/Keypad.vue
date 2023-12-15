<template>
  <div class="keypad">
    <KeypadKey label="1" @select="select" />
    <KeypadKey label="2" @select="select" />
    <KeypadKey label="3" @select="select" />
    <KeypadKey label="4" @select="select" />
    <KeypadKey label="5" @select="select" />
    <KeypadKey label="6" @select="select" />
    <KeypadKey label="7" @select="select" />
    <KeypadKey label="8" @select="select" />
    <KeypadKey label="9" @select="select" />
    <div v-if="disableFractions" class="spacer" />
    <KeypadKey v-if="!disableFractions" label="." @select="select" />
    <KeypadKey label="0" @select="select" />
    <KeypadKey label="<" icon="caretLeft" @select="select" />
  </div>
</template>

<script>
import KeypadKey from '@/components/kit/KeypadKey.vue'

export default {
  name: 'Keypad',
  
  components: {
    KeypadKey
  },

  props: [
    'disableFractions'
  ],

  computed: {
    classObject() {
      const c = [
        'toggle',
        '-' + (this.size || 'big')
      ]

      if(this.active) c.push('-active')

      return c.join(' ')
    }
  },

  methods: {
    select(value) {
      this.$emit('input', value);
    }
  }
}
</script>

<style lang="scss" scoped>

.keypad {
  display: flex;
  flex-wrap: wrap;

  .spacer {
    flex-grow: 1;
    height: 10px;
    flex-basis: 33.33%;
  }

  .keypad-key {
    &:nth-child(10) {
      &:disabled {
        visibility: hidden;
      }
    }
  }
}

</style>
