<template>
    <div class="surface-ground flex align-items-center justify-content-center min-h-screen min-w-screen overflow-hidden">
        <div class="surface-card p-4 shadow-2 border-round w-full lg:w-4">
            <div class="text-center mb-5">
                <img src="/demo/images/blocks/logos/hyper.svg" alt="Image" height="50" class="mb-3">
                <div class="text-900 text-3xl font-medium mb-3">Bienvenido</div>
                <span class="text-600 font-medium line-height-3">¿No tienes cuenta?</span>
                <NuxtLink to="/register" class="font-medium no-underline ml-2 text-blue-500 cursor-pointer">¡ Regístrate !</NuxtLink>
            </div>

            <div>
                <label for="email1" class="block text-900 font-medium mb-2">Usuario</label>
                <InputText id="email1" v-model="datos.name" type="text" class="w-full mb-3" />

                <label for="password1" class="block text-900 font-medium mb-2">Contraseña</label>
                <InputText id="password1" v-model="datos.password" type="password" class="w-full mb-3" />

                <div class="flex align-items-center justify-content-between mb-6">
                    <div class="flex align-items-center">
                        <Checkbox id="rememberme1" :binary="true" v-model="checked" class="mr-2"></Checkbox>
                        <label for="rememberme1">Remember me</label>
                    </div>
                    <a class="font-medium no-underline ml-2 text-blue-500 text-right cursor-pointer">Forgot password?</a>
                </div>

                <Button label="Entrar" @click="login()" icon="pi pi-user" class="w-full"></Button>
            </div>
        </div>
    </div>
    
    <AppConfig simple />
    <Toast />
</template>

<script setup>
import { useLayout } from '@/layouts/composables/layout';
import AppConfig from '@/layouts/AppConfig.vue';

definePageMeta({
    layout: false
});
</script>
<script>
import axios from 'axios';
import Cookies from "js-cookie";
const { layoutConfig } = useLayout();

export default {
    data() {
        return {
            datos:{name:'',password:''},
            checked:'',
            api:''
        }
    },
    created() {
        this.api = useRuntimeConfig().public.API_PATH;
    },
    methods: {
        login(){
            var self = this;
            axios.post(self.api + 'api/login', self.datos)
            .then(response => {
                Cookies.set("jwt", response.data.token, {sameSite: 'None', secure: true});
                navigateTo('/dashboard');
            })
            .catch(error => {
                console.error(error)
                if (error.response && error.response.data && error.response.data.message) {
                    const errorMessage = error.response.data.message;
                    console.error(errorMessage);
                    self.$toast.add({ severity: 'error', summary: 'Error!', detail: errorMessage, life: 4000 });
                } else {
                    console.error(error);
                    self.$toast.add({ severity: 'error', summary: 'Error!', detail: 'Error desconocido', life: 4000 });
                }
            })
            .finally(() => {
                
            });
        },
    },
    computed: {
        logoUrl() {
            return `/layout/images/${layoutConfig.darkTheme.value ? 'logo-white' : 'logo-dark'}.svg`;
        }
    }
}
</script>


<style scoped>
.pi-eye {
    transform: scale(1.6);
    margin-right: 1rem;
}
.pi-eye-slash {
    transform: scale(1.6);
    margin-right: 1rem;
}
</style>


