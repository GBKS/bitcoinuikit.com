<template>
  <div class="helper-page">
    <div class="inputs">
      <textarea
        ref="input"
        v-model="inputModel"
        placeholder="Paste new data..."
        @change="changeInput"
      />
      <textarea
        ref="output"
        v-model="outputModel"
      />
    </div>
    <ScreenList
      :screenData="content"
      @remove="removeScreen"
    />
  </div>
</template>

<script>
import ScreenList from '@/components/helper/ScreenList.vue'

import Screens from '@/screens.json'

export default {
  name: 'HelperPage',

  components: {
    ScreenList
  },

  data() {
    const content = Screens.reverse()

    // Remove duplicates
    const ids = []
    let id
    for(let i=0; i<content.length; i++) {
      id = content[i].id

      if(ids.indexOf(id) !== -1) {
        content.splice(i, 1)
        i--
        console.log('Deleted duplicate:', id)
      } else {
        ids.push(id)
      }
    }

    return {
      inputModel: '',
      outputModel: JSON.stringify(content),
      content: content
    }
  },

  methods: {
    changeInput() {
      try {
        const newData = JSON.parse(this.inputModel);

        let newScreenId, oldScreenId, newIndex, oldIndex, replaced
        for(newIndex in newData) {
          replaced = false
          newScreenId = newData[newIndex]

          for(oldIndex in this.content) {
            oldScreenId = this.content[oldIndex]

            if(newScreenId == oldScreenId) {
              this.content[oldIndex] = newData[newIndex]

              replaced = true
            }
          }

          if(!replaced) {
            this.content.push(newData[newIndex])
          }
        }

        this.outputModel = JSON.stringify(this.content)
      } catch(error) {
        console.log('errror')
      }
    },

    removeScreen(screenId) {
      for(let i in this.content) {
        if(this.content[i].id == screenId) {
          this.content.splice(i, 1)
          this.outputModel = JSON.stringify(this.content)
          break;
        }
      }
    }
  }
}
</script>

<style lang="scss" scoped>

.helper-page {
  display: flex;
  gap: 40px;
  padding: 50px;

  .inputs {
    display: flex;
    flex-direction: column;
    gap: 20px;
    flex-basis: 20%;
    flex-grow: 1;

    textarea {
      min-height: 200px;
    }
  }
}

</style>
