import { reactive } from "../reactive";
import { effect } from "../effect";
describe("effects", () => {

    it("happy path", () => {//.skip 拆分，分步走测试
        // 创建响应式对象
        const user = reactive({
            age: 10
        })

        let nextAge;
        effect(() => {
            nextAge = user.age + 1;
        })

        expect(nextAge).toBe(11);

        // update 未收集触发依赖操作 无法通过
        user.age++;
        expect(nextAge).toBe(12);
    })

    it('should return runner when call effect', () => {
        // 1.effect(fn) -> function(runner) -> fn -> return
        let foo = 10;
        const runner = effect(() => {
            foo++
            return "foo"
        })
        expect(foo).toBe(11)
        const r = runner()
        expect(foo).toBe(12)
        expect(r).toBe("foo")
    })

    it('scheduler', () => {
        // 1.通过effect函数第二个参数scheduler给定的 fn
        // 2.effect第一次执行还会执行fn
        // 3.当 响应式对象 set update 不会执行fn 而是执行scheduler
        // 4.如果说 当执行 runner的时候 会再次执行 fn
        let dummy;
        let run: any;
        const scheduler = jest.fn(() => {
            run = runner;
        })
        const obj = reactive({ foo: 1 })
        const runner = effect(
            () => {
                dummy = obj.foo
            },
            { scheduler }
        )
        expect(scheduler).not.toHaveBeenCalled();
        expect(dummy).toBe(1);
        obj.foo++;
        expect(scheduler).toHaveBeenCalledTimes(1);
        expect(dummy).toBe(1);

        run();
        expect(dummy).toBe(2);
    })
})