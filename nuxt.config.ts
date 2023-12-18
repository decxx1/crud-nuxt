// https://nuxt.com/docs/api/configuration/nuxt-config

export default defineNuxtConfig({
  nitro: {
    preset: 'cloudflare-pages',
  },
  devtools: { 
    enabled: false,
  },
  modules: ['nuxt-primevue' ],
  primevue: {
    usePrimeVue: true,
    options:{
      ripple:true
    },
    components: {
      include: ['Toolbar','Button','FileUpload','DataTable','InputText','Column','Dialog','Toast'],
    },
  },
  css: [
    'primevue/resources/themes/lara-light-green/theme.css',
    'primeicons/primeicons.css',
    'bootstrap/dist/css/bootstrap.css',
    'primeflex/primeflex.css'
  ],
  runtimeConfig: {
    public: {
      API_PATH: process.env.PUBLIC_API_PATH,
      API_BASE_URL: process.env.PUBLIC_API_BASE_URL,
      API_BASE_URL_APP: process.env.PUBLIC_API_BASE_URL_APP,
      BASE_URL: process.env.PUBLIC_BASE_URL,
 
    },
  },
})