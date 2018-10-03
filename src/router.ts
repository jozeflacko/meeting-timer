import Vue from 'vue';
import Router from 'vue-router';
import StandUp from './views/StandUp.vue';

Vue.use(Router);

export default new Router({
  routes: [
    {
      path: '/',
      name: 'standup',
      component: StandUp,
    }
  ],
});
