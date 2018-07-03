import Vue from 'vue';
import Router from 'vue-router';
import StandUp from './views/StandUp.vue';
import Overview from './views/Overview.vue';
import RemoteControl from './views/RemoteControl.vue';

Vue.use(Router);

export default new Router({
  routes: [
    {
      path: '/',
      name: 'overview',
      component: Overview,
    },
    {
      path: '/standup',
      name: 'standup',
      component: StandUp,
    },
    {
      path: '/remoteControl',
      name: 'remoteControl',
      component: RemoteControl,
    },
  ],
});
