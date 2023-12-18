<template>
    <div class="container">
        <h1 class="mt-5 mb-5">Usuarios</h1>
        <div class="card">
            <Toast />
            <Toolbar class="mb-4">
                <template #start>
                    <Button label="New" icon="pi pi-plus" severity="success" class="mr-2" @click="openForm()" />
                    <Button label="Delete" icon="pi pi-trash" severity="danger" @click="confirmDeleteSelected" :disabled="!selectedUsers || !selectedUsers.length" />
                </template>

                <template #end>
                    <FileUpload mode="basic" accept="image/*" :maxFileSize="1000000" label="Import" chooseLabel="Import" class="mr-2 inline-block" />
                    <Button label="Export" icon="pi pi-upload" severity="help" @click="exportCSV($event)"  />
                </template>
            </Toolbar>

            <DataTable ref="dt" :value="users" v-model:selection="selectedUsers" dataKey="id" 
                :paginator="true" :rows="10" :filters="filters"
                paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown" :rowsPerPageOptions="[5,10,25]"
                currentPageReportTemplate="Showing {first} to {last} of {totalRecords} users">
                <template #header>
                    <div class="flex flex-wrap gap-2 align-items-center justify-content-between">
                        <h4 class="m-0">Lista de Usuarios</h4>
						<span class="p-input-icon-left">
                            <i class="pi pi-search" />
                            <InputText v-model="filters['global'].value" placeholder="Search..." />
                        </span>
					</div>
                </template>

                <Column selectionMode="multiple" style="width: 3rem" :exportable="false"></Column>
                <Column field="id" header="ID" sortable style="min-width:12rem"></Column>
                <Column field="name" header="Nombre" sortable style="min-width:16rem"></Column>
                <Column field="email" header="E-mail" sortable style="min-width:12rem"></Column>
                <Column field="created_at" header="Creado" sortable style="min-width:16rem"></Column>


                <Column :exportable="false" style="min-width:4rem">
                    <template #body="slotProps">
                        <Button icon="pi pi-pencil" outlined rounded class="mr-2" @click="editForm(slotProps.data)" />
                        <Button icon="pi pi-trash" outlined rounded severity="danger" @click="confirmDeleteUser(slotProps.data)" />
                    </template>
                </Column>
            </DataTable>
        </div>

        <!-- Crear y editar -->
        <Dialog v-model:visible="userDialog" :style="{width: '450px'}" header="Crear Usuario" :modal="true" class="p-fluid">
            <div class="field">
                <label for="name">Nombre</label>
                <InputText id="name" v-model.trim="user.name" required="true" type="text" autofocus :class="{'p-invalid': submitted && !user.name}" />
                <small class="p-error" v-if="submitted && !user.name">Nombre es Requerido.</small>
            </div>
            <div class="field">
                <label for="email">E-mail</label>
                <InputText id="email" v-model.trim="user.email" required="true" type="email" autofocus :class="{'p-invalid': submitted && !user.email}" />
                <small class="p-error" v-if="submitted && !user.email">E-mail es Requerido.</small>
            </div>
            <div class="field">
                <label for="password">Contraseña</label>
                <InputText id="password" v-model.trim="user.password" required="true" type="password" autofocus :class="{'p-invalid': submitted && !user.password}" />
                <small class="p-error" v-if="submitted && !user.password">Contraseña es Requerida.</small>
            </div>

            <template #footer>
                <Button label="Cancel" icon="pi pi-times" text @click="hideDialog"/>
                <Button v-show="!user.id" label="Crear Usuario" icon="pi pi-check" text @click="create()" />
                <Button v-show="user.id" label="Editar Usuario" icon="pi pi-check" text @click="edit()" />
            </template>
        </Dialog>

        <!-- Borrar usuario -->
        <Dialog v-model:visible="deleteuserDialog" :style="{width: '450px'}" header="Confirm" :modal="true">
            <div class="confirmation-content">
                <i class="pi pi-exclamation-triangle mr-3" style="font-size: 2rem" />
                <span v-if="user">Seguro que desea eliminar <b>{{user.name}}</b>?</span>
            </div>
            <template #footer>
                <Button label="No" icon="pi pi-times" text @click="deleteuserDialog = false"/>
                <Button label="si" icon="pi pi-check" text @click="deleteUser()" />
            </template>
        </Dialog>
        
    </div>
</template>

<script >
import axios from 'axios';
import { FilterMatchMode } from 'primevue/api';

export default {
    data() {
        return {
            userDialog: false,
            deleteuserDialog: false,
            deleteUsersDialog: false,
            selectedUsers: null,
            filters: {},
            submitted: false,
            user:{},
            users: [],
            api: '',
        }
    },
    created() {
        this.initFilters();
        this.api = useRuntimeConfig().public.API_PATH;
        
    },
    async mounted() {
        const response = await fetch(this.api + 'api/user/index');
        this.users = await response.json();
    },
    methods: {
        openForm(){
            this.resetUser();
            this.submitted = false;
            this.userDialog = true;
        },
        editForm(items) {
            this.user = {...items};
            this.userDialog = true;
        },
        confirmDeleteUser(items) {
            this.user = items;
            this.deleteuserDialog = true;
        },
        resetUser(){
            this.user = {};
        },
        reloadUsers(){
            var self = this;
            axios.get(self.api + 'api/user/index')
            .then(response => {
                self.users = response.data;
            })
            .catch(error => {
                console.log(error);
            })
        },
        create(){
            this.submitted = true;
            var self = this;
            axios.post(self.api + 'api/user/create', self.user)
            .then(response => {
                console.log('usuario creado');
                self.reloadUsers();
                self.$toast.add({severity:'success', summary: 'Successful', detail: 'Usuario creado', life: 3000});
                self.userDialog = false;
                self.resetUser();
                self.reloadUsers();
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
        },
        edit() {
            this.submitted = true;
            var self = this;
            axios.put(self.api + 'api/user/update/'+self.user.id, self.user)
            .then(response => {
                console.log('Usuario editado');
                self.reloadUsers()
                self.$toast.add({severity:'success', summary: 'Successful', detail: 'Usuario editado', life: 3000});
                self.reloadUsers();
                self.userDialog = false;
                self.resetUser();
            })
            .catch(error => {
                console.error(error);
                if (error.response && error.response.data && error.response.data.message) {
                    const errorMessage = error.response.data.message;
                    console.error(errorMessage);
                    self.$toast.add({ severity: 'error', summary: 'Error!', detail: errorMessage, life: 4000 });
                } else {
                    console.error(error);
                    self.$toast.add({ severity: 'error', summary: 'Error!', detail: 'Error desconocido', life: 4000 });
                }
            })
        },
        deleteUser() {
            var self = this;
            axios.delete(self.api + 'api/user/delete/'+self.user.id)
            .then(response => {
                console.log('usuario borrado');
                self.$toast.add({severity:'success', summary: 'Successful', detail: 'Usuario eliminado', life: 3000});
            })
            .catch(error => {
                console.log(error);
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
                self.reloadUsers();
                self.deleteuserDialog = false;
                self.resetUser();
            });
        },
        hideDialog() {
            this.userDialog = false;
            this.submitted = false;
        },
        exportCSV() {
            this.$refs.dt.exportCSV();
        },
        confirmDeleteSelected() {
            this.deleteUsersDialog = true;
        },
        initFilters() {
            this.filters = {
                'global': {value: null, matchMode: FilterMatchMode.CONTAINS},
            }
        },
    }
}

</script>


<style>

</style>