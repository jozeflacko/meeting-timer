<template>
  <div class="overview aligner">
    <div class="aligner-item">
      <h1>Choose:</h1>
      <div id="nav">
        <router-link to="/standup">StandUp Manager (PC)</router-link> |
        <router-link to="/remoteControl">Remote Control (Smartphone)</router-link>
      </div>
    </div>
  </div>
</template>
<style lang="scss">
.aligner {
  display: flex;
  align-items: center;
  justify-content: center;
  height:100%;
  min-height:300px;
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
