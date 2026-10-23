import { describe, expect, it } from "vitest";
import fc from "fast-check";
import { mergeIntervals, type Interval } from "../src/intervals";

// Recitation Part 2 (groups) and problem set Task 2.
// Read the spec in src/intervals/mergeIntervals.ts, then check your progress
// with `npm run mutants:intervals`.
//
// Label every property with its pattern, on the line above its `it(`:
//   // Pattern: invariant. The output is sorted.
// (invariant, algebraic, metamorphic, differential, or conditional)

// A first attempt at a generator. It has a problem: run the tests and read
// the counterexample.
// const interval: fc.Arbitrary<Interval> = fc.tuple(fc.integer(), fc.integer());
// const intervalList = fc.array(interval);

//sort the tuble so that start <= end
const interval: fc.Arbitrary<Interval> = fc
  .tuple(
    fc.integer({ min: -100, max: 100 }),
    fc.integer({ min: -100, max: 100 }),
  )
  .map(([a, b]) => [Math.min(a, b), Math.max(a, b)] as Interval);

const intervalList = fc.array(interval);
const touchingPair = fc
  .tuple(
    fc.integer({ min: -100, max: 100 }),
    fc.integer({ min: 1, max: 20 }),
    fc.integer({ min: 1, max: 20 }),
  )
  .map(
    ([start, a, b]) =>
      [
        [start, start + a],
        [start + a, start + a + b],
      ] as Interval[],
  );

const disjointPair = fc
  .tuple(
    fc.integer({ min: -100, max: 100 }),
    fc.integer({ min: 1, max: 20 }),
    fc.integer({ min: 1, max: 20 }),
  )
  .map(
    ([start, a, b]) =>
      [
        [start, start + a],
        [start + a + 1, start + a + 1 + b],
      ] as Interval[],
  );

describe("mergeIntervals", () => {
  // Pattern: invariant. Every input interval lies inside some output interval.
  it("every input interval lies inside some output interval", () => {
    fc.assert(
      fc.property(intervalList, (xs) => {
        const out = mergeIntervals(xs);
        const uncovered = xs.filter(
          ([s, e]) => !out.some(([a, b]) => a <= s && e <= b),
        );
        expect(uncovered).toEqual([]);
      }),
    );
  });

  // Add your properties here. Aim for at least one of each pattern:
  // invariant, algebraic, metamorphic, differential, conditional.
});

// Pattern: invariant. Output intervals are sorted.
it("output intervals are sorted", () => {
  fc.assert(
    fc.property(intervalList, (xs) => {
      const out = mergeIntervals(xs);

      for (let i = 1; i < out.length; i++) {
        expect(out[i - 1][0]).toBeLessThanOrEqual(out[i][0]);
      }
    }),
  );
});

// Pattern: algebraic. Merging twice equals merging once.
it("merging twice gives the same result", () => {
  fc.assert(
    fc.property(intervalList, (xs) => {
      const once = mergeIntervals(xs);
      const twice = mergeIntervals(once);

      expect(twice).toEqual(once);
    }),
  );
});
// Pattern: metamorphic. Reversing input preserves output.
it("reversing the input does not change the result", () => {
  fc.assert(
    fc.property(intervalList, (xs) => {
      const original = mergeIntervals(xs);
      const reversed = mergeIntervals([...xs].reverse());

      expect(reversed).toEqual(original);
    }),
  );
});

// Pattern: conditional. Touching intervals must merge.
it("merges touching intervals", () => {
  fc.assert(
    fc.property(touchingPair, (xs) => {
      const out = mergeIntervals(xs);

      expect(out).toEqual([[xs[0][0], xs[1][1]]]);
    }),
  );
});

// Pattern: conditional. Already-disjoint intervals stay separate.
it("keeps disjoint intervals separate", () => {
  fc.assert(
    fc.property(disjointPair, (xs) => {
      const out = mergeIntervals(xs);

      expect(out).toEqual(xs);
    }),
  );
});

// Pattern: invariant. Merging does not modify the original input.
it("does not modify the input", () => {
  fc.assert(
    fc.property(touchingPair, (xs) => {
      const original = xs.map(([s, e]) => [s, e] as Interval);

      mergeIntervals(xs);

      expect(xs).toEqual(original);
    }),
  );
});
