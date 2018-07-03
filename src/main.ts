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

personService.add('Igor',     imageService.getImage(0));
personService.add('Fede',     imageService.getImage(1));
personService.add('Matheus',  imageService.getImage(2));
personService.add('Fritz',    imageService.getImage(3));
personService.add('Inge',     imageService.getImage(6));
personService.add('Stefan',   imageService.getImage(7));
personService.add('Ognjen',   imageService.getImage(8));
personService.add('AK',       imageService.getImage(9));
personService.add('Gabriel',  imageService.getImage(10));

FirebaseService.init();

