<template>
  <div
    :class="classObject"
    :style="styleObject"
  >
    <img
      v-if="image"
      :src="imageSource"
    />
    <template
      v-if="!image"
      :v-html="content"
    />
  </div>
</template>

<script>
import Icons from '@/icons.js'

export default {
  name: 'Avatar',

  props: [
    'image',
    'label',
    'color',
    'icon'
  ],

  computed: {
    classObject() {
      const c = ['avatar']

      return c.join(' ')
    },

    styleObject() {
      return {
        backgroundColor: 'var(--'+(this.color || 'neutral-4')+')'
      }
    },

    content() {
      let result = this.label

      if(this.icon) {
        result = Icons[this.icon]
      }

      return result
    },

    imageSource() {
      let result = null

      if(this.image) {
        result = '/assets/kit/avatars/'+this.image+'.jpg'
      }

      return result
    }
  }
}
</script>

<style lang="scss" scoped>

.avatar {
  width: 40px;
  height: 40px;
  border-radius: 100px;

  img {
    width: 100%;
    height: 100%;
    border-radius: 100px;
    object-fit: cover;
  }
}

</style>
