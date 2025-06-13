import { createMemoryHistory, createRouter, createWebHistory } from 'vue-router'
import UserLogin from "../views/UserLogin.vue";
import UserDashboard from "../views/Dashboard.vue";
import Usuario from "../views/Usuario.vue";
import Reportes from "../views/Reportes.vue";
import EditarUsuario from "../views/EditarUsuario.vue";
import CrearUsuario from "../views/CrearUsuario.vue";
import PerfilUsuario from "../views/PerfilUsuario.vue";
import NavBarComponent  from "../layouts/NavBar.vue";
import ReportesTurno from "../views/ReportesTurno.vue";

export const  router = createRouter({
  history: createMemoryHistory(import.meta.env.BASE_URL),
   routes : [
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
          path: "/",
          name: "Dashboard",
          component: UserDashboard,
        },
        {
          path: "/usuario",
          name: "Usuario",
          component: Usuario,
        },
        {
          path: "/reportes",
          name: "Reportes",
          component: Reportes,
        },
        {
          path: "/reportesTurno",
          name: "ReportesTurno",
          component: ReportesTurno,
        },
        {
          path: '/editar-usuario',
          name: 'EditarUsuario',
          component: EditarUsuario,
        },
        {
          path: '/crear-usuario',
          name: 'CrearUsuario',
          component: CrearUsuario,
        },
        {
          path: '/perfil-usuario',
          name: 'PerfilUsuario',
          component: PerfilUsuario,
        },
      ],
    },
  
  ],
});

export default router;