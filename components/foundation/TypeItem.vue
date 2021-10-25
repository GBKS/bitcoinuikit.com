<template>
  <div class="type-item">
    <div class="info">
      <h4>{{ typeData.label }}</h4>
      <p>{{ details }}</p>
    </div>
    <component :is="typeData.tag" :style="styleObject">{{ typeData.copy }}</component>
  </div>
</template>

<script>
export default {
  name: 'TypeItem',

  props: [
    'typeData'
  ],

  computed: {
    styleObject() {
      const result = {
        fontSize: this.typeData.size+'px',
        fontWeight: this.typeData.weight,
        lineHeight: this.typeData.lineHeight+'%'
      }

      if(this.typeData.max) {
        result.maxWidth = this.typeData.max+'px'
      }

      return result
    },

    details() {
      return 'Inter '+(this.typeData.weight == 400 ? 'Regular' : 'Semi-Bold')+' '+this.typeData.size+'/'+this.typeData.lineHeight+'%'
    }
  }
}
</script>

<style lang="scss" scoped>

@import '@/assets/css/variables.scss';
@import '@/assets/css/mixins.scss';
@import '@/assets/css/animations.scss';

.type-item {  
  .info {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding-bottom: 10px;
    border-bottom: 1px solid var(--neutral-4);

    h4 {
      margin: 0;
      color: var(--neutral-7);
      font-weight: 400;
    }

    p {
      margin: 0;
      color: var(--neutral-7);
    }
  }

  > h1,
  > h2,
  > h3,
  > h4,
  > h5,
  > h6,
  > p {
    margin: 10px 0 0 0;
    padding: 0;
    color: var(--front);
  }
}

</style>
