<template>
    <div class="surface-ground flex align-items-center justify-content-center min-h-screen min-w-screen overflow-hidden">
        <div class="flex flex-column align-items-center justify-content-center">
            <img :src="logoUrl" alt="Sakai logo" class="mb-5 w-6rem flex-shrink-0" />
            <div style="border-radius: 56px; padding: 0.3rem; background: linear-gradient(180deg, var(--primary-color) 10%, rgba(33, 150, 243, 0) 30%)">
                <div class="w-full surface-card py-8 px-5 sm:px-8" style="border-radius: 53px">
                    <div class="text-center mb-5">
                        <h1>Registro</h1>
                        <span class="text-600 font-medium">Registre una cuenta para empezar</span>
                    </div>

                    <div>
                        <label for="user1" class="block text-900 text-xl font-medium mb-2">Usuario</label>
                        <InputText id="user1" v-model="datos.name" type="text" placeholder="Usuario" class="w-full md:w-30rem mb-5" style="padding: 1rem" />

                        <label for="email1" class="block text-900 text-xl font-medium mb-2">E-mail</label>
                        <InputText id="email1" v-model="datos.email" type="email" placeholder="E-mail" class="w-full md:w-30rem mb-3" style="padding: 1rem" />

                        <label for="password1" class="block text-900 font-medium text-xl mb-2">Contraseña</label>
                        <Password id="password1" v-model="datos.password" placeholder="Contraseña" :toggleMask="true" class="w-full mb-3" inputClass="w-full" :inputStyle="{ padding: '1rem' }"></Password>
                        
                        <label for="password2" class="block text-900 font-medium text-xl mb-2">Repetir Contraseña</label>
                        <Password id="password2" v-model="datos.password_confirmation" placeholder="Repetir Contraseña" :toggleMask="true" class="w-full mb-5" inputClass="w-full" :inputStyle="{ padding: '1rem' }"></Password>
                       
                        <Button label="Registrar" @click="register()" class="w-full p-3 text-xl"></Button>
                    </div>
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
                console.log('Usuario registrado');
                Cookies.set("jwt", response.data.access_token, {sameSite: 'None', secure: true});
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


