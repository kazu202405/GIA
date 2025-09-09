import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'
import '@mdi/font/css/materialdesignicons.css'
import 'vuetify/styles'

export default defineNuxtPlugin((nuxtApp) => {
    const vuetify = createVuetify({
        ssr: true,
        components,
        directives,
        theme: {
            defaultTheme: 'light',
            themes: {
                light: {
                    colors: {
                        primary: '#1e50a2',
                        secondary: '#ff9800',
                        accent: '#3d7bc5',
                        error: '#f44336',
                        info: '#2196f3',
                        success: '#4caf50',
                        warning: '#ff9800',
                        surface: '#ffffff',
                        'on-surface': '#000000',
                        background: '#fafafa',
                        'on-background': '#000000',
                        'on-primary': '#ffffff',
                        'on-secondary': '#ffffff',
                        'on-accent': '#ffffff',
                        'on-error': '#ffffff'
                    }
                }
            }
        }
    })

    nuxtApp.vueApp.use(vuetify)
})