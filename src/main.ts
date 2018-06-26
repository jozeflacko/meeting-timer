import Vue from 'vue';
import App from './App.vue';
import router from './router';
import store from './store';
import './registerServiceWorker';
import PersonService from './services/PersonService';
import ImageService from './services/ImageService';
import FirebaseService from './services/FirebaseService';

Vue.config.productionTip = false;

const vue = new Vue({
  router,
  store,
  render: (h) => h(App),
}).$mount('#app');

const personService = new PersonService();
const imageService = new ImageService();

personService.add('Igor',    imageService.getImage(0));
personService.add('Fede',    imageService.getImage(1));
personService.add('Matheus', imageService.getImage(2));
personService.add('Fritz',   imageService.getImage(3));
personService.add('Gabriel', imageService.getImage(4));

FirebaseService.init();

