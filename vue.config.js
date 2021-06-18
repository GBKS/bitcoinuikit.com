module.exports = {
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