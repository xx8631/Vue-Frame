<template>
  <div>
    <YjForm :model="model" :rules="rules" ref="form">
      <YjFormItem label="用户名" prop="username">
        <YjInput v-model="model.username" type="text"></YjInput>
      </YjFormItem>
      <YjFormItem label="密码" prop="password">
        <YjInput v-model="model.password" type="password"></YjInput>
      </YjFormItem>
      <YjFormItem>
        <button @click="login">登录</button>
      </YjFormItem>
    </YjForm>
  </div>
</template>

<script>
import YjInput from "@/components/form/YjInput";
import YjFormItem from "@/components/form/YjFormItem";
import YjForm from "@/components/form/YjForm";
export default {
  components: {
    YjInput,
    YjFormItem,
    YjForm
  },
  data() {
    return {
      model: {
        username: "",
        password: ""
      },
      rules: {
        username: [{ required: true, message: "请输入用户名" }],
        password: [{ required: true, message: "请输入密码" }]
      }
    };
  },
  methods: {
    login() {
      //调用组件方法
      this.$refs.form.validate(isValid => {
        if (isValid) {
          this.$notice({title:"提示",message:"登录成功"}).show();
        } else {
           this.$notice({title:"提示",message:"校验失败"}).show();
        }
      });
    }
  }
};
</script>

<style lang="scss" scoped>
</style>