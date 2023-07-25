// 抽离概念 ReactiveEffect类
class ReactiveEffect {
    private _fn;
    constructor(fn) {
        this._fn = fn;
    }
    run() {
        // 如果调用，说明是当前
        activeEffect = this;
        this._fn()
    }
}
const targetMap = new Map();
/**
 * 依赖收集
 * @param target 
 * @param key 
 */
export function track(target, key) {
    // track是一个依赖容器 依赖就是每个fn 它不能重复，所以选用Set
    // target 对应 key 对应 dep
    let depsMap = targetMap.get(target);
    if(!depsMap) {// 如果是初始化的时候，并不存在，就手动设置
        depsMap = new Map();
        targetMap.set(target, depsMap)
    }
    let dep = depsMap.get(key);
    if(!dep) {
        dep = new Set();
        depsMap.set(key, dep);
    }
    dep.add(activeEffect)
    // const dep = new Set();
}

export function trigger(target, key) {
    
}
let activeEffect;// 当前fn
/**
 * 执行fn
 * @param fn 
 */
export function effect(fn) {
  const _effect = new ReactiveEffect(fn);
  _effect.run()
}
