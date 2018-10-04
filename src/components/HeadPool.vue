<template>
    <div class="container">      
      <!--v-bind:style="{ background: person && person.favoriteColor }"-->   
        <img 
            class="image"
            v-if="person.name !== ''"
            v-bind:src="person.image" 
        />
        <div 
            class="image-empty-placeholder"
            v-if="person.name === ''"
        />
        <div class="info">  
          <h3>Today: {{getToday()}}</h3>       
          <div class="general-info">
            <div class="time-limit">
              <label>Time Limit for each of  <strong>{{numberOfParticipants}} participants</strong> is: </label>
              <!--
              <input 
                v-model="timeLimit"
                class="time-per-person"
              />
              -->
                <vue-timepicker
                v-model="timeLimitPicker"      
                format="mm:ss"
                :second-interval="30"
              ></vue-timepicker>
            </div>

            <div class="duration-container" >         
              <span            
                class="duration"
                title="Click to pause main Stopwatch"
                v-on:click="pauseMainStopwatch()"
              >
                <span v-if="durationInHHmmss" class="duration-timer">Total Speaking Time is <strong>{{durationInHHmmss}}</strong></span>
                <span v-if="person && person.name === '' && mainStopwatch.isRunning() === false && mainStopwatch.getTime() > 0" class="paused">Paused</span>
              </span>
            </div>
          </div>
          <div v-if="person.name !== ''" class="name">
              <strong>{{person.name}}</strong>
              <span v-if="person.name !== ''" class="current-person-time">
                <label> speaks </label>
                <span class="time">
                    <strong>{{currentTimeInHHmmss}}</strong>
                    <span class="overtime">{{overtimeTimeInHHmmss}}</span>
                </span>   
                <span>{{averagePersonTimeInHHmmss}}</span>                 
             </span>              
          </div>
        </div>
    </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import Stopwatch, { StopwatchCallback } from '../factories/Stopwatch';
import TimeUtils from '../utils/TimeUtils';
import Person from '../interfaces/Person';
import PersonService from '../services/PersonService';
import { CHANGE_TIME_LIMIT } from '../store';
import VueTimepicker from 'vue2-timepicker';


@Component({
  components: {
    VueTimepicker,
  },
})
export default class HeadPool extends Vue {
  @Prop() private person!: Person;
  @Prop() private timeLimitInSeconds!: number;
  @Prop() private mainStopwatch!: Stopwatch;
  @Prop() private setTalkingPerson!: Function;

  private pauseMainStopwatch(): void {
    if (this.mainStopwatch.isRunning() === true) {
        this.mainStopwatch.stop();
        this.setTalkingPerson(PersonService.createPerson());
    }
  }

  private getToday(): string {
    const currentdate = new Date(); 
    return currentdate.getDate() + '/'
            + (currentdate.getMonth()+1)  + '/' 
            + currentdate.getFullYear();
  }

  get currentTimeInHHmmss(): string {
      const time = TimeUtils.getCurrentTimeInHHmmss(Number(this.person.currentTimeInSeconds), this.timeLimitInSeconds, true);
      return time;
  }

  get overtimeTimeInHHmmss(): string {    
      return TimeUtils.getOvertimeInHHmmss(Number(this.person.currentTimeInSeconds), this.timeLimitInSeconds, true);
  }

  get timeLimitPicker(): any {
    return TimeUtils.fromNonNaturalHHmmssToTimeObject(this.$store.state.timeLimit);    
  }
  set timeLimitPicker(newTimeLimit: any) {
    //console.log(newValue);
    if(newTimeLimit && newTimeLimit.mm)
      this.$store.commit(CHANGE_TIME_LIMIT, '00:'+newTimeLimit.mm + ':' + newTimeLimit.ss);
  }
  get timeLimit(): string {
    return this.$store.state.timeLimit;
  }
  set timeLimit(newTimeLimit: string) {
    this.$store.commit(CHANGE_TIME_LIMIT, newTimeLimit);
  }
  get duration(): number {
    return this.$store.state.duration;
  }

  get durationInHHmmss() {
    const duration = TimeUtils.from_Seconds_to_HHmmss(this.duration, true);    
    return duration ? `${duration}` : '';
  } 
  get numberOfParticipants() {
    return `${this.$store.state.persons.length}`;
  }
  get averagePersonTimeInHHmmss(): string {
    const participants = this.$store.state.persons;
    
    let sumTime = 0;
    let sumNumberOfParticipants = 0;
    for (let p of participants) {      
      const time = Number(p.currentTimeInSeconds);
      if (time > 0) {
        sumTime += time;
        sumNumberOfParticipants++;
      }      
    }
    const averageTime = sumTime > 0 && sumNumberOfParticipants > 1 ? sumTime/sumNumberOfParticipants : 0; 
    return averageTime > 0 ? ` (Ø ${TimeUtils.from_Seconds_to_HHmmss(averageTime, true)})` : '';
  }
}
</script>

<style scoped lang="scss">
  .container {
     padding:0px;
     position:relative;
     height:inherit;
  }
  .image {
    display:inline-block;
    width:80px;
    height:100%;
    background:#DDD;
    position:absolute;
    top:0px;
    left:0px;
  }
  .image-empty-placeholder {
    display:inline-block;
    width:80px;
    height:inherit;
    background:#ffffff4a;
    position:absolute;
    top:0px;
    left:0px;
  }
  .info {
    display:inline-block;
    padding:0px 2px;
    margin-left:80px;
    height:inherit;
  }  
  .overtime {
    color:red;
  }
  .overtime:not(:empty) {
    color:red;
  } 
  .overtime:not(:empty) {
    color:red;
    animation: blinker 2s linear infinite;
  }   
  .paused {
    color:orange;
      animation: blinker 2s linear infinite;
  } 
  .time-per-person {
    width:70px;
    border-radius:0px;
    height:auto;
    border:none;
    padding:0px;
    background:white;
    outline:1px solid white;
    line-height:inherit;
    font-size:inherit;
  } 

  @keyframes blinker {
    50% {
      opacity: 0;
    }
  }
</style>
