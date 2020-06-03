<template>
  <div class="about">
    <h1>First Blood</h1>
    <p @click="$store.commit('add')">commit {{$store.state.counter}}</p>
    <p @click="$store.dispatch('add')">dispatch {{$store.state.counter}}</p>
    <p>getter： {{$store.getters.doubleCounter}}</p>
    <router-view></router-view>
  </div>
</template>

<script>
export default {
}
</script>
