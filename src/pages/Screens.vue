<template>
  <div class="screens-page">
    <div class="tab-bar">
      <ScreenSearch
        :term="searchTerm" 
        @changeInput="setSearchTerm"
      />
      <Tabs
        :items="tabOptions"
        :activeId="cleanActiveFlowId"
        @select="setActiveFlowId"
      />
    </div>
    <ScreenList
      v-if="sortedScreens.length > 0"
      :screenData="sortedScreens"
      :activeScreenId="activeScreenId"
      :activeFlowId="activeFlowId"
      :searchTerm="searchTerm" 
      @select="setActiveScreenId"
    />
    <p
      v-if="visibleScreens.length == 0"
      class="no-results"
    >{{ noResultsMessage }}</p>
    <ScreensOverlay
      :screenData="activeScreenData"
      :activeFlowId="activeFlowId"
      :searchTerm="searchTerm" 
      @hide="hideOverlay"
    />
  </div>
</template>

<script>
import Tabs from '@/components/Tabs.vue'
import ScreenList from '@/components/screens/ScreenList.vue'
import ScreensOverlay from '@/components/screens/Overlay.vue'
import ScreenSearch from '@/components/screens/Search.vue'

import ScreenData from '@/screens.json'

export default {
  name: 'ScreensPage',

  components: {
    Tabs,
    ScreenList,
    ScreensOverlay,
    ScreenSearch
  },

  props: [
    'screenSize'
  ],

  beforeMount() {
    this.updateTitle()
  },

  data() {
    const screenData = ScreenData
    const flowSlugs = {}

    let flow, slug
    for(let i=0; i<screenData.length; i++) {
      flow = screenData[i].flow
      if(flow) {
        slug = this.slugify(flow)
        screenData[i].flowSlug = slug
        flowSlugs[slug] = flow
      }
    }

    let activeFlowId = 'all'

    if(this.$route.params.flowId) {
      activeFlowId = this.$route.params.flowId
    }

    let activeScreenId;
    if(this.$route.params.screenId) {
      activeScreenId = this.$route.params.screenId
    }

    let searchTerm;
    if(this.$route.query.search) {
      searchTerm = this.$route.query.search
    }

    return {
      activeScreenData: null,
      searchTerm,
      screenData,
      activeScreenId,
      activeFlowId,
      flowSlugs
    }
  },

  watch: {
    $route() {
      this.activeFlowId = this.$route.params.flowId || 'all'
      this.activeScreenId = this.$route.params.screenId
      this.searchTerm = this.$route.query.search

      if(this.activeScreenId) {
        for(let i=0; i<this.screenData.length; i++) {
          if(this.screenData[i].id == this.activeScreenId) {
            this.activeScreenData = this.screenData[i]
            break;
          }
        }
      } else {
        this.activeScreenData = null
      }

      this.updateTitle()
    }
  },

  computed: {
    cleanActiveFlowId() {
      let result = this.activeFlowId

      if(result == 'all' && this.searchTerm && this.searchTerm.length > 0) {
        result = null
      }

      return result
    },

    tabOptions() {
      const result = {
        all: {
          label: 'All',
          to: '/screens'
        }
      }

      let item
      for(let i=0; i<this.screenData.length; i++) {
        item = this.screenData[i]

        if(item.flow) {
          if(!result[item.flowSlug]) {
            result[item.flowSlug] = {
              label: item.flow,
              to: '/screens/flow/'+item.flowSlug
            }
          }
        }
      }

      return result
    },

    visibleScreens() {
      let result = null
      let ids = []

      if(this.searchTerm) {
        // Search.
        result = []

        const lowerSearchTerm = this.searchTerm.toLowerCase()
        let item, k
        for(let i=0; i<this.screenData.length; i++) {
          item = this.screenData[i]

          if(item.title && item.title.toLowerCase().indexOf(lowerSearchTerm) !== -1) {
            ids.push(item.id)
            result.push(item)
          } else if(item.description && item.description.toLowerCase().indexOf(lowerSearchTerm) !== -1) {
            ids.push(item.id)
            result.push(item)
          } else if(item.text && item.text.length > 0) {
            for(k=0; k<item.text.length; k++) {
              if(item.text[k].toLowerCase().indexOf(lowerSearchTerm) !== -1) {
                ids.push(item.id)
                result.push(item)
                break;
              }
            }
          }
        }
      } else if(this.activeFlowId == 'all') {
        // No filters applied.
        result = this.screenData
      } else {
        // A specific flow.
        result = []

        for(let i=0; i<this.screenData.length; i++) {
          if(this.screenData[i].flowSlug == this.activeFlowId) {
            ids.push(this.screenData[i].id)
            result.push(this.screenData[i])
          }
        }
      }

      return result
    },

    sortedScreens() {
      const result = this.visibleScreens.slice()
      return result.sort((a, b) => {
        if(a.flow == b.flow) {
          if(a.page < b.page) return -1
          if(a.page > b.page) return 1
          return 0
        } else {
          if(a.flow < b.flow) return -1
          if(a.flow > b.flow) return 1
          return 0
        }
      })
    },

    noResultsMessage() {
      return 'No results for "'+this.searchTerm+'".'
    }
  },

  methods: {
    setActiveFlowId(value) {
      this.activeFlowId = value
    },

    setActiveScreenId(value) {
      this.activeScreenId = value

      for(let i=0; i<this.screenData.length; i++) {
        if(this.screenData[i].id == value) {
          this.activeScreenData = this.screenData[i]
          break;
        }
      }
    },

    setSearchTerm(value) {
      this.searchTerm = value
        console.log('setSearchTerm', value)

      if(value) {
        this.activeFlowId = null
      }
    },

    hideOverlay() {
      console.log('hideOverlay')
      this.activeScreenId = null
      this.activeScreenData = null
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

    updateTitle() {
      let result = 'Screens | Bitcoin UI Kit'

      if(this.activeScreenId && this.activeScreenData) {
        result =  this.activeScreenData.title + ' screen | Bitcoin UI Kit'
      } else if(this.activeFlowId) {
        result = this.flowSlugs[this.activeFlowId] + ' flow | Bitcoin UI Kit'
      } else if(this.searchTerm && this.searchTerm.length > 0) {
        result =  'Screen search | Bitcoin UI Kit'
      }

      document.title = result
    }
  }
}
</script>

<style lang="scss" scoped>

.screens-page {
  display: flex;
  flex-direction: column;
  align-items: center;
  @include r('gap', 25, 50);
  @include r('padding-top', 10, 20);

  .tab-bar {
    display: flex;
    justify-content: flex-start;
    @include r('gap', 20, 40);
    max-width: 100vw;
    overflow: hidden;
    overflow-x: scroll;
    padding-bottom: 20px;

    > * {
      flex-shrink: 0;

      &:first-child {
        margin-left: 15px;
      }

      &:last-child {
        margin-right: 15px;
      }
    }
  }
}

</style>
