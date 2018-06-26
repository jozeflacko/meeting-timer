<template>
    <div class="talking-person-information-container" v-bind:style="{ background: person && person.favoriteColor }">      
        <img 
            class="image"
            v-if="person.name !== ''"
            v-bind:src="person.image" 
        />
        <div class="info">
            <div v-if="person.name !== ''" class="name">
                {{person.name}}
            </div>
            <div v-if="person.name !== ''" class="current-person-time">
                <span class="time">
                    <span>{{currentTimeInHHmmss}}</span>
                    <span class="overtime">{{overtimeTimeInHHmmss}}</span>
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

@Component
export default class HeadPool extends Vue {
  @Prop() private person!: Person;
  @Prop() private timeLimitInSeconds!: number;

    private get currentTimeInHHmmss(): string {
        return TimeUtils.getCurrentTimeInHHmmss(Number(this.person.currentTimeInSeconds), this.timeLimitInSeconds, true);
    }

    private get overtimeTimeInHHmmss(): string {    
        return TimeUtils.getOvertimeInHHmmss(Number(this.person.currentTimeInSeconds), this.timeLimitInSeconds, true);
    }
}
</script>

<style scoped lang="scss">
  .talking-person-information-container {
    height:60px;
    background:#EEE; 
  }
  .talking-person-information-container .image {
    display:inline-block;
    width:60px;
    height:100%;
    background:#DDD;
  }
  .talking-person-information-container .info {
    display:inline-block;
    padding:2px;
  }
  .talking-person-information-container .info .name {
    font-weight:800;
    font-size:32px;   
  }
  .talking-person-information-container .info .current-person-time {
    font-weight:400;
    font-size:24px;
  }
  .talking-person-information-container .info .overtime {
      color:red;
  }
  .talking-person-information-container .info .overtime:not(:empty) {
    color:red;
  } 
  .talking-person-information-container .info  .overtime:not(:empty) {
    color:red;
    animation: blinker 2s linear infinite;
  }   

  @keyframes blinker {
    50% {
      opacity: 0;
    }
  }
</style>
