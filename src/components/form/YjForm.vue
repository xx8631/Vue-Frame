<!--指定数据，校验规则-->
<template>
  <div>
    <slot></slot>
  </div>
</template>

<script>
export default {
  //provide 为子组件提供数据，不限深度 子组件通过 inject 获取
  provide() {
    return {
      form: this //传递当前上下文
    };
  },
  props: {
    model: {
      type: Object,
      required: true
    },
    rules: Object
  },
  methods: {
    validate(cb) {
      //全局校验：
      //获取所有的formItem
      //获得[Promise,...]
      const tasks = this.$children
        .filter(item => item.prop) //过滤，有prop属性的
        .map(item => item.validate());
      //执行子组件的校验方法，如果大家的Promise全部都resolve，校验通过
      //如果其中有reject，catch()中可以处理错误提示信息
      Promise.all(tasks)
        .then(() => cb(true))
        .catch(() => cb(false));
    }
  }
};
</script>

<style lang="scss" scoped>
</style>