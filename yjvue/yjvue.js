//yjvue框架构造函数
//创建YjVue类
class YjVue {
  //构造函数 options  为组件配置对象
  constructor(options) {
    //保存数据
    this.$options = options;
    this.$data = options.data;

    //data响应化处理
    observe(this.$data);

    //代理   ?为什么要做代理
    proxy(this);

    //编译器
    new Compiler('#app', this);
  }
}
//Observe:执行数据响应化（分辨数据是对象还是数组）
class Observer {
  //value 为需要做响应式处理的 obj
  constructor(value) {
    //保存数据
    this.value = value;
    this.walk(value)//调用方法
  }
  //类的方法
  walk(obj) {
    //遍历对象的属性,使每个属性都做响应式
    Object.keys(obj).forEach(key => {
      defineReactive(obj, key, obj[key]);
    })
  }

}
//Compile:编译模板，初始化视图，收集依赖（更新函数，watcher创建）
class Compiler {
  //el #app 根据点
  constructor(el, vm) {
    this.$vm = vm;
    console.log(this.$vm);
    this.$el = document.querySelector(el);

    //执行编译
    this.compile(this.$el);
  }
  compile(el) {
    //遍历这个el
    el.childNodes.forEach(node => {
      //是否是元素
      if (node.nodeType === 1) {//1元素节点  2属性节点  3文本节点
        //编译元素
        this.compileElement(node);
      } else if (this.isInter(node)) {
        this.compileText(node)
      }

      //递归
      if (node.childNodes) {
        this.compile(node);
      }
    })
  }

  //获取文本节点  返回{{xxxx}}
  isInter(node) {
    return node.nodeType === 3 && /\{\{(.*)\}\}/.test(node.textContent);
  }
  //编译元素
  compileElement(node) {
    //处理元素上面的属性，以yj-开头，@开头的
    const attrs = node.attributes
    Array.from(attrs).forEach(attr => {
      const attrName = attr.name;
      const exp = attr.value
      //yj-text  yj-html 的处理
      if (attrName.indexOf('yj-') === 0) {
        //截取指令名称 text
        const dir = attrName.substring(3);
        //看看是否存在对应方法，有则执行；
        this[dir] && this[dir](node, exp);
      }
      //@click="func"事件处理
      if (attrName.indexOf('@') === 0) {
        this.eventHandle(node,attrName.substring(1),exp);
      }
    })
  }

  //编译文本
  compileText(node) {
    //获取正则匹配表达式
    this.update(node, RegExp.$1, 'text');//RegExp.$1 不太懂 {{xxx}}中的xxx
  }

  //yj-text
  text(node, exp) {
    this.update(node, exp, 'text');
  }
  //yj-html
  html(node, exp) {
    this.update(node, exp, 'html');
  }
  //对事件的处理
  eventHandle(node,eventName,mothodName){
    node.addEventListener(eventName,()=>{
        this.$vm.$options.methods[mothodName].call(this.$vm);
    })
  }
  //一旦发现一个动态绑定，都要做两件事，首先解析动态值,其次创建更新函数
  //未来如果exp发生变化，执行这个watcher的更新函数
  update(node, exp, dir) {
    //初始化
    const fn = this[dir + 'Updater'] //dir为html，text等
    fn && fn(node, this.$vm[exp]); //该方法存在就调用

    //更新，创建一个Watcher实例
    new Watcher(this.$vm, exp, val => {
      fn && fn(node, val);//回调
    })
  }
  textUpdater(node, val) {
    node.textContent = val; //把{{xxx}}换为值
  }
  htmlUpdater(node, val) {
    node.innerHTML = val;
  }
}
//Watcher:执行更新函数（管理模板中的一个 更新点 vm：对象  key：键名，updateFn 更新回调）
class Watcher {
  constructor(vm, key, updateFn) {
    //保存数据
    this.vm = vm;
    this.key = key;
    this.updateFn = updateFn;

    //读一下当前key，触发依赖收集
    Dep.target = this
    vm[key]
    Dep.target = null
  }

  //更新数据  未来会被dep调用
  update() {
    this.updateFn.call(this.vm, this.vm[this.key]);//绑定指针（参数1运行函数的作用域，参数2 运行函数的参数）
  }
}

//Dep:管理多个Watcher，当某个key对应的值发生变化后，批量更新数据
class Dep {
  constructor() {
    this.deps = [];
  }
  //添加一个watcher
  addDep(watcher) {
    this.deps.push(watcher);
  }
  //通知watcher做更新
  notify() {
    this.deps.forEach(dep => {
      dep.update()});
  }
}

//使一个对象的所有属性都被拦截
function observe(obj) {
  if (typeof obj !== 'object' || obj == null) {
    return;
  }
  //创建 Observer实例:以后出现一个对象，就会有一个Observer实例
  new Observer(obj);
}

//响应式处理   obj:需要处理的对象;key 键名，val 值
function defineReactive(obj, key, val) {
  //递归 val可能是一个对象
  observe(val);

  //创建一个Dep,每个属性都有一个
  const dep = new Dep()

  //利用Object.defineProperty(obj,key,{}) 中的get 和set来处理响应式问题,obj需要修改或者新增的对象，key 需要修改或者新增对象属性的名称，{}属性的配置信息value,get,set
  Object.defineProperty(obj, key, {
    //此处有闭包存在。外界根据get访问val；
    get() {
      console.log('get', key);
      //依赖收集：把watcher 和dep关联；
      //希望Watcher实例化，访问一下对应的key，同时把这个实例设置到Dep.target上面
      Dep.target && dep.addDep(Dep.target);//此处不太理解
      return val;
    },
    set(newVal) {
      if (newVal !== val) {
        console.log('set', key, newVal);
        observe(newVal)//新值也需要 做响应式
        val = newVal;
        //通知更新
        dep.notify();//还不理解
      }
    }
  })
}

//代理 data中的数据
function proxy(vm) {
  Object.keys(vm.$data).forEach(key => {
    Object.defineProperty(vm, key, {
      get() {
        return vm.$data[key]
      },
      set(v) {
        vm.$data[key] = v;
      }
    })
  })
}