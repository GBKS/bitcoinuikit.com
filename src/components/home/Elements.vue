<template>
  <section class="home-elements">
    <div class="header-copy">
      <h3><a href="/foundation">Elements</a></h3>
      <p>Colors, text styles and other details make up the smallest parts the UI kit. Customize them and the changes are automatically applied to all the other components. Icons and illustrations via <a href="https://bitcoinicons.com/" target="_blank">Bitcoin Icons</a> and <a href="https://bitcoinicons.com/" target="_blank">Bitcoin hardware illustrations</a>.</p>
    </div>
    <div class="content-wrap">
      <div class="content">
        <ComponentInfo
          title="Colors"
          description="In four sizes. Can be used with red or green for incoming/outgoing transactions or to indicate high/low values."
        >
          <Swatches />
        </ComponentInfo>
        <div class="columns">
          <div class="column">
            <ComponentInfo
              class="-icons"
              title="Icons"
              description="120+ icons are included from the Bitcoin Icons sister project."
            >
              <div
                v-for="(item, index) in iconGrid"
                :key="index"
                v-html="item"
              />
            </ComponentInfo>
            <ComponentInfo
              title="Dropdown"
              description="You should not be able to read this. It's a placeholder."
            />
          </div>
          <div class="column">
            <ComponentInfo
              class="-toggle"
              title="Toggle"
              description="On or off. Small or big."
            >
              <Toggle :active="toggleOneActive" @toggle="toggle('One')" />
              <Toggle :active="toggleTwoActive" @toggle="toggle('Two')" />
              <Toggle size="small" :active="toggleThreeActive" @toggle="toggle('Three')" />
              <Toggle size="small" :active="toggleFourActive" @toggle="toggle('Four')" />
            </ComponentInfo>
            <ComponentInfo
              class="-tooltip"
              title="Tooltip"
              description="Provide additional details and feedback on interactions like copying."
            >
              <Tooltip label="Some very helpful info" color="blue" />
              <Tooltip label="Success" color="green" icon="check" />
              <Tooltip label="There was a problem" color="orange" />
            </ComponentInfo>
            <ComponentInfo
              title="Input field"
              description="You should not be able to read this. It's a placeholder."
            />
          </div>
          <div class="column">
            <ComponentInfo
              class="-buttons"
              title="Button"
              description="Comes in 4 sizes and 3 styles, with combinations of icon and text."
            >
              <div class="-button-columns">
                <div class="-button-column">
                  <Button label="Label" icon="caretRight" />
                  <Button label="Label" />
                  <Button icon="account" />
                </div>
                <div class="-button-column">
                  <Button label="Label" icon="caretRight" theme="outline" />
                  <Button label="Label" theme="outline" />
                  <Button icon="account" theme="outline" />
                </div>
                <div class="-button-column">
                  <Button label="Label" icon="caretRight" theme="free" />
                  <Button label="Label" theme="free" />
                  <Button icon="account" theme="free" />
              </div>
              </div>
            </ComponentInfo>
            <ComponentInfo
              class="-icon-in-circle"
              title="PIN entry"
              description="For entering and verifying PIN codes."
            >
              <CodeInput />
            </ComponentInfo>
            <ComponentInfo
              title="Checkbox"
              description="You should not be able to read this. It's a placeholder."
            />
          </div>
          <div class="column">
            <ComponentInfo
              title="Keypad"
              description="For both PIN input and entering numeric amounts."
            >
              <Keypad />
            </ComponentInfo>
            <ComponentInfo
              class="-icon-in-circle"
              title="Icon in circle"
              description="Decorative treatment for icons, often used to draw additional attention to an area."
            >
              <IconInCircle icon="account" color="blue" size="small" />
              <IconInCircle icon="account" color="blue" size="medium" />
              <IconInCircle icon="account" color="blue" size="big" />
              <IconInCircle icon="account" color="blue" size="huge" theme="light" />
              <IconInCircle icon="account" color="blue" size="massive" theme="grey" />
            </ComponentInfo>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
import ComponentInfo from '@/components/kit/ComponentInfo.vue'
import IconInCircle from '@/components/kit/IconInCircle.vue'
import Swatches from '@/components/kit/Swatches.vue'
import Toggle from '@/components/kit/Toggle.vue'
import Keypad from '@/components/kit/Keypad.vue'
import Button from '@/components/kit/Button.vue'
import CodeInput from '@/components/kit/CodeInput.vue'
import Tooltip from '@/components/kit/Tooltip.vue'
import Icons from '@/icons.js'

export default {
  name: 'HomeScreens',
  
  components: {
    ComponentInfo,
    IconInCircle,
    Swatches,
    Toggle,
    Keypad,
    Button,
    Tooltip,
    CodeInput
  },

  data() {
    return {
      iconGrid: [
        Icons.bitcoin,
        Icons.lightning,
        Icons.account,
        Icons.export,
        Icons.qr,
        Icons.gear,
        Icons.shield,
        Icons.cloud,
        Icons.visible,
        Icons.milk,
        Icons.sofa,
        Icons.ellipsis,
        Icons.help,
        Icons.caretLeft,
        Icons.caretRight,
        Icons.caretUp,
        Icons.caretDown,
        Icons.arrowLeft,
        Icons.arrowRight,
        Icons.check,
        Icons.cross,
        Icons.plus,
        Icons.clock,
        Icons.key,
        Icons.search
      ],
      toggleOneActive: false,
      toggleTwoActive: true,
      toggleThreeActive: false,
      toggleFourActive: true
    }
  },

  methods: {
    toggle(index) {
      this['toggle'+index+'Active'] = !this['toggle'+index+'Active']
    }
  }
}
</script>

<style lang="scss" scoped>

.home-elements {
  display: flex;
  flex-direction: column;
  align-items: center;

  > .content-wrap {
    height: 450px;
    width: 100vw;
    @include r('padding-top', 25, 50);
    overflow: hidden;
    display: flex;
    flex-direction: column;
    align-items: center;

    > .content {
      display: flex;
      flex-direction: column;
      gap: 20px;
      width: 1675px;
      transform: scale(0.5);
      transform-origin: center top;

      ::v-deep(.component-info) {
        box-shadow: 0 20px 60px rgba(black, 0.1);

        &.-toggle,
        &.-icon-in-circle {
          > .content {
            display: flex;
            gap: 20px;
          }
        }

        &.-tooltip {
          > .content {
            display: flex;
            flex-direction: column;
            align-items: flex-start;
            gap: 20px;
          }
        }

        &.-icons {
          > .content {
            display: flex;
            flex-wrap: wrap;
            // gap: 5px;

            > * {
              display: flex;
              justify-content: center;
              align-items: center;
              width: 20%;
              aspect-ratio: 1;
              color: var(--neutral-7);

              > * {
                width: 30px;
                height: 30px;
              }
            }
          }
        }

        &.-buttons {
          .-button-columns {
            display: flex;
            gap: 20px;
              flex-direction: column;

            .-button-column {
              display: flex;
              gap: 20px;
              align-items: flex-start;
            }
          }
        }
      }

      .columns {
        display: flex;
        gap: 20px;

        .column {
          display: flex;
          flex-direction: column;
          gap: 20px;
          width: 18%;
          flex-grow: 1;
        }
      }
    }
  }

  @include media-query(medium) {
    
  }

  @include media-query(small) {
    > .content-wrap {
      height: 220px;

      > .content {
        transform: scale(0.25);
      }
    }
  }
}

</style>