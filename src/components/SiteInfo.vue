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

    <p>Looking for an Android version? There's one created and maintained by <a href="https://twitter.com/thelendu1/status/1553083783351508992" target="_blank" rel="noreferrer notarget">Wisdom</a>:</p>

    <a
      class="button"
      :href="androidLink.url"
      target="_blank"
      rel="noreferrer noopener"
    >{{ androidLink.name }}
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

    <h2 id="workshop">Watch the workshop</h2>
    <p>It's a 1-hour introduction and how-to that covers the basics as well as putting together a simple user flow.</p>

    <a class="video" href="https://www.youtube.com/watch?v=wGQS4JMYLZM" target="_blank" rel="noreferrer notarget" title="View workshop video">
      <img
        src="/assets/workshop-cover.jpg"
        srcset="/assets/workshop-cover.jpg 1x, /assets/workshop-cover@2x.jpg 2x"
        width="900"
        height="506"
        alt="YouTube video cover of the UI Kit workshop"
      >
      <span>
        <svg width="62" height="62" viewBox="0 0 62 62" fill="none" xmlns="http://www.w3.org/2000/svg" alt="">
          <circle cx="31" cy="31" r="29" fill="black" fill-opacity="0.2" stroke="white" stroke-width="2"/>
          <path d="M24 40.4951V21.5049C24 19.9563 25.6842 18.9952 27.0175 19.783L43.0861 29.2781C44.3962 30.0523 44.3962 31.9477 43.0861 32.7219L27.0175 42.217C25.6842 43.0048 24 42.0437 24 40.4951Z" fill="white"/>
        </svg>
      </span>
    </a>

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
    figmaLink: Object,
    androidLink: Object
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

  a.button,
  a.video {
    @include r('margin-top', 20, 20);
  }

  a.video {
    display: block;
    position: relative;
    line-height: 0;

    img {
      width: 100%;
      height: auto;
    }

    span {
      position: absolute;
      left: 0;
      top: 0;
      width: 100%;
      height: 100%;
      display: flex;
      justify-content: center;
      align-items: center;
      transition: all 150ms linear;
      background-color: rgba(0, 0, 0, 0.1);

      svg {
        transition: all 150ms linear;
      }
    }

    &:hover {
      span {
        background-color: rgba(0, 0, 0, 0.25);

        svg {
          transform: scale(1.1, 1.1);
        }
      }
    }

    & + h2 {
      margin-top: 60px;
    }
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
