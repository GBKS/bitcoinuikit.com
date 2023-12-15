<template>
  <button
    :class="classObject"
    :disabled="disabled"
    :aria-pressed="active"
    @click="toggle"
  ><span>{{ displayIndex }}</span><span>{{ word }}</span></button>
</template>

<script>

export default {
  name: 'KeypadKey',

  props: [
    'active',
    'index',
    'wordId',
    'word',
    'size',
    'disabled',
    'clicked',
    'mode'
  ],

  data() {
    return {
      animating: false
    }
  },

  computed: {
    classObject() {
      const c = [
        'seed-word',
        '-title-5'
      ]

      const clickIndex = this.clicked.indexOf(this.wordId)
      if(clickIndex !== -1) {
        c.push('-active')

        if(clickIndex == this.index) {
          c.push('-correct')
        } else {
          c.push('-incorrect')
        }
      }

      if(this.animating) c.push('-animate')

      return c.join(' ')
    },

    displayIndex() {
      let result = ' '

      if(this.mode == 'verify') {
        const clickIndex = this.clicked.indexOf(this.wordId)
        if(clickIndex !== -1) {
          result = clickIndex + 1
        }
      } else {
        result = this.index + 1
      }

      return result
    }
  },

  methods: {
    toggle() {
      const clickIndex = this.clicked.indexOf(this.wordId)

      if(clickIndex === -1) {
        if(this.index == this.clicked.length) {
          this.$emit('toggle', this.wordId)
        } else {
          this.animate()
        }
      }
    },

    animate() {
      if(!this.animating) {
        this.animating = true
        const ref = this
        setTimeout(() => { ref.animating = false }, 1000)
      }
    }
  }
}
</script>

<style lang="scss" scoped>

.seed-word {
  flex-basis: 35%;
  flex-grow: 1;
  align-items: center;
  appearance: none;
  border-width: 0px;
  transition: all 100ms $ease;
  background-color: var(--neutral-3);
  border-radius: 100px;
  display: flex;
  padding: 0;
  cursor: pointer;

  span {
    text-align: center;
    display: block;
    line-height: 46px;
    color: var(--foreground);

    &:first-child {
      flex-basis: 46px;
      flex-grow: 0;
      flex-shrink: 0;
      border-right: 2px solid var(--background);
      border-top-left-radius: 100px;
      border-bottom-left-radius: 100px;
      height: 100%;
    }

    &:last-child {
      flex-grow: 1;
      padding-left: 5px;
      padding-right: 5px;
    }
  }

  &:hover {
    background-color: var(--neutral-2);
    color: var(--primary);
  }

  &:not(.-active) {
    &:active {
      background-color: var(--neutral-2);
    }
  }

  &.-animate {
    animation: word-shake 250ms 2 $easeInOutSine;
  }

  &.-active {
    span {
      &:first-child {
        color: white;
      }
    }

    &.-correct {
      span {
        &:first-child {
          background-color: var(--green);
        }
      }
    }

    &.-incorrect {
      span {
        &:first-child {
          background-color: var(--red);
        }
      }
    }
  }
}

@keyframes word-shake {
  0% {
    transform: translateX(0);
  }

  25% {
    transform: translateX(-10px);
  }

  50% {
    transform: translateX(0);
  }

  75% {
    transform: translateX(10px);
  }

  100% {
    transform: translateX(0);
  }
}

</style>
