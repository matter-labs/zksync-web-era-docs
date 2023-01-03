import { expectType } from "tsd";
import { debounce } from "./index";

const f = debounce((value: string) => value, 1000);

expectType<Promise<string>>(f("foo"));

// @ts-expect-error
f(1);

// inferring debounced function argument types from  the function signature
//  and the place where the debounced function is called

// real world example with addEventListener
const inputs = document.querySelectorAll("input");
inputs[0].addEventListener(
  "input",
  debounce((event) => {
    expectType<EventTarget | null>(event.target);
  }, 0)
);

// simplifed use case
function testInference(g: (a: number) => void): any {
  g(1);
}

testInference(
  debounce((a) => {
    expectType<number>(a);
  })
);
