<template>
  <div class="seed">
    <SeedWord
      v-for="item in words"
      :word="item.word"
      :index="item.index"
      :wordId="item.id"
      :clicked="clicked"
      :key="item.id"
      :mode="mode"
      @toggle="toggle"
    />
  </div>
</template>

<script>
import SeedWord from '@/components/kit/SeedWord.vue'

export default {
  name: 'Seed',
  
  components: {
    SeedWord
  },

  data() {
    const words = [
      'viable',
      'stamp',
      'alcohol',
      'claim',
      'off',
      'fur',
      'ocean',
      'gloom',
      'hospital',
      'heart',
      'police',
      'ghost'
    ]

    const processed = {}
    let i=0, id
    for(; i<words.length; i++) {
      id = words[i]+'_'+i
      processed[id] = {
        word: words[i],
        index: i,
        id: id
      }
    }

    return {
      words: processed,
      clicked: [],
      mode: 'verify'
    }
  },

  methods: {
    toggle(wordId) {
      const item = this.words[wordId]
      const clickIndex = this.clicked.indexOf(wordId)

      if(clickIndex === -1) {
        this.clicked.push(item.id)
      } else if(clickIndex == (this.clicked.length - 1)) {
        this.clicked.splice(clickIndex, 1)
      }
    }
  }
}
</script>

<style lang="scss" scoped>

.seed {
  display: flex;
  flex-wrap: wrap;
  gap: 15px;
}

</style>
