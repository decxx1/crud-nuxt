<template>
    <div class="surface-ground flex align-items-center justify-content-center min-h-screen min-w-screen overflow-hidden">
        <div class="flex flex-column align-items-center justify-content-center">
            <img :src="logoUrl" alt="Sakai logo" class="mb-5 w-6rem flex-shrink-0" />
            <div style="border-radius: 56px; padding: 0.3rem; background: linear-gradient(180deg, var(--primary-color) 10%, rgba(33, 150, 243, 0) 30%)">
                <div class="w-full surface-card py-8 px-5 sm:px-8" style="border-radius: 53px">
                    <div class="text-center mb-5">
                        <img src="/demo/images/login/avatar.png" alt="Image" height="50" class="mb-3" />
                        <div class="text-900 text-3xl font-medium mb-3">Welcome, Isabel!</div>
                        <span class="text-600 font-medium">Sign in to continue</span>
                    </div>

                    <div>
                        <label for="email1" class="block text-900 text-xl font-medium mb-2">Usuario</label>
                        <InputText id="email1" v-model="datos.name" type="text" placeholder="Usuario" class="w-full md:w-30rem mb-5" style="padding: 1rem" />

                        <label for="password1" class="block text-900 font-medium text-xl mb-2">Contraseña</label>
                        <Password id="password1" v-model="datos.password" placeholder="Contraseña" :toggleMask="true" class="w-full mb-3" inputClass="w-full" :inputStyle="{ padding: '1rem' }"></Password>

                        <div class="flex align-items-center justify-content-between mb-5 gap-5">
                            <div class="flex align-items-center">
                                <Checkbox id="rememberme1" v-model="checked" binary class="mr-2"></Checkbox>
                                <label for="rememberme1">Remember me</label>
                            </div>
                            <a class="font-medium no-underline ml-2 text-right cursor-pointer" style="color: var(--primary-color)">Forgot password?</a>
                        </div>
                        <Button label="Entrar" @click="login()" class="w-full p-3 text-xl"></Button>
                    </div>
                    <NuxtLink to="/register" class="w-full p-3 text-xl">Ir a registrarse</NuxtLink>
                </div>
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
                console.log('Usuario logeado');
                Cookies.set("jwt", response.data.token);
                navigateTo('/crud');
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


