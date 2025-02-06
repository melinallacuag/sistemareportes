<template>
    <div class="overflow-x-auto bg-white dark:bg-white p-6 rounded-lg shadow-md">
        <div class="bg-[#212529] text-white p-3 rounded-lg flex justify-between items-center mb-4">
            <h1 class="text-xs font-bold uppercase tracking-widest">Crear Usuario</h1>
        </div>

        <form @submit.prevent="crearUsuarios">
            <!-- Segunda fila -->
            <label class="block text-[#0018b2] mb-2 text-xs font-bold tracking-wider">
                DATOS DEL USUARIO:
            </label>
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                <div>
                    <label for="rol" class="block text-sm font-medium text-black">Rol *</label>
                    <select v-model="rol" id="rol" @change="errorMessages.rol = ''"
                        class="border border-gray-300 rounded-lg px-3 py-2 w-full text-sm">
                        <option value="" selected>Seleccionar Rol</option>
                        <option v-for="rol in roles" :key="rol.id" :value="rol.id" class="text-sm">
                            {{ rol.descripcion }}
                        </option>
                    </select>
                    <div v-if="errorMessages.rol" class="text-[#ff0000] text-xs mt-1">{{
                        errorMessages.rol }}
                    </div>
                </div>
                <div>
                    <label for="estado" class="block text-sm font-medium text-black">Estado *</label>
                    <select id="estado" v-model="usuario.estado"
                        class="border border-gray-300 rounded-lg px-3 py-2 w-full text-sm">
                        <option value="activo" class="text-sm">ACTIVO</option>
                        <option value="inactivo" class="text-sm">INACTIVO</option>
                    </select>
                </div>
            </div>
            <!-- Primera fila -->
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                <div class="flex items-end gap-2">
                    <div class="flex-1">
                        <label for="codigo" class="block text-sm font-medium text-black">DNI/RUC *</label>
                        <div class="flex">
                            <input type="text" v-model="codigo" id="codigo" @input="handleInputCodigo"
                                placeholder="Ingresar DNI/RUC" pattern="\d*"
                                class="border border-gray-300 rounded-l-lg px-3 py-2 mb-2 w-full text-sm" />
                            <a @click="consultarUsuario"
                                class="flex items-center text-xs bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-r-lg mb-2 uppercase">
                                Consultar
                            </a>
                        </div>
                        <div class="block text-sm font-medium text-black text-end pr-[105px]">
                            {{ codigo.length }}/11
                        </div>
                        <div v-if="errorMessages.codigo" class="text-[#ff0000] text-xs mt-1">
                            {{ errorMessages.codigo }}
                        </div>
                    </div>
                </div>

                <div>
                    <label for="nombre" class="block text-sm font-medium text-black">Raz. Social / Nombre Completo
                        *</label>
                    <input type="text" v-model="nombre" id="nombre" @input="handleInputRNombre" disabled
                        placeholder="Ingresar Nombre Completo"
                        class="border border-gray-300 rounded-lg px-3 py-2 mb-2 w-full bg-gray-100 cursor-not-allowed text-sm" />
                    <div v-if="errorMessages.nombre" class="text-[#ff0000] text-xs mt-1">
                        {{ errorMessages.nombre }}
                    </div>
                </div>
            </div>
            <label class="block font-bold text-[#0018b2] mb-2 text-xs tracking-wider">
                CREDENCIALES DEL USUARIO:
            </label>
            <!-- Tercera fila -->
            <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mb-4">
                <div>
                    <label for="nickname" class="block text-sm font-medium text-black">ID Usuario *</label>
                    <input type="text" v-model="nickname" id="nickname" @input="handleInputNickname"
                        placeholder="Ingresar Usuario"
                        class="border border-gray-300 rounded-lg px-3 py-2 mb-2 w-full text-sm" />
                    <div class="block text-sm font-medium text-black text-end">
                        {{ nickname.length }}/15
                    </div>
                    <div v-if="errorMessages.nickname" class="text-[#ff0000] text-xs mt-1">{{
                        errorMessages.nickname }}
                    </div>
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
                        <input :type="showPasswordConfirmation ? 'text' : 'password'" v-model="passwordConfirmation"
                            id="confirmar_contraseña" @input="errorMessages.passwordConfirmation = ''"
                            placeholder="Confirmar Contraseña"
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
                    Guardar Usuario
                </button>
                <button @click="volver"
                    class="px-6 py-3 bg-[#212529] font-semibold text-white rounded-lg shadow-md hover:bg-[#313539] uppercase text-xs">
                    Volver
                </button>
            </div>
        </form>

        <!-- Mensaje de alerta - CORRECTO -->
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
    name: "CrearUsuario",
    data() {
        return {
            roles: [],
            alertMessage: "",
            alertMessageError: "",
            usuario: {
                estado: "activo"
            },
            rol: "",
            nickname: "",
            nombre: "",
            codigo: "",
            password: "",
            passwordConfirmation: "",
            errorMessages: {
                rol: "",
                nickname: "",
                nombre: "",
                codigo: "",
                password: "",
                passwordConfirmation: ""
            },
            showPassword: false,
            showPasswordConfirmation: false,
        };
    },
    methods: {
        handleInputRNombre() {
            this.nombre = this.nombre.toUpperCase();
            this.errorMessages.nombre = '';
        },
        handleInputNickname() {
            this.nickname = this.nickname.toUpperCase().slice(0, 15);
            this.errorMessages.nickname = '';
        },
        handleInputCodigo() {
            this.codigo = this.codigo.replace(/[^0-9]/g, '').toUpperCase().slice(0, 11);
            this.errorMessages.codigo = '';
        },
        volver() {
            this.$router.push({ name: 'Usuario' });
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
        validateConsultaForm() {
            let isValid = true;
            this.errorMessages = {};

            if (!this.codigo) {
                this.errorMessages.codigo = '* El campo DNI/RUC es obligatorio.';
                isValid = false;
            } else if (this.codigo.length !== 8 && this.codigo.length !== 11) {
                this.errorMessages.codigo = '* El DNI/RUC debe tener 8 o 11 dígitos.';
                isValid = false;
            }

            return isValid;
        },
        async consultarUsuario() {
            if (!this.validateConsultaForm()) return;

            const token = localStorage.getItem("token");
            const usuarioBase64 = localStorage.getItem("usuario");

            let consulta = "";

            if (this.codigo.length === 8) {
                consulta = `/Sunat/consulta-dni?dni=${this.codigo}`;
            } else if (this.codigo.length === 11) {
                consulta = `/Sunat/consulta-ruc?ruc=${this.codigo}`;
            }

            try {
                const response = await api.get(consulta, {
                    headers: {
                        'Content-Type': 'application/json',
                        hToken: token,
                        hCodigo: usuarioBase64,
                    },
                });

                if (response.status === 200 && response.data) {
                    if (this.codigo.length === 11) {
                        this.nombre = response.data.nombre || "";
                    } else if (this.codigo.length === 8) {
                        this.nombre = `${response.data.vNombres || ""} ${response.data.vApePaterno || ""} ${response.data.vApeMaterno || ""}`.trim();
                    }

                    this.mostrarNotificacion('Usuario consultado correctamente.', () => {
                    });
                } else {
                    this.mostrarNotificacionError('Error al consultar el usuario.', () => {
                        this.nombre = "";
                    });
                }

            } catch (error) {
                this.mostrarNotificacionError('Error al consultar el usuario. Intenta de nuevo.', () => {
                    this.nombre = "";
                });
            }
        },
        validateForm() {
            let isValid = true;
            this.errorMessages = {};

            if (!this.rol) {
                this.errorMessages.rol = '* Seleccionar Rol.';
                isValid = false;
            }

            if (!this.codigo) {
                this.errorMessages.codigo = '* El campo DNI/RUC es obligatorio.';
                isValid = false;
            } else if (this.codigo.length !== 8 && this.codigo.length !== 11) {
                this.errorMessages.codigo = '* El DNI/RUC debe tener 8 o 11 dígitos.';
                isValid = false;
            }

            if (!this.nickname) {
                this.errorMessages.nickname = '* El campo ID Usuario es obligatorio';
                isValid = false;
            }

            if (!this.password) {
                this.errorMessages.password = '* El campo Contraseña es obligatorio';
                isValid = false;
            } else if (this.password.length < 8) {
                this.errorMessages.password = '* El campo Contraseña debe contener al menos 8 caracteres.';
                isValid = false;
            }

            if (!this.passwordConfirmation) {
                this.errorMessages.passwordConfirmation = '* El campo Confirmar Contraseña es obligatorio';
                isValid = false;
            } else if (this.password !== this.passwordConfirmation) {
                this.errorMessages.passwordConfirmation = '* Las Contraseña son distintas';
                isValid = false;
            }

            return isValid;
        },
        async crearUsuarios() {
            if (!this.validateForm()) return;

            const token = localStorage.getItem("token");
            const usuarioBase64 = localStorage.getItem("usuario");
            const usuario = atob(usuarioBase64);

            try {
                const response = await api.post(`/Usuarios/insertar-usuario`, {
                    codigoUsuario: usuario,
                    codigoRegistrar: this.codigo,
                    nombre: this.nombre,
                    nickname: this.nickname,
                    clave: this.password,
                    fecha: new Date().toISOString().split('T')[0],
                    rol: String(this.rol),
                }, {
                    headers: {
                        'Content-Type': 'application/json',
                        hToken: token,
                        hCodigo: usuarioBase64,
                    },
                });

                if (response.status === 200) {
                    this.mostrarNotificacion('Usuario guardado correctamente.', () => {
                        this.volver();
                    });
                    this.limpiarFormulario();
                } else {
                    this.mostrarNotificacionError('Error al guardar el usuario.', () => { });
                }
            } catch (error) {
                let errorMessage = "Error desconocido";
                if (error.response && error.response.data) {
                    errorMessage = error.response.data;
                } else if (error.message) {
                    errorMessage = error.message;
                }

                this.mostrarNotificacionError(errorMessage, () => { });
            }
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
            this.nickname = ""
            this.codigo = ""
            this.nombre = ""
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
        this.obtenerRoles();
    },
};
</script>