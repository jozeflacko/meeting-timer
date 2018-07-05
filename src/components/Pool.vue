<template>
  <div class="pool" 
    v-on:click="toggle()"
    v-bind:class="{ active: person.talking, onlySetter: onlySetter===true }"
  >
    <img class="image" v-bind:src="person.image" />
    <div class="progress-container">      
      <span class="name">{{person.name}}</span>
      <span v-if="onlySetter === false" class="time">
        <span>{{currentTimeInHHmmss}}</span>
        <span class="overtime">{{overtimeTimeInHHmmss}}</span>
      </span>
      <span v-if="onlySetter === false"
        v-bind:style="{width: currentTimeInPercentage, backgroundColor: person.favoriteColor }"
        class="progress-bar"
      ></span>
    </div>
    <div 
        v-if="onlySetter === false"
        class="remove" 
        v-on:click="(event)=> {removePool(person, event) }"
    >&times;</div>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import Stopwatch, { StopwatchCallback } from '../factories/Stopwatch';
import TimeUtils from '../utils/TimeUtils';
import Person from '../interfaces/Person';
import PersonService from '../services/PersonService';

@Component
export default class Pool extends Vue {
  @Prop() private person!: Person;
  @Prop() private timeLimitInSeconds!: number;
  @Prop() private talkingPerson!: Person;
  @Prop() private setTalkingPerson!: Function;
  @Prop() private removePerson!: Function;
  @Prop() private onlySetter !: boolean; // in case of remote control

  private stopwatch = new Stopwatch();
  private personService = new PersonService();

  private toggle(): void {
    if (this.person.talking === false) {
      this.setTalkingPerson(this.person); 
      this.startTalking(); 
    } else {
      this.setTalkingPerson(PersonService.createPerson());
      this.stopTalking();
    }
  }

  private removePool(person: Person, event: Event) {
    this.setTalkingPerson(PersonService.createPerson()); // will create empty person
    this.stopTalking();
    this.removePerson(person);

    event.stopPropagation();
  }

  private updateCurrentTimeInSeconds(time: number): void {
    if (this.talkingPerson.name !== '' && this.talkingPerson.name === this.person.name) {
      this.personService.change(this.person, { ...this.person, currentTimeInSeconds: Number(time).toFixed(0) });
    } else {
      this.stopTalking();
    }
  }

  private startTalking() {
    if (this.stopwatch.isRunning() === false) {
      this.personService.change(this.person, { ...this.person, talking:  true });
      this.stopwatch.start((time: number) => {
        this.updateCurrentTimeInSeconds(time);
      });
    }
  }

  private stopTalking() {
    if (this.stopwatch.isRunning() === true) {      
      this.personService.change(this.person, { ...this.person, talking:  false });
      this.stopwatch.stop();
    }
  }

  private get currentTimeInHHmmss(): string {
    return TimeUtils.getCurrentTimeInHHmmss(Number(this.person.currentTimeInSeconds), this.timeLimitInSeconds, true);
  }

  private get overtimeTimeInHHmmss(): string {    
    return TimeUtils.getOvertimeInHHmmss(Number(this.person.currentTimeInSeconds), this.timeLimitInSeconds, true);
  }

  private get currentTimeInPercentage(): string {
    let timeLimit: number = 0;
    
    if (this.stopwatch.getTime() > 0) {
      timeLimit = this.stopwatch.getTime();
      timeLimit = timeLimit / this.timeLimitInSeconds;
      timeLimit = timeLimit * 100;
      return timeLimit.toFixed(0) + '%';
    } 
    return '0%';
  }
}
</script>

<style scoped lang="scss">
  .pool {
    margin-bottom:2px;
    cursor:pointer;
    position:relative;
    background:#f0f0f085;
    padding:0px;
    height:40px;
    overflow:hidden;
  }
  .pool.active.onlySetter {
    background:#DDD;
    outline:3px solid #777;
  }

  .pool:hover {
    background:#eeeeeeb5;
  }
  .pool .image {
    height:100%;
    width:40px;
    position:absolute;
    left:0px;
    top:0px;
  }
  .pool .progress-container {
    height:100%;
    position:relative;
    padding:0px;
    display:block;
    width:100%;
    margin-left:40px;
  }
  .pool .progress-container .name {
    display:block;
    font-weight:800;
    font-size:22px;
    padding-left:2px;
    overflow:hidden;
    position:absolute;
    top:1px;
    left:2px;
    z-index:20;
  }
  .pool .progress-container .time {
    display:block;
    font-weight:400;
    font-size:15px;
    padding-left:2px;
    position:absolute;
    bottom:1px;
    left:2px;
    z-index:20;
  }

  .pool .progress-container .overtime:not(:empty) {
    color:red;
  } 
  .pool.active .progress-container .overtime:not(:empty) {
    color:red;
    animation: blinker 2s linear infinite;
  }   

  @keyframes blinker {
    50% {
      opacity: 0;
    }
  }

  .pool .remove {
    position: absolute;
    right: 0px;
    top: 0px;
    width: 20px;
    padding: 0px 0px 0px 1px;
    cursor: pointer;
    text-align: center;
    height: 17px;
    font-size: 17px;
    line-height: 20px;
    color:#777;
    border-radius: 0px 0px 0px 6px;
    font-weight: bold;
    background: transparent;
  }
  .pool .remove:hover {
    color:red;
  }
  .pool .progress-container .progress-bar {
    position:absolute;
    top:0px;
    left:0px;
    height:100%;
    width:0%;
    background:#fa8f8f;
    transition:all .1s;
  }
  .pool.active .progress-container .progress-bar {
    background:green;
    -webkit-box-shadow: inset 0 -1px 0 rgba(0, 0, 0, 0.15);
    box-shadow: inset 0 0px 0 rgba(0, 0, 0, 0.15);
    transition: width 0.6s ease;
    background-image: -webkit-linear-gradient(45deg, rgba(255, 255, 255, 0.5) 25%, transparent 25%, transparent 50%, rgba(255, 255, 255, 0.5) 50%, rgba(255, 255, 255, 0.5) 75%, transparent 75%, transparent);
    background-image: linear-gradient(45deg, rgba(255, 255, 255, 0.5) 25%, transparent 25%, transparent 50%, rgba(255, 255, 255, 0.5) 50%, rgba(255, 255, 255, 0.5) 75%, transparent 75%, transparent);
    background-size: 40px 40px;
    -webkit-animation: progress-bar-stripes 2s linear infinite;
    animation: progress-bar-stripes 2s linear infinite;
  }
  @-webkit-keyframes progress-bar-stripes {
    from {
      background-position: 40px 0;
    }
    to {
      background-position: 0 0;
    }
  }

  @keyframes progress-bar-stripes {
    from {
      background-position: 40px 0;
    }
    to {
      background-position: 0 0;
    }
  }
</style>
