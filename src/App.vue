<template>
  <div id="app">
    <div id="nav">
      <router-link to="/">StandUp</router-link> |
      <router-link to="/overview">Overview</router-link>
    </div>
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
#nav {
  text-align: right;
  padding: 2px 5px 2px 2px;
  a {
    font-weight: bold;
    color: #2c3e50;
    &.router-link-exact-active {
      color: #42b983;
    }
  }
}



</style>
