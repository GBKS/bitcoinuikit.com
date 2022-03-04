<template>
  <div class="site-info">
    <h2 id="how-to-use">How to use it</h2>
    <p>You will need a Figma account to use the kit. On the <a href="https://www.figma.com/community/file/916680391812923706/Bitcoin-Wallet-UI-Kit-(work-in-progress)" target="_blank" rel="noreferrer notarget">kit page</a>, press "Duplicate" to create your own copy of the file. You can freely modify it and use it as you&nbsp;desire.</p>

    <a
      class="button"
      :href="figmaLink.url"
      target="_blank"
      rel="noreferrer noopener"
    >{{ figmaLink.name }}
      <img
        src="/assets/arrow-right.svg"
        width="24"
        height="24"
        alt="Arrow right"
      >
    </a>

    <p>Some use case ideas:</p>

    <ul>
      <li>The foundation for a new Bitcoin wallet&nbsp;project</li>
      <li>A reference for how to solve a specific user flow or interface&nbsp;execution</li>
      <li>Create mockups and prototypes to include in the <a href="https://bitcoin.design/guide/" target="_blank" rel="noreferrer notarget">Bitcoin&nbsp;Design&nbsp;Guide</a></li>
      <li>Quick design concept explorations</li>
      <li>Developers can pick elements from the UI kit to include in their&nbsp;applications</li>
    </ul>

    <h2 id="contribute">How to contribute</h2>

    <p>The kit is a big work-in-progress and you are welcome to chip in. It is primarily maintained by <a href="https://twitter.com/gbks" target="_blank" rel="nofollow noreferrer notarget">GBKS</a>. If you have feedback, leave a comment directly in the Figma file or <a href="https://github.com/GBKS/bitcoin-wallet-ui-kit" target="_blank" rel="me">Github repo</a>.</p>

    <p>What's helpful:</p>
    
    <ul>
      <li>Point out mistakes (spelling, technical,&nbsp;visual)</li>
      <li>Ask for components, screens, etc you think should be&nbsp;added</li>
      <li>Propose specific improvements</li>
      <li>Point out alternative approaches</li>
      <li>Let me know if you made use of the&nbsp;kit</li>
    </ul>

    <p>To propose specific design changes, duplicate the file, make your changes, and leave a comment on the original file. We can then together review and merge the changes into the main file. You can also publish your file as a&nbsp;<a href="https://help.figma.com/hc/en-us/articles/360038510693-Guide-to-Figma-Community#Community_files" target="_blank" rel="nofollow noreferrer notarget">Remix</a>.</p>

    <p>You can also help out with code implementations:</p>
    
    <ul>
      <li><a href="https://github.com/reez/WalletUI" target="_blank" rel="nofollow noreferrer notarget">iOS library</a> by <a href="https://github.com/reez" target="_blank" rel="nofollow noreferrer notarget">reez</a></li>
      <li><a href="https://github.com/Aman035/wallet-ui-react" target="_blank" rel="nofollow noreferrer notarget">React Native library</a> by <a href="https://github.com/Aman035" target="_blank" rel="nofollow noreferrer notarget">Aman035</a> (currently unmaintained)</li>
    </ul>

    <h2 id="license">License</h2>

    <p>The kit is published via Figma community under the <a href="https://creativecommons.org/licenses/by/4.0/" target="_blank" rel="nofollow noreferrer notarget">CC BY 4.0 license</a>. You can modify and use it freely for personal and commercial projects, and of course the best types &mdash; open-source&nbsp;projects.</p>
  </div>
</template>

<script>
export default {
  name: 'SiteInfo',

  props: {
    figmaLink: Object
  }
}
</script>

<style lang="scss" scoped>

.site-info {
  max-width: 900px;
  margin-left: auto;
  margin-right: auto;
  @include r('margin-top', 40, 80);
  padding-left: 10px;
  padding-right: 10px;

  h2 {
    margin: 0;
    font-weight: 300;
    @include r('font-size', 24, 48);
    @include r('letter-spacing', -0.5, -3);
  }

  a.button {
    @include r('margin-top', 20, 20);
  }

  p {
    margin: 20px 0 0 0;

    & + h2 {
      margin-top: 60px;
    }
  }

  p,
  ul li {
    @include r('font-size', 15, 21);
    color: rgba(var(--frontRGB), 0.55);
    line-height: 1.6;

    a {
      color: rgba(var(--frontRGB), 1);
      transition: all 100ms $ease;

      &:hover {
        color: $primary;
      }
    }
  }

  ul {
    margin: 20px 0 0 0;

    li {

    }

    & + h2 {
      margin-top: 60px;
    }
  }

}

</style>
