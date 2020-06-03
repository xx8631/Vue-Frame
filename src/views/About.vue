<template>
  <div class="about">
    <h1>This is an about page</h1>
    <p @click="$store.commit('add')">commit {{$store.state.counter}}</p>
    <p @click="$store.dispatch('add')">dispatch {{$store.state.counter}}</p>
    <p>getter {{DoubleCounter}}</p>
  </div>
</template>

<script>
export default {
   computed: {
     DoubleCounter() {
       return  this.$store.getters.doubleCounter;
     }
   },
}
</script>
