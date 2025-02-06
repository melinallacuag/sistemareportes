<template>
    <div class="overflow-x-auto bg-white dark:bg-white p-6 rounded-lg shadow-md">
        <div class="bg-[#212529] text-white p-3 rounded-lg flex justify-between items-center mb-4">
            <h1 class="text-xs font-bold uppercase tracking-widest">Perfil Usuario</h1>
        </div>

        <form @submit.prevent="guardarCambios">
            <!-- Segunda fila -->
            <label class="block text-[#0018b2] mb-2 text-xs font-bold tracking-wider">
                DATOS DEL USUARIO:
            </label>
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                <div>
                    <label for="rol" class="block text-sm font-medium text-black">Rol:</label>
                    <select v-model="usuario.rol" id="rol" disabled
                        class="border border-gray-300 rounded-lg px-3 py-2 w-full bg-gray-100 cursor-not-allowed text-sm">
                        <option value="" selected>SELECCIONAR ROL</option>
                        <option v-for="rol in roles" :key="rol.id" :value="rol.id" class="text-sm">
                            {{ rol.descripcion }}
                        </option>
                    </select>
                </div>
                <div>
                    <label for="estado" class="block text-sm font-medium text-black">Estado:</label>
                    <select v-model="usuario.estado" id="estado"
                        class="border border-gray-300 rounded-lg px-3 py-2 w-full text-sm">
                        <option value="activo" class="text-sm">ACTIVO</option>
                        <option value="inactivo" class="text-sm">INACTIVO</option>
                    </select>
                </div>
            </div>
            <!-- Primera fila -->
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">

                <div>
                    <label for="codigo" class="block text-sm font-medium text-black">DNI/RUC:</label>
                    <input type="text" v-model="usuario.codigo" id="codigo" disabled
                        class="border border-gray-300 rounded-lg px-3 py-2 mb-2 w-full bg-gray-100 cursor-not-allowed text-sm" />
                </div>
                <div>
                    <label for="nombre" class="block text-sm font-medium text-black">Raz. Social / Nombre
                        Completo:</label>
                    <input type="text" v-model="usuario.nombre" id="nombre" disabled
                        class="border border-gray-300 rounded-lg px-3 py-2 mb-2 w-full bg-gray-100 cursor-not-allowed text-sm" />
                </div>
            </div>
            <label class="block font-bold text-[#0018b2] mb-2 text-xs tracking-wider">
                CREDENCIALES DEL USUARIO:
            </label>
            <!-- Tercera fila -->
            <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mb-4">
                <div>
                    <label for="nickname" class="block text-sm font-medium text-black">ID Usuario:</label>
                    <input type="text" v-model="usuario.nickname" id="nickname" disabled
                        class="border border-gray-300 rounded-lg px-3 py-2 mb-2 w-full bg-gray-100 cursor-not-allowed text-sm" />
                </div>
                <div>
                    <label for="contraseña" class="block text-sm font-medium text-black">Contraseña *</label>
                    <div class="relative">
                        <input :type="showPassword ? 'text' : 'password'" v-model="password" id="contraseña"
                            @input="errorMessages.password = ''" placeholder="Ingresar Contraseña"
                            class="border border-gray-300 rounded-lg px-3 py-2 mb-2 w-full text-sm" />
                        <span @click="toggleShowPassword"
                            class="absolute right-3 top-5 transform -translate-y-1/2 cursor-pointer">
                            <i :class="showPassword ? 'fas fa-eye' : 'fas fa-eye-slash'"></i>
                        </span>

                    </div>
                    <div class="block text-sm font-medium text-black text-end">
                        Mínimo 8 dígitos
                    </div>
                    <div v-if="errorMessages.password" class="text-[#ff0000] text-xs mt-1">{{
                        errorMessages.password }}
                    </div>
                </div>
                <div>
                    <label for="confirmar_contraseña" class="block text-sm font-medium text-black">Confirmar
                        Contraseña *</label>
                    <div class="relative">
                        <input  :type="showPasswordConfirmation ? 'text' : 'password'" v-model="passwordConfirmation" id="confirmar_contraseña"
                            @input="errorMessages.passwordConfirmation = ''" placeholder="Confirmar Contraseña"
                            class="border border-gray-300 rounded-lg px-3 py-2 mb-2 w-full text-sm" />
                            <span @click="toggleShowPasswordConfirmation"
                            class="absolute right-3 top-5 transform -translate-y-1/2 cursor-pointer">
                            <i :class="showPasswordConfirmation ? 'fas fa-eye' : 'fas fa-eye-slash'"></i>
                        </span>
                    </div>
                    <div class="block text-sm font-medium text-black text-end">
                        Mínimo 8 dígitos
                    </div>
                    <div v-if="errorMessages.passwordConfirmation" class="text-[#ff0000] text-xs mt-1">{{
                        errorMessages.passwordConfirmation }}</div>
                </div>
            </div>

            <!-- Botones -->
            <div class="flex justify-end space-x-4 mt-6">
                <button type="submit"
                    class="px-6 py-3 bg-[#ffc107] font-semibold text-black rounded-lg shadow-md hover:bg-[#e0a800] uppercase text-xs">
                    Guardar Cambios
                </button>
                <button @click="volver"
                    class="px-6 py-3 bg-[#212529] font-semibold text-white rounded-lg shadow-md hover:bg-[#313539] uppercase text-xs">
                    Volver
                </button>
            </div>
        </form>

        <!-- Mensaje de alerta -->
        <div v-if="alertMessage" class="mt-4 p-2 text-sm text-white bg-[#008000] rounded-md">
            {{ alertMessage }}
        </div>
        <!-- Mensaje de alerta - ERROR -->
        <div v-if="alertMessageError" class="mt-4 p-2 text-sm text-white bg-[#ff0000] rounded-md">
            {{ alertMessageError }}
        </div>
    </div>
</template>

<script>
import api from "../services/api";

export default {
    name: "PerfilUsuario",
    data() {
        return {
            roles: [],
            usuario: {
                id: null,
                codigo: "",
                nombre: "",
                rol: "",
                estado: false,
                nickname: "",
            },
            password: "",
            passwordConfirmation: "",
            alertMessage: "",
            alertMessageError: "",
            errorMessages: {
                password: "",
                passwordConfirmation: "",
            },
            showPassword: false,
            showPasswordConfirmation: false,
        };
    },
    methods: {
        async obtenerUsuario() {
            const usuarioId = this.$route.query.id;
            const token = localStorage.getItem("token");
            const usuarioBase64 = localStorage.getItem("usuario");

            try {
                const response = await api.get(`/Usuarios/datos-usuario?codigoConsultar=${usuarioId}`, {
                    headers: {
                        'Content-Type': 'application/json',
                        hToken: token,
                        hCodigo: usuarioBase64,
                    },
                });

                if (response.status === 200) {
                    this.usuario = response.data;
                } else {
                    console.error('Error al obtener el usuario:', response);
                }
            } catch (error) {
                console.error("Error al cargar el usuario:", error);
            }
        },
        async obtenerRoles() {
            const token = localStorage.getItem("token");
            const usuarioBase64 = localStorage.getItem("usuario");

            try {
                const response = await api.get(`/Usuarios/roles-usuario`, {
                    headers: {
                        'Content-Type': 'application/json',
                        hToken: token,
                        hCodigo: usuarioBase64,
                    },
                });

                if (response.status === 200) {
                    this.roles = response.data.lista || [];
                } else {
                    console.error('Error al obtener los roles:', response);
                }
            } catch (error) {
                console.error("Error al cargar los roles:", error);
            }
        },
        async cargarDatos() {
            try {
                await Promise.all([this.obtenerUsuario(), this.obtenerRoles()]);
                this.usuario.rol = this.usuario.codigoRol || "";
            } catch (error) {
                console.error('Error al cargar los datos del usuario.', error);
            }
        },
        async guardarCambios() {
            if (!this.validateForm()) return;

            const token = localStorage.getItem("token");
            const usuarioBase64 = localStorage.getItem("usuario");

            const datos = {
                codigoUsuarioEditar: this.usuario.codigo,
                nombre: this.usuario.nombre,
                codigo: this.usuario.codigo,
                rol: this.usuario.rol,
                estado: this.usuario.estado === 'activo',
                nickname: this.usuario.nickname,
                clave: this.password,
            };

            try {
                const response = await api.put(`/Usuarios/editar-usuario`, datos, {
                    headers: {
                        'Content-Type': 'application/json',
                        hToken: token,
                        hCodigo: usuarioBase64,
                    },
                });

                if (response.status === 200) {
                    this.mostrarNotificacion('Usuario actualizado correctamente.', () => {
                        this.volver();
                    });
                    this.limpiarFormulario();
                } else {
                    this.mostrarNotificacionError(response.data.mensajeError || 'Error al guardar el usuario', () => {
                    });
                }
            } catch (error) {
                this.mostrarNotificacionError(error.message || 'Error desconocido', () => {
                });
            }
        },
        validateForm() {
            let isValid = true;
            this.errorMessages = {};

            if (!this.password) {
                this.errorMessages.password = '* El campo contraseña es obligatorio';
                isValid = false;
            } else if (this.password.length < 8) {
                this.errorMessages.password = '* El campo contraseña debe contener al menos 8 caracteres.';
                isValid = false;
            }

            if (!this.passwordConfirmation) {
                this.errorMessages.passwordConfirmation = '* El campo confirmar contraseña es obligatorio';
                isValid = false;
            } else if (this.password !== this.passwordConfirmation) {
                this.errorMessages.passwordConfirmation = '* Las contraseña son distintas';
                isValid = false;
            }

            return isValid;
        },
        volver() {
            this.$router.push({ name: 'Dashboard' });
        },
        mostrarNotificacion(mensaje, callback) {
            this.alertMessage = mensaje;
            setTimeout(() => {
                this.alertMessage = "";
                if (callback) callback();
            }, 2000);
        },
        mostrarNotificacionError(mensaje, callback) {
            this.alertMessageError = mensaje
            setTimeout(() => {
                this.alertMessageError = "";
                if (callback) callback();
            }, 3000);
        },
        limpiarFormulario() {
            this.password = "";
            this.passwordConfirmation = "";
            this.errorMessages = {};
        },
        toggleShowPassword() {
            this.showPassword = !this.showPassword;
        },
        toggleShowPasswordConfirmation() {
            this.showPasswordConfirmation = !this.showPasswordConfirmation;
        },
    },
    mounted() {
        this.cargarDatos();
    },
};
</script>