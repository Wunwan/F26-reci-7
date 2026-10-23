# Reflection

**Name / Andrew ID:**

**Recitation group members (Task 2):**

---

### 1. Valid but weak

Pick a property you wrote that passes on the correct implementation but
kills few or no mutants. Why is it still a _valid_ property? Describe a
concrete bug (not one of our mutants) that it _would_ catch.

ANS: The property that guessing the secret gives all greens is valid because all letters match the secret characters and their positions. However, it doesn't account for letters that match the secret but are in different positions. A concrete bug it would catch is when the user types the exact secret word, but the function incorrectly marks one of the letters as yellow instead of green.

### 2. A generator problem, not a property problem

Describe a mutant, from either task, that survived or was flaky because of
your **generator** rather than your property. What did the generator fail to
produce? How did you fix it? Paste the runner output from before and after.

ANS: The touchingNotMerged mutant survived because the original generator created random intervals but rarely generated two intervals that shared the exact same endpoint. It was fixed by creating a targeted generator where the second interval starts at the end of the first interval to make sure that this specific edge case is tested.

### 3. Reading a counterexample

Paste one counterexample that the mutation runner printed for a killed
mutant. In 2–3 sentences, explain using the _specification_ why that input
exposes the bug.

ANS: Mutant: dropsLast
Counterexample: [[[0,0]]]

According to the specification, the output must cover exactly the same points as the input. The interval [0,0] covers the point 0, but the mutant returns an empty array, which loses that point and violates the specification.

### 4. Your project

Name one function or module in your team's project that would benefit from
property-based testing. State two properties in English, name the pattern of
each, and describe the generator you'd need, including anything about its
inputs that a naive generator would get wrong.

ANS: This will be applicable to our feature 'Add time log for project/session duration'.
Properties:

1. Metamorphic: Changing the order of time logs should not affect the total project duration.
2. Algebraic: Splitting one session into two consecutive time logs should produce the same total duration as the original session.

The generator would create random time logs where the start time is before the end time. A naive generator might create invalid time logs or miss cases like sessions crossing midnight or sharing the same endpoint.
