import { defineNuxtConfig } from 'nuxt3'

export default defineNuxtConfig({
    buildDir: 'dist',
    css: [
        '~/assets/css/variables.scss',
        '~/assets/css/mixins.scss',
        '~/assets/css/animations.scss',
        '~/assets/css/inter.css',
        '~/assets/css/fonts.scss',
        '~/assets/css/button.scss',
        '~/assets/css/normalize.scss',
        '~/assets/css/main.scss'
    ]
})
