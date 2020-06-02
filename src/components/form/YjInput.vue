<!--维护数据-->
<template>
  <div>
    <input :type="type" :value="value" @input="onInput"/>
  </div>
</template>

<script>
export default {
  props: {
    type: {
      type: String,
      default: "text"
    },
    value: {
      type: String,
      default: ""
    }
  },methods: {
    onInput(e) {
       //数据变化后，需要触发事件，并传值
       this.$emit('input',e.target.value);
       //数据变化后，执行校验

    }
  },
};
</script>

<style lang="scss" scoped>
</style>