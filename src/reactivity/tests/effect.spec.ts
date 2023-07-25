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
})