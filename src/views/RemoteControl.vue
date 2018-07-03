<template>
  <div class="container">    
    <div class="pools">
      <Pool v-for="p in personArray" 
        :key=p.name 
        :person=p    
        :talkingPerson=talkingPerson 
        :setTalkingPerson=setTalkingPerson
        :onlySetter=true
      />
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import HelloWorld from '@/components/HelloWorld.vue'; // @ is an alias to /src
import HeadPool from '@/components/HeadPool.vue';
import Pool from '@/components/Pool.vue';
import * as Collections from 'typescript-collections';
import Stopwatch from '../factories/Stopwatch';
import TimeUtils from '../utils/TimeUtils';
import PersonService from '../services/PersonService';
import ImageService from '../services/ImageService';
import Person from '../interfaces/Person';
import FirebaseService from '../services/FirebaseService';
import Status from '../interfaces/Status';
import { CHANGE_PERSONS, CHANGE_TALKING_PERSON, CHANGE_DURATION, CHANGE_TIME_LIMIT } from '../store';

@Component({
  components: {
    Pool,
  },
})
export default class StandUp extends Vue {

  private personService = new PersonService();
  private imageService = new ImageService();


  private clickFirebase(): void {
   
   const state:Status = {
      talkingPerson:  this.$store.state.talkingPerson,
      peopleArray: this.$store.state.persons,
      duration: 0,
      timeLimit: '',
    };    
    FirebaseService.sendInformation(state);
    console.log(this.$store.state.status);
  }

  private setTalkingPerson(person: Person): void {    
    this.$store.commit(CHANGE_TALKING_PERSON, person);   
    this.clickFirebase(); 
  }

  private setDuration(time: number): void {
    this.$store.commit(CHANGE_DURATION, time);
  }
  get personArray(): Person[] {
    return this.$store.state.persons;
  }
  get talkingPerson(): Person {
    return this.$store.state.talkingPerson;
  }
}
</script>

<style scoped lang="scss">


</style>
