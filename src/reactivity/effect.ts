import { extend } from "../shared";

// 抽离概念 ReactiveEffect类
class ReactiveEffect {
    private _fn;
    deps = [];
    active = true;
    onStop?: () => void;
    public scheduler: Function | undefined
    constructor(fn, scheduler?: Function) {
        this._fn = fn;
        this.scheduler = scheduler
    }
    run() {
        // 如果调用，说明是当前
        activeEffect = this;
        return this._fn()
    }
    stop() {
        if (this.active) {
            cleanupEffect(this);
            if (this.onStop) {
                this.onStop();
            }
            this.active = false;
        }

    }
}

function cleanupEffect(effect) {
    effect.deps.forEach((dep: any) => {
        dep.delete(effect)
    })
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
    if (!depsMap) {// 如果是初始化的时候，并不存在，就手动设置
        depsMap = new Map();
        targetMap.set(target, depsMap)
    }
    let dep = depsMap.get(key);
    if (!dep) {
        dep = new Set();
        depsMap.set(key, dep);
    }

    // activeEffect 只在effect里，所以单纯的reactive会出现undefined的可能
    if(!activeEffect) return;

    dep.add(activeEffect);
    activeEffect.deps.push(dep)
    // const dep = new Set();
}

export function trigger(target, key) {
    let depsMap = targetMap.get(target)
    let dep = depsMap.get(key)
    for (const effect of dep) {
        if (effect.scheduler) {
            effect.scheduler()
        } else {
            effect.run()
        }

    }
}
let activeEffect;// 当前fn
/**
 * 执行fn
 * @param fn 
 */
export function effect(fn, options: any = {}) {
    // fn
    const _effect = new ReactiveEffect(fn, options.scheduler);
    // options
    
    // Object.assign(_effect, options);
    // extend
    extend(_effect, options);
    _effect.run()
    const runner: any = _effect.run.bind(_effect)
    runner.effect = _effect
    return runner;
}

export function stop(runner) {
    runner.effect.stop()
}
