import { createApp } from "vue";
import { createRouter, createWebHistory } from "vue-router";
import App from "./App.vue";
import QuestionListPage from "./pages/QuestionListPage.vue";
import QuestionDetailPage from "./pages/QuestionDetailPage.vue";
import "./styles.css";

const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: "/", component: QuestionListPage },
    { path: "/questions/:id", component: QuestionDetailPage, props: true },
  ],
});

createApp(App).use(router).mount("#app");
