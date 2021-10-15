module.exports = {
    css: {
        loaderOptions: {
            sass: {
                additionalData: `
                    @import "@/scss/variables.scss";
                    @import "@/scss/animations.scss";
                    @import "@/scss/mixins.scss";
                    @import "@/scss/normalize.scss";
                    @import "@/scss/button.scss";
                    @import "@/scss/fonts.scss";
                    @import "@/scss/main.scss";
                `
            }
        }
    },
    chainWebpack: config => {
        config
            .plugin('html')
            .tap(args => {
                args[0].title = "Bitcoin UI Kit";
                args[0].description = "A design system and UI kit for Bitcoin wallet applications.";
                args[0].locale = "en_US";
                args[0].canonical = "https://bitcoinuikit.com";
                args[0].preview = "https://bitcoinuikit.com/bitcoin-ui-kit.jpg";
                return args;
            })
    }
}