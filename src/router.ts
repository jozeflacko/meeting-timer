import Vue from 'vue';
import Router from 'vue-router';
import StandUp from './views/StandUp.vue';
import Overview from './views/Overview.vue';

Vue.use(Router);

export default new Router({
  routes: [
    {
      path: '/',
      name: 'standup',
      component: StandUp,
    },
    {
      path: '/overview',
      name: 'overview',
      component: Overview,
    },
  ],
});
