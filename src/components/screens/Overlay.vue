<template>
  <transition name="fade">
  <div
    ref="overlay"
    class="screens-overlay" 
    v-if="screenData" 
    @click="clickBack"
  >
    <div class="wrap" ref="wrap">
      <div class="content">
        <div class="copy">
          <router-link :to="closeLink">Close</router-link>
          <h3>{{ screenData.title }}</h3>
          <p v-if="screenData.description">{{ screenData.description }}</p>
          
          <div 
            v-if="flowText"
            class="-flow" 
          >
            <h4>User flow</h4>
            <router-link :to="flowLink">{{ screenData.flow }}</router-link>
            <div class="-screen">
              <p>Screen {{ flowText }}</p>
              <router-link
                v-if="previousScreenData"
                class="-previous"
                aria-label="Previous screen"
                :to="previousLink"
              >
                <img
                  src="/assets/caret-down.svg"
                  alt="Arrow right"
                >
              </router-link>
              <router-link
                v-if="nextScreenData"
                class="-next"
                aria-label="Next screen"
                :to="nextLink"
              >
                <img
                  src="/assets/caret-down.svg"
                  alt="Arrow right"
                >
              </router-link>
            </div>
          </div>

          <div 
            v-if="screenData.links"
            class="-links" 
          >
            <h4>Links</h4>
            <a
              v-for="(item, index) in screenData.links"
              :key="index"
              :href="item.url"
              target="_blank"
            >{{ item.title }}</a>
          </div>
        </div>
        <div class="screen">
          <router-link
            v-if="nextScreenData"
            aria-label="View next screen"
            :to="nextLink"
          >
            <img
              :src="imageFile"
              :srcset="imageSourceSet"
              width="375"
              height="812"
              :alt="screenData.title"
            >
          </router-link>
          <img
            v-if="!nextScreenData"
            :src="imageFile"
            :srcset="imageSourceSet"
            width="375"
            height="812"
            :alt="screenData.title"
          >
        </div>
      </div>
    </div>  
  </div>
</transition>
</template>

<script>
export default {
  name: 'ScreensOverlay',

  props: [
    'screenData',
    'nextScreenData',
    'previousScreenData',
    'activeFlowId',
    'searchTerm'
  ],

  watch: {
    screenData() {
      if(this.screenData) {
        document.body.classList.add('-overlay-visible')
      } else {
        document.body.classList.remove('-overlay-visible')
      }
    }
  },

  mounted() {
    if(this.screenData) {
      document.body.classList.add('-overlay-visible')
    }
  },

  computed: {
    imageFile() {
      return '/assets/screens/'+this.screenData.id+'.png'
    },

    imageSourceSet() {
      return '/assets/screens/'+this.screenData.id+'.png 1x, '+'/assets/screens/'+this.screenData.id+'@2x.png 2x'
    },

    flowLink() {
      return '/screens/flow/'+this.slugify(this.screenData.flow)
    },

    flowText() {
      let result = null

      if(this.screenData.flow) {
        result = this.screenData.page + ' of ' + this.screenData.pagemax 
      }

      return result
    },

    closeLink() {
      let result = '/screens'

      if(this.activeFlowId && this.activeFlowId != 'all') {
        result = '/screens/flow/' + this.activeFlowId
      }

      if(this.searchTerm) {
        result += '?search='+this.searchTerm
      }

      return result
    },

    nextLink() {
      const slug = this.slugify(this.nextScreenData.id)

      let result = '/screens/screen/' + slug

      if(this.activeFlowId && this.activeFlowId !== 'all') {
        result = '/screens/flow/' + this.activeFlowId + '/' + slug
      }

      if(this.searchTerm) {
        result += '?search='+this.searchTerm
      }

      return result
    },

    previousLink() {
      const slug = this.slugify(this.previousScreenData.id)

      let result = '/screens/screen/' + slug

      if(this.activeFlowId && this.activeFlowId !== 'all') {
        result = '/screens/flow/' + this.activeFlowId + '/' + slug
      }

      if(this.searchTerm) {
        result += '?search='+this.searchTerm
      }

      return result
    }
  },

  methods: {
    hide() {
      this.$emit('hide')
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

    clickBack(event) {
      // console.log('clickBack', event.target)

      if(event.target == this.$refs.wrap || event.target == this.$refs.overlay) {
        this.$router.push(this.closeLink)
      }
    }
  }
}
</script>

<style lang="scss" scoped>

.screens-overlay {
  display: flex;
  gap: 50px;
  justify-content: center;
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  min-height: 100vh;
  background-color: rgba(var(--frontRGB), 0.2);

  .wrap {
    .content {
      padding: 40px;
      background-color: #f4f4f4;

      .screen {
        flex-basis: 300px;

        img {
          width: auto;
          height: auto;
          max-width: 300px;
          box-shadow: 0px 10px 30px 0px #0000000D;
          border-radius: 40px;
        }
      }

      .copy {
        display: flex;
        flex-direction: column;

        h3 {
          margin: 30px 0 0 0;
          @include r('font-size', 21, 24);
          font-weight: normal;

          & + p {
            // margin-top: 10px; 
          }
        }

        p,
        .-flow a,
        .-links a {
          margin: 0;
          @include r('font-size', 15, 18);
          line-height: 1.4;
          color: #606060;

          b {
            color: var(--neutral-6);
            font-weight: 400;
          }
        }

        .-flow,
        .-links {
          a {
            color: var(--front);
            text-decoration: none;
            border-bottom: 1px dashed transparent;

            &:hover {
              color: var(--primary);
              border-color: var(--primary);
            }
          }
        }

        .-links {
          display: flex;
          flex-direction: column;
          align-items: flex-start;
        }

        h4 {
          margin: 15px 0 0 0;
          @include r('font-size', 17, 19);
          color: var(--neutral-6);
          font-weight: 400;
        }

        .-screen {
          margin-top: 3px;
          display: flex;
          align-items: center;

          p {
            @include r('font-size', 13, 15);
            margin-top: 0;
            margin-right: 5px;
          }

          a {
            appearance: none;
            border-width: 0;
            line-height: 0;
            padding: 3px;
            background-color: transparent;
            opacity: 0.5;
            border-radius: 2px;
            transition: all 100ms $ease;
            cursor: pointer;

            img {
              width: 18px;
              height: 18px;
            }

            &.-previous {
              img {
                transform: rotate(90deg);
              }
            }

            &.-next {
              img {
                transform: rotate(-90deg);
              }
            }

            &:hover {
              opacity: 1;
              background-color: rgba(black, 0.1);
            }
          }
        }

        > a {
          margin: 0;
          padding: 0;
          align-self: flex-end;
          appearance: none;
          border-width: 0;
          background-color: transparent;
          color: var(--front);
          text-decoration: none;
          border-bottom: 1px dashed transparent;

          &:hover {
            color: var(--primary);
            border-color: var(--primary);
          }
        }
      }
    }
  }

  @include media-query(small) {
    height: 100vh;

    .wrap {
      width: 100%;
      height: 100%;
      max-height: 100vh;
      overflow: hidden;
      overflow-y: scroll;
      -webkit-overflow-scrolling: touch;

      .content {
        .screen {
          margin-top: 30px;
          
          img {
            display: block;
          }
        }

        .screen,
        .copy {
          width: 100%;
          max-width: 300px;
          margin-left: auto;
          margin-right: auto;
        }
      }
    }
  }

  @include media-query(medium-up) {
    .wrap {
      display: flex;
      justify-content: center;
      align-items: center;

      .content {
        display: flex;
        flex-shrink: 0;
        gap: 40px;
        flex-basis: 640px;
        border-radius: 5px;
        box-shadow: 0 50px 75px -25px rgba(black, 0.35); 

        img {
          order: 1;
        }

        .copy {
          order: 2;
          flex-grow: 1;
          flex-basis: 300px;
        }
      }
    }
  }
}

.fade-enter-active, .fade-leave-active {
  transition: opacity .5s;
}
.fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */ {
  opacity: 0;
}

</style>
