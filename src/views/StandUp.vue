<template>
  <div class="container">
    <div class="overview-panel">
      <HeadPool 
        :person=talkingPerson 
        :timeLimitInSeconds=timeLimitInSeconds 
        :mainStopwatch=mainStopwatch
        :setTalkingPerson=setTalkingPerson
      />
    </div>    
    <div class="pools">
      <Pool v-for="p in personArray" 
        :key=p.name 
        :person=p
        :timeLimitInSeconds=timeLimitInSeconds       
        :talkingPerson=talkingPerson 
        :setTalkingPerson=setTalkingPerson
        :removePerson=removePerson
        :onlySetter=false
        :sync=sync
      />
    </div>
    <div class="add-person-container">
      <img :src="newPersonImage" />
      <input v-model="newPersonName" title="Add Person"/>
      <button v-on:click="()=> {addPerson()}">+</button>
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
import Status from '../interfaces/Status';
import { CHANGE_PERSONS, CHANGE_TALKING_PERSON, CHANGE_DURATION, CHANGE_TIME_LIMIT } from '../store';

@Component({
  components: {
    HeadPool,
    Pool,
  },
})
export default class StandUp extends Vue {

  private personService = new PersonService();
  private imageService = new ImageService();

  private newPersonName: string|null = null;
  private newPersonImage: string = '';

  private avatarUrl = 'img/avatars/1.png';
  private imageIndex = 0;

  private mainStopwatch = new Stopwatch();

  private created() {
      this.newPersonImage = this.imageService.getNextImage();
  }

  private setTalkingPerson(person: Person): void {    
    this.$store.commit(CHANGE_TALKING_PERSON, person);    
    this.startTalkingTimerWhenPerson(person);
  }
  private setDuration(time: number): void {
    this.$store.commit(CHANGE_DURATION, time);
  }
  private startTalkingTimerWhenPerson(person): void {
    if (this.talkingPerson.name !== '') {
      if (this.mainStopwatch.isRunning() === false) {
        this.mainStopwatch.start((time: number) => {
          this.setDuration(time);     
        });
      }
    } 
  }
  private removePerson(person: Person): void {
    this.personService.remove(person);
    this.setTalkingPerson(PersonService.createPerson());
  }

  private sync(): void {
   
   const state:Status = {
      talkingPerson:  this.$store.state.talkingPerson,
      peopleArray: this.$store.state.persons,
      duration: this.$store.state.duration,
      timeLimit: this.$store.state.timeLimit,
    };    
    FirebaseService.sendInformation(state);
  }

  private resetApp(): void { 
    this.personService.createDefaultPeople (); 
    const state:Status = {
      talkingPerson:  this.$store.state.talkingPerson,
      peopleArray: this.$store.state.persons,
      duration: this.$store.state.duration,
      timeLimit: this.$store.state.timeLimit,
    };    
    FirebaseService.sendInformation(state);
  }

  private addPerson() {
    if (this.newPersonName !== null ) {
      if (this.personService.findByName(this.newPersonName) === null) {
        this.personService.add(this.newPersonName, this.newPersonImage );
      } else {
        alert(`${this.newPersonName} already exists! Choose different name.`);
      }
      this.newPersonName = null;
      this.newPersonImage = this.imageService.getNextImage();
    }
  }

  private finish() {
    alert();
  }
  get talkingPerson(): Person {
    return this.$store.state.talkingPerson;
  }  
  get timeLimitInSeconds() {
    return TimeUtils.from_HHmmss_to_Seconds(this.$store.state.timeLimit, true);
  }
  get personArray(): Person[] {
    return this.$store.state.persons;
  }
}
</script>

<style scoped lang="scss">
  .container {
    padding:2px;
    overflow:hidden;
    
  }
  .overview-panel {
    margin-bottom:2px; 
    position:fixed;
    top:0px;
    left:0px;
    width:100%;
    height:80px;
    overflow:hidden;
    z-index:1000;
    background:#cde2ff;
    box-shadow:2px 2px 7px #d1d1d1;
  } 
  .pools {
    margin-top:80px;
  } 
  
  .add-person-container {
    height:40px;
    font-size:30px;
    white-space:nowrap;
    position:relative;
    background:#DDD;
    outline: 1px solid #777;
  }
  .add-person-container img {
    position:absolute;
    width:40px;
    height:100%;
    top:0px;
    left:0px;
  }
  .add-person-container input {
    height: 100%;
    font-size: 35px;
    width: 100%;
    font-weight: bold;
    color: #2d3e50;
    padding-left: 44px;
    padding-top: 7px;
    border: none;
    background: white;
    outline: none;
    text-align:left;
    padding-right:5px;
  }
  .add-person-container button {
    height:100%;
    width:40px;
    position:absolute;
    right:0px;
    top:0px;
    cursor:pointer;
    border:none;
    background:#DDD;
  }

</style>
