//弹框组件的特点是它们在当前Vue实例之外独立存在，通常挂载于body；它们是通过JS动态创建的，不需要在任何组件中声明
//用法如下: this.$create(Notice,{title:"",message:"",duration:1000}).show();
import Vue from 'vue';

//创建函数接收要创建组件定义
function create(Component,props){
   //创建一个Vue新实例
   const vm=new Vue({
     render(h){
         //render函数将传入组件配置对象转换为虚拟dom；
         console.log(h(Component,{props}));
         return h(Component,{props});
     }
   }).$mount();//执行挂载函数，但未指定挂载目标，表示只执行初始化工作；
   //将生成的Dom元素追加到Body
   document.body.appendChild(vm.$el);
   //给组件实例添加销毁方法
   const comp=vm.$children[0];
   comp.remove=()=>{
     document.body.removeChild(vm.$el);
     vm.$destroy();
   }
   return comp;
}

//暴露调用接口
export default create;