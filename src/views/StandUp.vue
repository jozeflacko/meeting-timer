<template>
  <div class="container">
    <div class="overview-panel">
      <div class="talking-general-settings-container">
        <div class="time-limit">
          <label>Time per Person</label>
          <input v-model="timeLimit" placeholder="0h 1m 30s" class="time-per-person"/>
        </div>

        <div class="duration-container" >
          <label>Duration</label>
          <span            
            class="duration"
            title="Click to pause main Stopwatch"
            v-on:click="pauseMainStopwatch()"
          >
            <span class="duration-timer">{{durationInHHmmss ? durationInHHmmss : '0h 0m 0s'}}</span>
            <span v-if="talkingPerson.name === '' && mainStopwatch.isRunning() === false && mainStopwatch.getTime() > 0" class="paused">Paused</span>
          </span>
        </div>
      </div>
      <HeadPool 
        :person=talkingPerson 
        :timeLimitInSeconds=timeLimitInSeconds 
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
      />
    </div>
    <div class="add-person-container">
      <img :src="newPersonImage" />
      <input v-model="newPersonName" title="Add Person"/>
      <button v-on:click="()=> {addPerson()}">+</button>
    </div>

    <div v-on:click="clickFirebase()">test firebase</div>
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
    HeadPool,
    Pool,
  },
})
export default class StandUp extends Vue {

  private personService = new PersonService();
  private imageService = new ImageService();

  private newPersonName: string|null = null;
  private newPersonImage: string = '';

  private mainStopwatch = new Stopwatch();
  private avatarUrl = 'img/avatars/1.png';
  private imageIndex = 0;

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
/*
  private setTimeLimit(timeLimit: string): void {
    this.$store.commit(CHANGE_TIME_LIMIT, timeLimit);
  }
*/
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

  private clickFirebase(): void {
   
   const state:Status = {
      talkingPerson:  this.$store.state.talkingPerson,
      peopleArray: this.$store.state.persons,
      duration: this.duration,
      timeLimit: this.timeLimit,
    };    
    FirebaseService.sendInformation(state);
    console.log(this.$store.state.status);
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

  private pauseMainStopwatch(): void {
    if (this.mainStopwatch.isRunning() === true) {
        this.mainStopwatch.stop();
        this.setTalkingPerson(PersonService.createPerson());
    }
  }

  get timeLimit(): string {
    return this.$store.state.timeLimit;
  }

  get timeLimitInSeconds() {
    return TimeUtils.from_HHmmss_to_Seconds(this.$store.state.timeLimit, true);
  }

  get personArray(): Person[] {
    return this.$store.state.persons;
  }

  get talkingPerson(): Person {
    return this.$store.state.talkingPerson;
  }

  get duration(): number {
    return this.$store.state.duration;
  }

  get durationInHHmmss() {
    return TimeUtils.from_Seconds_to_HHmmss(this.duration, true);
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
    position:relative;
  }
  .talking-general-settings-container {
    font-weight: 400;
    text-align: right;
    position: absolute;
    width: 100%;
    right: 6px;
    top: 8px;
  }
  .duration-container {
    font-weight:400;
    font-size:20px;
  }
  .duration-container label{
    font-weight:800;
    font-size:15px;
    display:inline-block;
    text-align:right;
    vertical-align:top;
    margin-left:5px;
  }
  .duration-container .duration {    
    cursor: pointer;
    display: inline-block;
    width: 100px;
    border: none;
    margin: 0px;
    vertical-align: top;
    text-align: right;
    padding-right: 5px;
    background: #fefefe7d;
    margin-left:5px;
    color: #777;
    cursor: default;
  }
  .duration .paused {
    color:orange;
      animation: blinker 2s linear infinite;
  }   

  @keyframes blinker {
    50% {
      opacity: 0;
    }
  }

  .time-limit label {
    font-size: 17px;
    line-height: 17px;
    display: inline-block;
    font-weight: bold;
    vertical-align:top;
    margin-left:5px;
  }
  .time-limit input {
    width: 100px;
    display: inline-block;
    font-weight: 400;
    font-size: 20px;
    padding-right: 5px;
    margin-left: 5px;
    background:#fefefe7d;
    cursor: pointer;
    text-align:right;
    border:none;
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
    text-align:right;
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
