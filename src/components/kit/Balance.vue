<template>
  <p
    :class="classObject"
    v-html="content"
    @click="click"
  />
</template>

<script>
export default {
  name: 'Balance',

  props: [
    'amount',
    'unit', // bitcoin, satoshi, $, €...
    'notation', // standard, compact
    'locale',
    'hidden',
    'size', // small, medium, big
  ],

  computed: {
    content() {
      let result = ''

      const notation = this.notation || 'standard'
      const locale = this.locale || 'en'

      let amountBit = this.amount;
      let minimumFractionDigits = 0
      let unit = this.unit

      switch(unit) {
        case 'bitcoin':
          unit = '₿'
          minimumFractionDigits = 8
          break
        case 'satoshi':
          unit = 'sats'
          break
        default:
          minimumFractionDigits = 2
          unit = this.unit
          break
      }

      const format = Intl.NumberFormat(locale, {
        style: 'currency',
        notation: notation,
        compactDisplay: "long",
        currency: 'BTC',
        minimumFractionDigits: minimumFractionDigits
      })
      const parts = format.formatToParts(amountBit);

      result = parts.reduce((acc, part) => {
        if(locale == 'en') {
          // console.log('a', acc, part)
        }
        
        if(part.type == 'currency') {
          return '<span class="' + part.type + '">' + acc + unit + '</span>'
        } else {
          var partBits = part.value.toString().split('')
          var partBitHTML = ''
          var partClasses, bit
          var nonZeroFound = false
          for(let i=0; i<partBits.length; i++) {
            bit = partBits[i]
            if(!nonZeroFound && bit != 0) nonZeroFound = true
            
            partClasses = ['char', '-v'+bit]
            if(!nonZeroFound) partClasses.push('-nz')
            
            partBitHTML += '<span class="' + partClasses.join(' ') + '">' + bit + '</span>'
          } 
          
          return '<span class="' + part.type + '">' + acc + partBitHTML + '</span>'
        }
      }, '')

      return result
    },

    classObject() {
      const c = [
        'balance',
        '-'+this.unit,
        '-'+(this.size || 'small')
      ]

      switch(this.size) {
        case 'big':
          c.push('-body-1')
          break
        case 'medium':
          c.push('-body-2')
          break
        default:
          c.push('-body-3')
      }

      return c.join(' ')
    }
  },

  methods: {
    click() {
      this.$emit('click');
    }
  }
}
</script>

<style lang="scss" scoped>

.balance {
  text-align: center;
  color: var(--foreground);
  letter-spacing: -0.025em;

  &.-bitcoin {
    ::v-deep(.fraction) {
      .char {
        &.-nz {
          color: var(--neutral-7);
        }
      }

      > .char {
        &:nth-child(4),
        &:nth-child(7) { padding-left: 0.3em; }
      }
    }
  }

  &.-small {
    color: var(--neutral-7);
  }

  &.-medium,
  &.-big {
    color: var(--foreground);
  }
}

</style>
