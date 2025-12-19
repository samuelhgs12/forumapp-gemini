import { createRouter, createWebHistory } from 'vue-router';
import QuestionsListView from '../views/QuestionsListView.vue';
import QuestionDetailView from '../views/QuestionDetailView.vue';

const routes = [
  {
    path: '/',
    name: 'QuestionsList',
    component: QuestionsListView,
  },
  {
    path: '/question/:id',
    name: 'QuestionDetail',
    component: QuestionDetailView,
    props: true,
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
