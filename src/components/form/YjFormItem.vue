<!--label标签添加，执行校验，显示错误信息-->
<template>
  <div>
    <label>{{label}}</label>
    <slot></slot>
    <p class="error" v-if="error">{{error}}</p>
  </div>
</template>
<script>
import Schema from "async-validator";
export default {
  inject: ["form"], //获取祖组件的数据，与provide一起使用（绑定不是可响应的，如果传入是可监听的对象，那对象的property还是可相应的）
  props: {
    //标签
    label: {
      type: String,
      default: ""
    },
    //input的key
    prop: {
      type: String,
      default: ""
    }
  },
  data() {
    return {
      error: ""
    };
  },
  mounted() {
    this.$on("validate",()=>{
      this.validate();
    })
  },
  methods: {
    validate() {
      //执行校验
      //1.获取校验规则
      const rules = this.form.rules[this.prop];
      //2.获取当前值
      const value = this.form.model[this.prop];
      //3.创建校验器
      const schema = new Schema({
        //计算属性
        [this.prop]: rules
      });
      //4.执行校验
      return schema.validate({ [this.prop]: value }, (errors, fields) => {
        if (errors) {
          //显示错误信息
          this.error = errors[0].message;
        } else {
          //清空以前可能存在的错误
          this.error = "";
        }
      });
    }
  }
};
</script>

<style lang="scss" scoped>
.error {
  color: red;
}
</style>