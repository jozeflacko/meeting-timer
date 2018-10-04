import Vue from 'vue';
import Vuex from 'vuex';
import Person from './interfaces/Person';
import Status from './interfaces/Status';
import PersonService from './services/PersonService';

Vue.use(Vuex);

export const CHANGE_PERSONS = 'changepersons';
export const CHANGE_TALKING_PERSON = 'changetalkingperson';
export const CHANGE_DURATION = 'changeduration';
export const CHANGE_TIME_LIMIT = 'changetimelimit';
export const CHANGE_STORE = 'changestore';

const talkingPerson: Person = {
  name: '',
  image: '',
  talking: false,
  currentTimeInSeconds : '',
  favoriteColor: '',
};
const persons: Person[] = []; // just for initial state

export default new Vuex.Store({
  state: {
    talkingPerson,
    persons,
    duration: 0,
    timeLimit: '00:02:00',
  },
  mutations: {
    [CHANGE_PERSONS](state, persons: Person[]) {
      state.persons = persons;
    },
    [CHANGE_TALKING_PERSON](state, person: Person) {
      state.talkingPerson = person;
    },
    [CHANGE_DURATION](state, duration: number) {
      state.duration = duration;
    },
    [CHANGE_TIME_LIMIT](state, timeLimit: string) {
      state.timeLimit = timeLimit;
    },
    [CHANGE_STORE](state, store: Status) {
      state.persons = store.peopleArray;
      state.talkingPerson = store.talkingPerson;
      state.timeLimit = store.timeLimit;
      state.duration = store.duration;
    },
  },
  actions: {

  },
});
