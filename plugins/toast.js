import { useToast } from 'primevue/usetoast';



export default defineNuxtPlugin(nuxtApp => {
    nuxtApp.provide('toast', useToast())
})