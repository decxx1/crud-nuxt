<template>
    <div class="surface-ground flex align-items-center justify-content-center min-h-screen min-w-screen overflow-hidden">
        <div class="surface-card p-4 shadow-2 border-round w-full lg:w-4">
            <div class="text-center mb-5">
                <img src="/demo/images/blocks/logos/hyper.svg" alt="Image" height="50" class="mb-3">
                <div class="text-900 text-3xl font-medium mb-3">Registro</div>
                <span class="text-600 font-medium line-height-3">¿Ya tienes cuenta?</span>
                <NuxtLink to="/" class="font-medium no-underline ml-2 text-blue-500 cursor-pointer">¡ Inicie sesión !</NuxtLink>
            </div>

            <div>
                <label for="user1" class="block text-900 text-xl font-medium mb-2">Usuario</label>
                <InputText id="user1" v-model="datos.name" type="text" placeholder="Usuario" class="w-full mb-5" />

                <label for="email1" class="block text-900 text-xl font-medium mb-2">E-mail</label>
                <InputText id="email1" v-model="datos.email" type="email" placeholder="E-mail" class="w-full mb-3" />

                <label for="password1" class="block text-900 font-medium text-xl mb-2">Contraseña</label>
                <Password id="password1" v-model="datos.password" placeholder="Contraseña" :toggleMask="true" class="w-full mb-3" inputClass="w-full" :inputStyle="{ padding: '1rem' }"></Password>
                        
                <label for="password2" class="block text-900 font-medium text-xl mb-2">Repetir Contraseña</label>
                <Password id="password2" v-model="datos.password_confirmation" placeholder="Repetir Contraseña" :toggleMask="true" class="w-full mb-5" inputClass="w-full" :inputStyle="{ padding: '1rem' }"></Password>


                <Button label="Registrar" @click="register()" icon="pi pi-user" class="w-full"></Button>
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
            datos:{name:'',email:'',password:'',password_confirmation:''},
            checked:'',
            api:''
        }
    },
    created() {
        this.api = useRuntimeConfig().public.API_PATH;
    },
    methods: {
        register(){
            var self = this;
            axios.post(self.api + 'api/register', self.datos)
            .then(response => {
                Cookies.set("jwt", response.data.access_token, {sameSite: 'None', secure: true});
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


