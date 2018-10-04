<template>
  <div id="app">
    <router-view/>
  </div>
</template>
<style lang="scss">
* {
  margin:0px;
  padding:0px;
  box-sizing: border-box;
  vertical-align:top;
}
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
  text-align:left;
}




 .time-picker, 
 .time-picker .display-time, 
 .time-picker .select-list, 
 .time-picker .dropdown {
    width:80px !important;
  }
 .time-picker .select-list  .hours {
    display:none !important; /* vue time picker has by default hours displayed. I do want to see it! */
 }
 .time-picker .display-time {
    height: 20px !important;
 }
 .time-picker .clear-btn {
   top:4px !important;
 }
 .time-picker .dropdown {
   top: calc(20px + 1px) !important;
 }
</style>