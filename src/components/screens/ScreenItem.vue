<template>
  <div :class="className">
    <router-link :to="link">
      <img
        :src="imageFile"
        :srcset="imageSourceSet"
        :width="screenData.width"
        :height="screenData.height"
        :alt="screenData.title"
        @load="imageLoaded"
      >
    </router-link>
    <h3><router-link :to="link">{{ screenData.title }}</router-link></h3>
    <p class="-flow" v-if="flowText">
      <router-link :to="flowLink">{{ screenData.flow }} {{ flowText }}</router-link>
    </p>
    <p v-if="false">{{ screenData.description }}</p>
  </div>
</template>

<script>
export default {
  name: 'ScreenItem',

  props: [
    'screenData',
    'activeFlowId',
    'activeScreenId',
    'searchTerm'
  ],

  data() {
    return {
      imageLoading: true
    }
  },

  computed: {
    className() {
      const c = ['screen-item']

      if(this.screenData.id == this.activeScreenId) {
        c.push('-active')
      }

      if(this.imageLoading) {
        c.push('-loading')
      }

      return c.join(' ')
    },

    imageFile() {
      return '/assets/screens/'+this.screenData.id+'-preview.png'
    },

    imageSourceSet() {
      return '/assets/screens/'+this.screenData.id+'-preview.png 1x, '+'/assets/screens/'+this.screenData.id+'-preview@2x.png 2x'
    },

    link() {
      const slug = this.slugify(this.screenData.id)

      let result = '/screens/screen/' + slug

      if(this.activeFlowId && this.activeFlowId !== 'all') {
        result = '/screens/flow/' + this.activeFlowId + '/' + slug
      }

      if(this.searchTerm) {
        result += '?search='+this.searchTerm
      }

      return result
    },

    flowLink() {
      return '/screens/flow/'+this.slugify(this.screenData.flow)
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

    imageLoaded() {
      this.imageLoading = false
    }
  }
}
</script>

<style lang="scss" scoped>

.screen-item {
  display: flex;
  flex-direction: column;
  // flex-grow: 1;
  text-decoration: none;
  @include r('padding-bottom', 15, 30);

  img {
    width: 100%;
    height: auto;
    box-shadow: 0px 15px 30px -7px rgba(var(--frontRGB), 0.1),
                0px 4px 8px -2px rgba(var(--frontRGB), 0.1);
    border-radius: 21px;
    transition: opacity 250ms $ease;
  }

  h3 {
    margin: 0;
    @include r('margin-top', 10, 15);
    @include r('font-size', 16, 16);
    line-height: 1.4;
    font-weight: normal;
    color: var(--foreground);
    transition: all 100ms $ease;

    a {
      text-decoration: none;
      color: var(--foreground);
      border-bottom: 1px dashed transparent;

      &:hover {
        color: var(--primary);
        border-color: var(--primary);
      }
    }
  }

  p {
    margin: 5px 0 0 0;
    @include r('font-size', 14, 14);
    color: #606060;

    a {
      text-decoration: none;
      color: var(--neutral-7);
      border-bottom: 1px dashed transparent;

      &:hover {
        color: var(--primary);
        border-color: var(--primary);
      }
    }

    &.-flow {
      @include r('margin-top', 5, 5);
    }
  }

  &.-loading {
    img {
      opacity: 0;
    }
  }

  &:hover {
    h3 {
      color: var(--primary);
    }
  }

  @include media-query(small) {
    // flex-basis: 125px;
    flex-basis: calc(50vw - 30px)
  }

  @include media-query(medium-up) {
    max-width: 200px;
    flex-basis: 200px;
  }
}

</style>
