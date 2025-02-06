import { createRouter, createWebHashHistory } from 'vue-router'
import UserLogin from "../views/UserLogin.vue";
import UserDashboard from "../views/Dashboard.vue";
import Usuario from "../views/Usuario.vue";
import Reportes from "../views/Reportes.vue";
import EditarUsuario from "../views/EditarUsuario.vue";
import CrearUsuario from "../views/CrearUsuario.vue";
import PerfilUsuario from "../views/PerfilUsuario.vue";
import NavBarComponent  from "../views/NavBar.vue";

const routes = [
  {
    path: "/login",
    name: "Login",
    component: UserLogin,
  },
  {
    path: "/",
    name: "Navbar",
    component: NavBarComponent ,
    children: [
      {
        path: "dashboard",
        name: "Dashboard",
        component: UserDashboard,
      },
      {
        path: "usuario",
        name: "Usuario",
        component: Usuario,
      },
      {
        path: "reportes",
        name: "Reportes",
        component: Reportes,
      },
      {
        path: 'editar-usuario',
        name: 'EditarUsuario',
        component: EditarUsuario,
      },
      {
        path: 'crear-usuario',
        name: 'CrearUsuario',
        component: CrearUsuario,
      },
      {
        path: 'perfil-usuario',
        name: 'PerfilUsuario',
        component: PerfilUsuario,
      },
    ],
  },

];

const router = createRouter({
  history: createWebHashHistory(),
  routes,
});

export default router;