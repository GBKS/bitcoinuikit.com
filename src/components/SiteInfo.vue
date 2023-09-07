<template>
  <div class="site-info">
    <h2 id="how-to-use">How to use it</h2>
    <p>You will need a Figma account to use the kit. On the <a href="https://www.figma.com/community/file/916680391812923706/Bitcoin-Wallet-UI-Kit-(work-in-progress)" target="_blank" rel="nofollow noreferrer notarget">kit page</a>, press "Duplicate" to create your own copy of the file. You can freely modify it and use it as you&nbsp;desire.</p>

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

    <p>Looking for an Android version? There's one created and maintained by <a href="https://twitter.com/thelendu1/status/1553083783351508992" target="_blank" rel="nofollow noreferrer notarget">Wisdom</a>:</p>

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

    <h2 id="penpot">Penpot</h2>
    <p><a href="http://penpot.app" target="_blank" rel="nofollow noreferrer notarget">Penpot</a> is an open-source design tool with similar functionality to Figma. The <a href="https://hrf.org" target="_blank" rel="nofollow noreferrer notarget">Human Rights Foundation</a> sponsored a <a href="http://hrfbounties.org" target="_blank" rel="nofollow noreferrer notarget">Penpot</a> bounty to port the UI Kit. Submissions are linked below, each of which is maintained by its creator:</p>

    <ul>
      <li><a href="https://github.com/cypherstack/bitcoin-ui-kit-penpot" target="_blank" rel="nofollow noreferrer notarget">Cypherstack</a></li>
      <li><a href="https://github.com/benhami1ton/bitcoin-ui-kit/tree/v0.0.1" target="_blank" rel="nofollow noreferrer notarget">Ben Hamilton</a></li>
    </ul>

    <p>With Penpot quickly evolving, and there being fundamental differences between the two design tools, we are <a href="https://github.com/GBKS/bitcoin-wallet-ui-kit/issues/27" target="_blank" rel="nofollow noreferrer notarget">actively exploring</a> how to best adopt it in a broader way.</p> 

    <h2 id="use-cases">Use cases</h2>

    <p>The UI Kit grew our of the need for creating mockups and prototypes for the <a href="https://bitcoin.design/guide/" target="_blank" rel="nofollow noreferrer notarget">Bitcoin&nbsp;Design&nbsp;Guide</a>. It has since been used in many different ways, here are some of them:</p>

    <ul>
      <li>A foundation for a new bitcoin&nbsp;projects</li>
      <li>A reference for solving specific user flow or interface&nbsp;details</li>
      <li>Developers picking elements to include in their&nbsp;applications</li>
      <li>Quick design concept explorations</li>
      <li>Design tests for job applications</li>
      <li>Hackathon projects</li>
      <li>Design duels</li>
    </ul>

    <p>Did you use the UI Kit? Share in <a href="https://discord.gg/NyFbzEgdjb" target="nofollow noreferrer notarget" rel="me">Discord</a>.</p>

    <h2 id="workshop">Watch the workshop</h2>
    
    <p>It's a 1-hour introduction and how-to that covers the basics as well as putting together a simple user flow.</p>

    <a class="video" href="https://www.youtube.com/watch?v=wGQS4JMYLZM" target="_blank" rel="nofollow noreferrer notarget" title="View workshop video">
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

    <h2 id="case-studies">The UI Kit in use</h2>

    <p>These are some examples where the UI Kit was used as a foundation to create a design system for specific projects. Got one to add? Post an issue on <a href="https://github.com/GBKS/bitcoin-wallet-ui-kit" target="_blank" rel="me">GitHub</a>.</p>

    <h3><a href="https://bitcoin.design/guide/" target="_blank" rel="nofollow noreferrer notarget">Bitcoin Design Guide</a></h3>

    <img
      src="/assets/design-guide-case-study.jpg"
      srcset="/assets/design-guide-case-study.jpg 1x, /assets/design-guide-case-study@2x.jpg 2x"
      width="900"
      height="476"
      alt="Three screen mock-ups of the Daily spending wallet reference design"
    >

    <p>This project by the <a href="https://bitcoin.design" target="_blank" rel="nofollow noreferrer notarget">Bitcoin Design Community</a> gathers resources and best practices for designer and design-contributors to open-source bitcoin projects. The UI Kit is used to streamline screen mock-ups in various pages and sections, like the <a href="https://bitcoin.design/guide/daily-spending-wallet/" target="_blank" rel="nofollow noreferrer notarget">Daily spending wallet reference design</a> (see the <a href="https://www.figma.com/file/lf2Xyw2I2OXPsHiFQVQdiG/Daily-spending-wallet-prototype?node-id=4167%3A92515&t=s1jkePkgn1J0eaXQ-1" target="_blank" rel="nofollow noreferrer notarget">Figma file</a>).</p>

    <h3><a href="http://bitcoincore.app" target="_blank" rel="nofollow noreferrer notarget">Bitcoin Core App</a></h3>

    <img
      src="/assets/core-app-case-study.jpg"
      srcset="/assets/core-app-case-study.jpg 1x, /assets/core-app-case-study@2x.jpg 2x"
      width="900"
      height="476"
      alt="Three screen mock-ups of the Bitcoin Core App application"
    >

    <p>The design of this new version of the <a href="http://bitcoincore.org" target="_blank" rel="nofollow noreferrer notarget">Bitcoin Core</a> QT wallet application is based on the UI Kit, with support for both desktop and mobile. See the Figma <a href="https://www.figma.com/file/ek8w3n3upbluw5UL2lGhRx/Bitcoin-Core-App-Design?node-id=616%3A0&t=ug64haRxRHCKLjH3-1" target="_blank" rel="nofollow noreferrer notarget">project</a> and <a href="https://www.figma.com/community/file/1185218794459295422" target="_blank" rel="nofollow noreferrer notarget">community</a> files, and <a href="http://bitcoincore.app" target="_blank" rel="nofollow noreferrer notarget">design documentation</a>.</p>

    <h3><a href="https://jamapp.org" target="_blank" rel="nofollow noreferrer notarget">JAM</a></h3>    
    <img
      src="/assets/jam-case-study.jpg"
      srcset="/assets/jam-case-study.jpg 1x, /assets/jam-case-study@2x.jpg 2x"
      width="900"
      height="476"
      alt="Two screen mock-ups of the Jam web application"
    >

    <p>This web UI for <a href="https://github.com/JoinMarket-Org/joinmarket-clientserver/" target="_blank" rel="nofollow noreferrer notarget">JoinMarket</a> makes <a href="https://bitcoin.design/guide/glossary/#coinjoin" target="_blank" rel="nofollow noreferrer notarget">CoinJoins</a> simple and convenient. The UI design started by duplicating the UI Kit and adjusting it to project needs over time. It is implemented using <a href="https://getbootstrap.com" target="_blank" rel="nofollow noreferrer notarget">Bootstrap</a>. See the <a href="https://www.figma.com/file/kfejZJFlwBywvLEnPEmJo1/JoinMarket-UI?node-id=2850%3A67638&t=fOSAHpYyKIetgykb-1" target="_blank" rel="nofollow noreferrer notarget">project Figma file</a>.</p>

    <h2 id="contribute">How to contribute</h2>

    <p>The kit is a big work-in-progress and you are welcome to chip in. The project embraces the principles of <a href="https://bitcoin.design/guide/getting-started/open-design/" target="nofollow noreferrer notarget" rel="me">Open Design</a> and is primarily maintained by <a href="https://twitter.com/gbks" target="_blank" rel="nofollow noreferrer notarget">GBKS</a>. If you have feedback, leave a comment in the Figma file or <a href="https://github.com/GBKS/bitcoin-wallet-ui-kit" target="_blank" rel="me">GitHub repo</a>, or join us in <a href="https://discord.gg/NyFbzEgdjb" target="nofollow noreferrer notarget" rel="me">Discord</a>.</p>

    <p>What's helpful:</p>
    
    <ul>
      <li>Point out mistakes (spelling, technical,&nbsp;visual)</li>
      <li>Ask for components, screens, etc you think should be&nbsp;added</li>
      <li>Propose specific improvements</li>
      <li>Point out alternative approaches</li>
      <li>Improve documentation</li>
      <li>Whatever you think will move the project forward</li>
    </ul>

    <p>To propose specific design changes, duplicate the file, make your changes, and leave a comment on the original file. We can then together review and merge the changes into the main file. You can also publish your file as a&nbsp;<a href="https://help.figma.com/hc/en-us/articles/360038510693-Guide-to-Figma-Community#Community_files" target="_blank" rel="nofollow noreferrer notarget">Remix</a>.</p>

    <p>You can also help out with code implementations:</p>
    
    <ul>
      <li><a href="https://github.com/reez/BitcoinUI" target="_blank" rel="nofollow noreferrer notarget">Bitcoin UI Swift</a> by <a href="https://github.com/reez" target="_blank" rel="nofollow noreferrer notarget">Matthew</a></li>
      <li><a href="https://github.com/bdgwallet/bitcoinui-flutter" target="_blank" rel="nofollow noreferrer notarget">Bitcoin UI Flutter</a> by <a href="https://github.com/danielnordh" target="_blank" rel="nofollow noreferrer notarget">Daniel</a></li>
      <li><a href="https://github.com/EttaWallet/etta-ui" target="_blank" rel="nofollow noreferrer notarget">Etta UI</a> for React Native by <a href="https://github.com/crukundo" target="_blank" rel="nofollow noreferrer notarget">Collin</a></li>
      <li><a href="https://github.com/Aman035/wallet-ui-react" target="_blank" rel="nofollow noreferrer notarget">Wallet UI</a> for React Native by <a href="https://github.com/Aman035" target="_blank" rel="nofollow noreferrer notarget">Aman035</a> (currently unmaintained)</li>
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

    & + h3 {
      margin-top: 20px;
    }
  }

  h3 {
    margin: 0;
    font-weight: 300;
    @include r('font-size', 20, 30);
    @include r('letter-spacing', -0.5, -1);

    a {
      color: var(--front);
      transition: all 100ms $ease;

      &:hover {
        color: var(--primary);
      }
    }
    
    & + img {
      margin-top: 20px;
    }
  }

  a:not(.button, .video) {
    text-decoration: none;
    display: inline-block;
    position: relative;

    &:before {
      content: '';
      display: block;
      position: absolute;
      left: 0;
      bottom: 2px;
      width: 100%;
      height: 1px;
      transition: all 100ms $ease;
      background-color: rgba(var(--frontRGB), 0.15);
      pointer-events: none;
    }

    &:hover {
      &:before {
        background-color: var(--primary);
      }
    }
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
      @include r('margin-top', 40, 60);
    }

    & + h3 {
      @include r('margin-top', 20, 30);
    }
  }

  a.button + h2 {
    @include r('margin-top', 40, 60);
  }

  p,
  ul li {
    @include r('font-size', 15, 21);
    color: rgba(var(--frontRGB), 0.55);
    line-height: 1.6;
    text-wrap: balance;

    a {
      color: rgba(var(--frontRGB), 1);
      transition: all 100ms $ease;

      &:hover {
        color: $primary;
      }
    }
  }

  > img {
    width: 100%;
    height: auto;
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