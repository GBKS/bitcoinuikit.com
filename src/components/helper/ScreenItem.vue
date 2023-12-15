<template>
  <div class="helper-screen-item">
    <img
      :src="imageFile"
      :srcset="imageSourceSet"
      :width="screenData.width"
      :height="screenData.height"
      :alt="screenData.title"
    >
    <div class="copy">
      <h3>{{ screenData.title }}</h3>
      <p class="-flow" v-if="flowText">{{ screenData.flow }} {{ flowText }}</p>
      <button @click="remove">Remove</button>
    </div>
  </div>
</template>

<script>
export default {
  name: 'HelperScreenItem',

  props: [
    'screenData'
  ],

  computed: {
    imageFile() {
      return '/assets/screens/'+this.screenData.id+'-preview.png'
    },

    imageSourceSet() {
      return '/assets/screens/'+this.screenData.id+'-preview.png 1x, '+'/assets/screens/'+this.screenData.id+'-preview@2x.png 2x'
    },


    flowText() {
      let result = null

      if(this.screenData.flow) {
        result = this.screenData.page + '/' + this.screenData.pagemax 
      }

      return result
    }
  },

  methods: {
    select() {
      this.$emit('select', this.screenData.id)
    },

    slugify(str) {
      str = str.replace(/^\s+|\s+$/g, ''); // trim
      str = str.toLowerCase();
      // remove accents, swap ñ for n, etc
      var from = "àáäâèéëêìíïîòóöôùúüûñç·/_,:;";
      var to = "aaaaeeeeiiiioooouuuunc------";
      for (var i = 0, l = from.length; i < l; i++) {
          str = str.replace(new RegExp(from.charAt(i), 'g'), to.charAt(i));
      }
      str = str.replace(/[^a-z0-9 -]/g, '') // remove invalid chars
          .replace(/\s+/g, '-') // collapse whitespace and replace by -
          .replace(/-+/g, '-'); // collapse dashes
      return str;
    },

    remove() {
      this.$emit('remove', this.screenData.id)
    }
  }
}
</script>

<style lang="scss" scoped>

.helper-screen-item {
  display: flex;
  flex-grow: 1;
  flex-basis: 26%;
  align-items: center;
  @include r('padding-bottom', 10, 10);
  gap: 20px;

  img {
    width: 50px;
    height: auto;
    box-shadow: 0px 10px 30px 0px #0000000D;
    border-radius: 3px;
  }

  h3 {
    margin: 0;
    @include r('font-size', 16, 16);
    line-height: 1.4;
    font-weight: normal;
    color: var(--foreground);
    transition: all 100ms $ease;
  }

  p {
    margin: 5px 0 0 0;
    @include r('font-size', 14, 14);
    color: #606060;

    &.-flow {
      @include r('margin-top', 5, 5);
    }
  }

  button {
    margin-top: 5px;
    appearance: none;
    border-width: 0;
    background-color: transparent;
    padding: 0;
    color: var(--neutral-7);
    border-bottom: 1px dashed transparent;

    &:hover {
      color: var(--primary);
      border-color: var(--primary);
    }
  }
}

</style>
