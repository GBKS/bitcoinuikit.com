<template>
  <div :class="classObject" @click="click">
    <Avatar v-if="avatarImage" :image="avatarImage" />
    <div class="copy">
      <p class="-body-6">{{ label || 'To' }}</p>
      <input
        class="-body-5"
        type="text"
        placeholder="Pick contact or enter address..."
        ref="input"
        v-model="textInput"
        @focus="focus"
        @blur="blur"
      />
    </div>
    <Button icon="account" theme="free" size="small" />
  </div>
</template>

<script>
import Avatar from '@/components/kit/Avatar.vue'
import Button from '@/components/kit/Button.vue'

export default {
  name: 'RecipientInput',

  components: {
    Avatar,
    Button
  },

  props: [
    'avatarImage',
    'label',
    'text'
  ],

  data() {
    return {
      focused: false,
      textInput: this.text
    }
  },

  computed: {
    classObject() {
      const c = [
        'recipient-input'
      ]

      if(this.focused) c.push('-focus')

      return c.join(' ')
    }
  },

  methods: {
    focus() {
      this.focused = true
    },

    blur() {
      this.focused = false
    },

    click() {
      if(!this.focused) {
        this.$refs.input.focus()
      }
    }
  }
}
</script>

<style lang="scss" scoped>

.recipient-input {
  display: flex;
  align-items: center;
  gap: 10px;

  .copy {
    flex-grow: 1;
    display: flex;
    flex-direction: column;
    justify-content: space-between;

    input {
      display: block;
      flex-grow: 1;
      border-width: 0;
      background-color: transparent;
      padding: 0;
      color: var(--foreground);
      
      &::placeholder {
        color: var(--neutral-5);
      }

      &:focus {
        outline: none;
      }
    }

    p {
      color: var(--neutral-7);
    }
  }

  .icon {
    color: var(--neutral-7);

    ::v-deep(svg) {
      width: 16px;
      height: 16px;
    }
  }

  &:hover,
  &.-focus {
    .copy {
      input {
        color: var(--primary);
      }
    }
  }
}

</style>
