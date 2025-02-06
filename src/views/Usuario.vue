<template>
    <div v-if="usuarios.length" class="bg-white dark:bg-white p-4 rounded-lg shadow-md w-full overflow-x-auto">
        <div class="bg-[#212529] text-white p-3 rounded-lg flex justify-between items-center mb-4">
            <h1 class="text-xs font-bold uppercase tracking-widest">Maestra de Usuario</h1>
            <button @click="crearUsuario()"
                class="bg-[#ffc107] hover:bg-[#e0a800] text-black font-semibold px-4 py-2 rounded-lg shadow-md transition-all uppercase text-xs">
                Nuevo Usuario
            </button>
        </div>

        <div class="mb-4">
            <input type="text" placeholder="Buscar usuario" v-model="fUsuario" @input="filtrarUsuarios"
                class="border border-gray-300 rounded-lg px-3 py-2 mb-2 w-full text-sm" />

            <div class="flex space-x-2">
                <select v-model="fRol" @change="filtrarUsuarios"
                    class="border border-gray-300 rounded-lg px-3 py-2 w-1/2 text-sm">
                    <option value="" selected>Seleccionar Rol</option>
                    <option v-for="rol in roles" :key="rol.id" :value="rol.descripcion" class="text-sm">
                        {{ rol.descripcion }}
                    </option>
                </select>

                <select v-model="fEstado" @change="filtrarUsuarios"
                    class="border border-gray-300 rounded-lg px-3 py-2 w-1/2 text-sm">
                    <option value="">Seleccione Estado</option>
                    <option value="activo" class="text-sm">ACTIVO</option>
                        <option value="inactivo" class="text-sm">INACTIVO</option>
                </select>
            </div>
        </div>

        <!-- Table -->
        <div class="overflow-x-auto w-full">
            <table class="min-w-full border border-gray-[#212529] dark:border-gray-[#212529] rounded-lg">
                <thead class=" text-white bg-[#212529]">
                    <tr class="text-left uppercase text-xs">
                        <th class="px-2 py-2">DNI/RUC</th>
                        <th class="px-2 py-2">RAZ. SOCIAL/NOMBRE</th>
                        <th class="px-2 py-2 hidden sm:table-cell">ROL</th>
                        <th class="px-2 py-2 hidden sm:table-cell">ESTADO</th>
                        <th class="px-2 py-2"></th>
                    </tr>
                </thead>
                <tbody>
                    <template v-for="usuario in usuariosFiltrados" :key="usuario.id">
                        <tr class="dark:border-gray-300 uppercase text-xs font-medium">
                            <td class="px-2 py-2 border border-gray-300">
                                <div class="flex items-center">
                                    <button @click="toggleDetalles(usuario.id)"
                                    class="bg-[#ffc107] hover:bg-b[#e0a800] text-white font-semibold px-1 py-1 rounded-lg shadow-md transition-all block sm:hidden mr-2">
                                    <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" fill="none" viewBox="0 0 24 24"
                                        stroke="currentColor">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                            d="M12 4v16m8-8H4" />
                                    </svg>
                                </button>
                                {{ usuario.codigo }}    
                                </div>
                                
                            </td>
                            <td class="px-2 py-2 border border-gray-300">{{ usuario.nombre }}</td>
                            <td class="px-2 py-2 border border-gray-300 hidden sm:table-cell">{{ usuario.rol }}</td>
                            <td class="px-2 py-2 border border-gray-300 hidden sm:table-cell">
                                <div :class="{ 'bg-[#008000] text-white text-center': usuario.estado === 'activo', 'text-white text-center bg-[#fb2c36]': usuario.estado === 'inactivo' }"
                                    class=" p-2 rounded text-xs">
                                    {{ usuario.estado.toUpperCase() }}
                                </div>
                            </td>
                            <td class="px-2 py-2 border border-gray-300">
                                <button @click="editarUsuario(usuario)"
                                    class="bg-[#212529] hover:bg-[#313539] text-white font-semibold px-4 py-2 rounded-lg shadow-md transition-all uppercase text-xs  ">
                                    EDITAR
                                </button>
                            </td>
                        </tr>
                        <tr v-if="detallesVisible === usuario.id"
                            class="border border-gray-300 uppercase text-xs font-medium sm:hidden">
                            <td colspan="4" class="border border-gray-300 px-4 py-2">
                                <div>Rol: {{ usuario.rol }} </div>
                                <div>Estado: {{ usuario.estado.toUpperCase() }} </div>
                            </td>
                        </tr>
                    </template>
                </tbody>
            </table>
        </div>

        <!-- Paginación -->
        <div class="flex justify-end items-center mt-4 text-white text-xs gap-1">
            <button @click="previousPage" :disabled="currentPage === 1"
                class="px-3 py-2 bg-gray-500 rounded disabled:opacity-50">
                Anterior
            </button>
            <button v-for="page in paginatedPages" :key="page" @click="setPage(page)"
                :class="{ 'bg-[#0d6efd]': currentPage === page, 'bg-gray-500': currentPage !== page }"
                class="px-3 py-2 rounded">
                {{ page }}
            </button>
            <button @click="nextPage" :disabled="currentPage === totalPages"
                class="px-3 py-2 bg-gray-500 rounded disabled:opacity-50">
                Siguiente
            </button>
        </div>
    </div>
    <p v-else class="text-gray-500 mt-4">No hay usuarios disponibles.</p>
</template>

<script>
import api from "../services/api";

export default {
    name: "UsuarioPage",
    data() {
        return {
            detallesVisible: null,
            usuarios: [],
            roles: [],
            fUsuario: "",
            fRol: "",
            fEstado: "",
            currentPage: 1,
            pageSize: 5,
        };
    },
    computed: {
        usuariosFiltrados() {
            const filtered = this.usuarios.filter(usuario => {
                const matchesNombre = usuario.nombre.toLowerCase().includes(this.fUsuario.toLowerCase());
                const matchesCodigo = usuario.codigo.toLowerCase().includes(this.fUsuario.toLowerCase());
                const matchesUsuario = matchesNombre || matchesCodigo;
                const matchesRol = this.fRol ? usuario.rol === this.fRol : true;
                const matchesEstado = this.fEstado ? usuario.estado === this.fEstado : true;

                return matchesUsuario && matchesRol && matchesEstado;
            });

            const start = (this.currentPage - 1) * this.pageSize;
            return filtered.slice(start, start + this.pageSize);
        },
        paginatedPages() {
            const pages = [];
            const totalPages = this.totalPages;
            const maxVisible = 3;

            let start = Math.max(1, this.currentPage - Math.floor(maxVisible / 2));
            let end = Math.min(totalPages, start + maxVisible - 1);

            if (end - start < maxVisible - 1) {
                start = Math.max(1, end - maxVisible + 1);
            }

            for (let i = start; i <= end; i++) {
                pages.push(i);
            }

            return pages;
        },
        totalPages() {
            const filteredCount = this.usuarios.filter(usuario => {
                const matchesNombre = usuario.nombre.toLowerCase().includes(this.fUsuario.toLowerCase());
                const matchesCodigo = usuario.codigo.toLowerCase().includes(this.fUsuario.toLowerCase());
                const matchesUsuario = matchesNombre || matchesCodigo;
                const matchesRol = this.fRol ? usuario.rol === this.fRol : true;
                const matchesEstado = this.fEstado ? usuario.estado === this.fEstado : true;

                return matchesUsuario && matchesRol && matchesEstado;
            }).length;

            return Math.ceil(filteredCount / this.pageSize);
        },
    },
    methods: {
        toggleDetalles(id) {
            this.detallesVisible = this.detallesVisible === id ? null : id;
        },
        async obtenerUsuarios() {
            const token = localStorage.getItem("token");
            const usuarioBase64 = localStorage.getItem("usuario");

            const fUsuario = '-';
            const fRol = -1;
            const fEstado = '-';

            const url = `/Usuarios/listar-usuarios?fUsuario=${encodeURIComponent(fUsuario)}&fRol=${encodeURIComponent(fRol)}&fEstado=${encodeURIComponent(fEstado)}`;

            try {
                const response = await api.get(url, {
                    headers: {
                        'Content-Type': 'application/json',
                        hToken: token,
                        hCodigo: usuarioBase64,
                    },
                });

                if (response.status === 200) {
                    this.usuarios = response.data.lista || [];
                } else {
                    console.error('Error en la respuesta del servidor:', response);
                }

            } catch (error) {
                console.error("Error al obtener datos:", error);
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
        editarUsuario(usuario) {
            this.$router.push({ name: 'EditarUsuario', query: { usuarioId: usuario.codigo } });
        },
        crearUsuario() {
            this.$router.push({ name: 'CrearUsuario' });
        },
        filtrarUsuarios() {
            this.fUsuario = this.fUsuario.toUpperCase();
            this.currentPage = 1;
        },
        previousPage() {
            if (this.currentPage > 1) {
                this.currentPage--;
            }
        },
        nextPage() {
            if (this.currentPage < this.totalPages) {
                this.currentPage++;
            }
        },
        setPage(page) {
            this.currentPage = page;
        }
    },
    mounted() {
        this.obtenerUsuarios();
        this.obtenerRoles();
    },
};
</script>