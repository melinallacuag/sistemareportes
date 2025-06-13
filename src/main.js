import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import router from './router'
import api from "./services/api";
import PdfViewer from 'vue3-pdfjs';

const app = createApp(App);

app.config.globalProperties.$api = api;
app.use(PdfViewer);
app.use(router).mount("#app");
