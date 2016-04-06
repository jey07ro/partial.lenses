import R from "ramda"

import P, * as L from "../src/partial.lenses"

function show(x) {
  switch (typeof x) {
  case "string":
  case "object":
    return JSON.stringify(x)
  default:
    return `${x}`
  }
}

const testEq = (expr, expect) => it(`${expr} => ${show(expect)}`, () => {
  const actual = eval(`(P, L, R) => ${expr}`)(P, L, R)
  if (!R.equals(actual, expect))
    throw new Error(`Expected: ${show(expect)}, actual: ${show(actual)}`)
})

describe("compose", () => {
  testEq("P === L.compose", true)
  testEq('P() === L.identity', true)
  testEq('P("x")', "x")
  testEq('P(101)', 101)
})

describe("arities", () => {
  testEq('L.augment.length', 1)
  testEq('L.choice.length', 0)
  testEq('L.compose.length', 0)
  testEq('L.defaults.length', 1)
  testEq('L.define.length', 1)
  testEq('L.filter.length', 1)
  testEq('L.find.length', 1)
  testEq('L.findWith.length', 1)
  testEq('L.get.length', 2)
  testEq('L.index.length', 1)
  testEq('L.lens.length', 2)
  testEq('L.modify.length', 3)
  testEq('L.normalize.length', 1)
  testEq('L.orElse.length', 2)
  testEq('L.pick.length', 1)
  testEq('L.prop.length', 1)
  testEq('L.props.length', 1)
  testEq('L.remove.length', 2)
  testEq('L.replace.length', 2)
  testEq('L.required.length', 1)
  testEq('L.set.length', 3)
})

describe('L.find', () => {
  testEq('L.set(L.find(R.equals(2)), undefined, [,,2])', undefined)
  testEq('L.set(L.find(R.equals(2)), undefined, [1, 2, 3])', [1, 3])
  testEq('L.set(L.find(R.equals(2)), 4, [1, 2, 3])', [1, 4, 3])
  testEq('L.set(L.find(R.equals(2)), 2, [1, 4, 3])', [1, 4, 3, 2])
  testEq('L.set(L.find(R.equals(2)), 2, undefined)', [2])
  testEq('L.set(L.find(R.equals(2)), 2, [])', [2])
  testEq('L.get(L.find(R.equals(2)), undefined)', undefined)
  testEq('L.get(L.find(R.equals(2)), [3])', undefined)
})

describe('L.index', () => {
  testEq('L.set(P(1), undefined, [,,])', undefined)
  testEq('L.set(P(L.required([]), 1), undefined, [,,])', [])
  testEq('L.set(P(1), 4, [1, 2, 3])', [1, 4, 3])
  testEq('L.set(2, 4, undefined)', [,, 4])
  testEq('L.set(P(2), 4, [1])', [1,, 4])
  testEq('L.remove(P(0), [1, 2, 3])', [2, 3])
  testEq('L.set(P(1), undefined, [1, 2, 3])', [1, 3])
  testEq('L.set(2, undefined, [1, 2, 3])', [1, 2])
  testEq('L.set(P(5), undefined, [1, 2, 3])', [1, 2, 3])
  testEq('L.get(5, undefined)', undefined)
  testEq('L.get(P(5), [1, 2, 3])', undefined)
  testEq('L.set(1, "2", ["1", "2", "3"])', ["1", "2", "3"])
})

describe('L.prop', () => {
  testEq('L.set(P("x"), undefined, {x: 1})', undefined)
  testEq('L.set(P("x", L.required(null)), undefined, {x: 1})', {x: null})
  testEq('L.set(P("x", L.required(null)), 2, {x: 1})', {x: 2})
  testEq('L.remove("y", {x: 1, y: 2})', {x: 1})
  testEq('L.set(P("y"), 3, {x: 1, y: 2})', {x: 1, y: 3})
  testEq('L.set("z", 3, {x: 1, y: 2})', {x: 1, y: 2, z: 3})
  testEq('L.set(P("z"), 3, undefined)', {z: 3})
  testEq('L.get("z", undefined)', undefined)
  testEq('L.get(P("z"), {x: 1})', undefined)
})

describe("L.replace", () => {
  testEq('L.get(L.replace(undefined, ""), undefined)', "")
  testEq('L.get(L.replace(undefined, ""), "defined")', "defined")
  testEq('L.set(L.replace(undefined, ""), "", "anything")', undefined)
  testEq('L.set(L.replace(undefined, ""), "defined", "anything")', "defined")
})

describe("L.defaults", () => {
  testEq('L.get(L.defaults(""), undefined)', "")
  testEq('L.get(L.defaults(""), "defined")', "defined")
  testEq('L.set(L.defaults(""), "", "anything")', undefined)
  testEq('L.set(L.defaults(""), "defined", "anything")', "defined")
})

describe("L.normalize", () => {
  testEq('L.get(L.normalize(R.sortBy(R.identity)), [1,3,2,5])', [1,2,3,5])
  testEq('L.set(P(L.normalize(R.sortBy(R.identity)), L.find(R.equals(2))), 4, [1,3,2,5])',
         [1,3,4,5])
  testEq('L.set(P(L.normalize(R.sortBy(R.identity)), L.find(R.equals(2))), 4, undefined)',
         [4])
  testEq('L.remove(P(L.normalize(R.sortBy(R.identity)), L.find(R.equals(2))), [2])',
         undefined)
  testEq('L.set(P(L.normalize(R.sortBy(R.identity)), L.find(R.equals(2))), undefined, [1,3,2,5])',
         [1,3,5])
})

describe("L.nothing", () => {
  testEq('L.get(L.nothing, "anything")', undefined)
  testEq('L.set(L.nothing, "anything", "original")', "original")
})

describe("L.orElse", () => {
  testEq('L.get(L.orElse("b", "a"), {a: 2, b: 1})', 2)
  testEq('L.get(L.orElse("b", "a"), {b: 2})', 2)
  testEq('L.set(L.orElse("b", "a"), 3, {a: 2, b: 1})', {a: 3, b: 1})
  testEq('L.set(L.orElse("b", "a"), 3, {b: 2})', {b: 3})
})

describe("L.choice", () => {
  testEq('L.get(L.choice("x", "y"), {x: "a"})', "a")
  testEq('L.get(L.choice("x", "y"), {y: "b"})', "b")
  testEq('L.get(L.choice("x", "y"), {z: "c"})', undefined)
  testEq('L.set(L.choice("x", "y"), "A", {x: "a"})', {x: "A"})
  testEq('L.set(L.choice("x", "y"), "B", {y: "b"})', {y: "B"})
  testEq('L.set(L.choice("x", "y"), "C", {z: "c"})', {z: "c"})
})

describe("L.firstOf", () => {
  testEq('L.get(L.firstOf("x", "y"), {x: 11, y: 12})', 11)
  testEq('L.get(L.firstOf("y", "x"), {x: 11, y: 12})', 12)
  testEq('L.get(L.firstOf("x", "y"), {z: 13})', undefined)
  testEq('L.modify(L.firstOf("x", "y"), x => x-2, {x: 11, y: 12})', {x: 9, y: 12})
  testEq('L.modify(L.firstOf("y", "x"), x => x-2, {x: 11, y: 12})', {x: 11, y: 10})
  testEq('L.set(L.firstOf("x", "y"), 12, {z: 13})', {x: 12, z: 13})
  testEq('L.set(L.firstOf("y", "x"), 12, {z: 13})', {y: 12, z: 13})
  testEq('L.remove(L.firstOf("x", "y"), {z: 13})', {z: 13})
  testEq('L.remove(L.firstOf("x", "y"), {x: 11, y: 12})', {y: 12})
  testEq('L.remove(L.firstOf("y", "x"), {x: 11, y: 12})', {x: 11})
})

describe("L.findWith", () => {
  testEq('L.get(L.findWith("x", 1), [{x: ["a"]},{x: ["b","c"]}])', "c")
  testEq('L.set(L.findWith("x", 1), "d", [{x: ["a"]},{x: ["b","c"]}])', [{x: ["a"]},{x: ["b","d"]}])
  testEq('L.remove(L.findWith("x", 1), [{x: ["a"]},{x: ["b","c"]}])', [{x: ["a"]},{x: ["b"]}])
})

describe("L.filter", () => {
  testEq('L.get(L.filter(R.lt(9)), [3,1,4,1,5,9,2])', [])
  testEq('L.get(L.filter(R.lt(2)), undefined)', undefined)
  testEq('L.get(L.filter(R.lt(2)), [3,1,4,1,5,9,2])', [3,4,5,9])
  testEq('L.remove(P(L.filter(R.lt(2)), 1), [3,1,4,1,5,9,2])', [3,5,9,1,1,2])
  testEq('L.set(L.filter(R.lt(0)), [], [3,1,4,1,5,9,2])', undefined)
  testEq('L.remove(L.filter(R.lt(0)), [3,1,4,1,5,9,2])', undefined)
  testEq('L.remove(L.filter(R.lt(2)), [3,1,4,1,5,9,2])', [1,1,2])
})

describe("L.removeAll", () => {
  testEq('L.removeAll(L.find(x => x < 2), [3,1,4,1,5,9,2])', [3,4,5,9,2])
})

describe("L.augment", () => {
  testEq('L.get(L.augment({y: c => c.x+1, z: c => c.x-1}), {x: 0})', {x: 0, y: 1, z: -1})
  testEq('L.get(L.augment({y: c => c.x+1}), {x: 2, y: -1})', {x: 2, y: 3})
  testEq('L.set(L.augment({y: c => c.x+1}), {x: 1, y: 1}, {x: 0})', {x: 1})
  testEq('L.set(L.augment({y: c => c.x+1}), {x: 2, y: 1}, {x: 0, y: -1})', {x: 2, y: -1})
  testEq('L.remove(P(L.augment({y: () => 1}), "x"), {x:0})', undefined)
  testEq('L.remove(L.augment({z: c => c.x + c.y}), {x: 1, y: 2})', undefined)
})

describe("L.pick", () => {
  testEq('L.get(L.pick({x: "c"}), {a: [2], b: 1})', undefined)
  testEq('L.set(P(L.pick({x: "c"}), "x"), 4, {a: [2], b: 1})', {a: [2], b: 1, c: 4})
  testEq('L.get(L.pick({x: "b", y: "a"}), {a: [2], b: 1})', {x: 1, y: [2]})
  testEq('L.set(P(L.pick({x: "b", y: "a"}), "x"), 3, {a: [2], b: 1})', {a: [2], b: 3})
  testEq('L.remove(P(L.pick({x: "b", y: "a"}), "y"), {a: [2], b: 1})', {b: 1})
  testEq('L.remove(P(L.pick({x: "b"}), "x"), {a: [2], b: 1})', {a: [2]})
  testEq('L.removeAll(P(L.pick({x: "b", y: "a"}), L.firstOf("y", "x")), {a: [2], b: 1})', undefined)
})

describe("L.props", () => {
  testEq('L.get(L.props("x", "y"), {x: 1, y: 2, z: 3})', {x: 1, y: 2})
  testEq('L.get(L.props("x", "y"), {z: 3})', undefined)
  testEq('L.get(L.props("x", "y"), {x: 2, z: 3})', {x: 2})
  testEq('L.remove(L.props("x", "y"), {x: 1, y: 2, z: 3})', {z: 3})
  testEq('L.set(L.props("x", "y"), {}, {x: 1, y: 2, z: 3})', {z: 3})
  testEq('L.set(L.props("x", "y"), {y: 4}, {x: 1, y: 2, z: 3})', {y: 4, z: 3})
  testEq('L.remove(L.props("x", "y"), {x: 1, y: 2})', undefined)
  testEq('L.set(L.props("a", "b"), {a: 2}, {a: 1, b: 3})', {a: 2})
})

const BST = {
  search: key => {
    const rec =
      P(L.normalize(n =>
          undefined !== n.value   ? n         :
          n.smaller && !n.greater ? n.smaller :
          !n.smaller && n.greater ? n.greater :
          L.set(BST.search(n.smaller.key), n.smaller, n.greater)),
        L.defaults({key}),
        L.choose(n => key < n.key ? P("smaller", rec) :
                      n.key < key ? P("greater", rec) :
                                    L.identity))
    return rec
  },

  valueOf: key => P(BST.search(key), "value"),

  isValid: (n, keyPred = () => true) =>
    undefined === n
    || "key" in n
    && "value" in n
    && keyPred(n.key)
    && BST.isValid(n.smaller, key => key < n.key)
    && BST.isValid(n.greater, key => n.key < key)
}

describe("BST", () => {
  const randomInt = (min, max) =>
    Math.floor(Math.random() * (max - min)) + min
  const randomPick = (...choices) =>
    choices[randomInt(0, choices.length)]

  it("maintains validity through operations", () => {
    let before
    let after
    let op
    let key

    const error = () => {
      throw new Error("From " + show(before) +
                      " " + op + " with " + key +
                      " gave " + show(after))
    }

    for (let i=0; i<1000; ++i) {
      key = randomInt(0, 10)
      op = randomPick("set", "delete")

      switch (op) {
        case "set":
          after = L.set(BST.valueOf(key), key, before)
          if (undefined === L.get(BST.valueOf(key), after))
            error()
          break
        case "delete":
          after = L.remove(BST.valueOf(key), before)
          if (undefined !== L.get(BST.valueOf(key), after))
            error()
          break
      }

      if (!BST.isValid(after))
        error()

      before = after
    }
  })
})
