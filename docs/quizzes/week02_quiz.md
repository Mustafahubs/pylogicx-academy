# Week 2 Quiz — if/elif/else, Operators & Type Casting

---

!!! question "Week 2 — Question 1: The input() String Trap"
    A student writes a program to check if the user is an adult.
    The user types `18`. What happens?

    ```python
    age = input("Enter your age: ")

    if age >= 18:
        print("Welcome — you're an adult.")
    else:
        print("Sorry, adults only.")
    ```

    * [ ] A) `Welcome — you're an adult.`
    * [ ] B) `Sorry, adults only.`
    * [x] C) `TypeError: '>=' not supported between instances of 'str' and 'int'`
    * [ ] D) `ValueError: invalid literal for int()`

    ??? success "Check Answer"
        ✅ **Correct Answer: C) `TypeError: '>=' not supported between instances of 'str' and 'int'`**

        `input()` **always returns a string** — even when the user types a number.
        Comparing the string `"18"` to the integer `18` with `>=` causes a `TypeError`.

        The fix is to cast the input immediately:

        ```python
        age = int(input("Enter your age: "))  # convert to int right away

        if age >= 18:
            print("Welcome — you're an adult.")
        else:
            print("Sorry, adults only.")
        ```

        This is the most common bug beginners hit in Week 2. **Always cast `input()` when you expect a number.**

---

!!! question "Week 2 — Question 2: elif Chain — Which Branch Runs?"
    What does this code print?

    ```python
    score = 72

    if score >= 90:
        print("A")
    elif score >= 80:
        print("B")
    elif score >= 70:
        print("C")
    elif score >= 60:
        print("D")
    else:
        print("F")
    ```

    * [ ] A) `B`
    * [x] B) `C`
    * [ ] C) `C` and `D` (both print because both conditions are true)
    * [ ] D) `D`

    ??? success "Check Answer"
        ✅ **Correct Answer: B) `C`**

        Python evaluates `if/elif/else` **top to bottom and stops at the first true condition**.

        - `score >= 90` → `72 >= 90` → `False`, skip
        - `score >= 80` → `72 >= 80` → `False`, skip
        - `score >= 70` → `72 >= 70` → ✅ `True` → print `"C"`, stop

        Even though `score >= 60` is also true, it is **never reached**. Only one branch in an `if/elif/else` chain ever executes.

---

!!! question "Week 2 — Question 3: Logical Operators"
    What are the three output values?

    ```python
    x = 7

    print(x > 5 and x < 10)
    print(x > 5 or x > 20)
    print(not x == 7)
    ```

    * [ ] A) `True` / `True` / `True`
    * [x] B) `True` / `True` / `False`
    * [ ] C) `False` / `True` / `False`
    * [ ] D) `True` / `False` / `False`

    ??? success "Check Answer"
        ✅ **Correct Answer: B) `True` / `True` / `False`**

        Breaking it down:

        | Expression | Evaluates to | Why |
        |-----------|-------------|-----|
        | `x > 5 and x < 10` | `True` | Both sides are true (`7 > 5` ✅ and `7 < 10` ✅) |
        | `x > 5 or x > 20` | `True` | At least one side is true (`7 > 5` ✅) — `or` only needs one |
        | `not x == 7` | `False` | `x == 7` is `True`, so `not True` is `False` |

        **Memory trick:** `and` needs ALL true. `or` needs ANY true. `not` flips the result.

---

!!! question "Week 2 — Question 4: Chained Type Casting"
    What does this print?

    ```python
    value = "3.99"
    result = int(float(value))
    print(result)
    ```

    * [ ] A) `3.99`
    * [ ] B) `4`
    * [x] C) `3`
    * [ ] D) `ValueError: invalid literal for int() with base 10: '3.99'`

    ??? success "Check Answer"
        ✅ **Correct Answer: C) `3`**

        Two conversions happen in sequence:

        ```python
        float("3.99")   # → 3.99  (string becomes a float)
        int(3.99)       # → 3     (float is TRUNCATED, not rounded)
        ```

        `int()` always **truncates toward zero** — it never rounds. So `int(3.99)` is `3`, not `4`.

        If you wanted the rounded integer, you'd use `round()`:
        ```python
        round(float("3.99"))  # → 4
        ```

        Also note: `int("3.99")` directly would raise a `ValueError` — you must go through `float` first.

---

!!! question "Week 2 — Question 5: Truthy and Falsy Values"
    What does this code print?

    ```python
    empty_list = []
    zero = 0
    empty_string = ""
    name = "Alice"

    print(bool(empty_list))
    print(bool(zero))
    print(bool(empty_string))
    print(bool(name))
    ```

    * [ ] A) `True` / `True` / `True` / `True`
    * [x] B) `False` / `False` / `False` / `True`
    * [ ] C) `False` / `True` / `False` / `True`
    * [ ] D) `True` / `False` / `True` / `True`

    ??? success "Check Answer"
        ✅ **Correct Answer: B) `False` / `False` / `False` / `True`**

        Python treats these values as **falsy** (behave like `False` in a boolean context):

        | Value | Falsy? | Why |
        |-------|--------|-----|
        | `[]` | ✅ Yes | Empty container |
        | `0` | ✅ Yes | Zero is always falsy |
        | `""` | ✅ Yes | Empty string |
        | `"Alice"` | ❌ No | Non-empty string is truthy |

        This is why `if my_list:` is the Pythonic way to check if a list has items — it reads as "if the list is not empty."

        ```python
        results = []
        if results:           # only runs if list has at least one item
            print("Found results!")
        ```

---

!!! question "Week 2 — Question 6: Short-Circuit Evaluation"
    What does this print?

    ```python
    def check():
        print("check() called")
        return True

    result = False and check()
    print(result)
    ```

    * [x] A) `False` (check() is never called)
    * [ ] B) `check() called` then `True`
    * [ ] C) `check() called` then `False`
    * [ ] D) `True`

    ??? success "Check Answer"
        ✅ **Correct Answer: A) `False` (check() is never called)**

        Python uses **short-circuit evaluation** with `and` and `or`:

        - `and` stops as soon as it finds a **False** value — no point checking the rest
        - `or` stops as soon as it finds a **True** value — no point checking the rest

        Because `False and ...` can never be `True`, Python skips evaluating `check()` entirely.

        ```python
        False and check()   # → False immediately, check() never runs
        True  or  check()   # → True  immediately, check() never runs
        True  and check()   # → calls check(), returns its result
        False or  check()   # → calls check(), returns its result
        ```

        This is useful for guarding dangerous operations:
        ```python
        if data and data["key"] == value:  # safe: only accesses key if data is truthy
            ...
        ```

---

!!! question "Week 2 — Question 7: Chained Comparison"
    What does this print?

    ```python
    x = 15
    print(10 < x < 20)
    print(10 < x < 15)
    print(x == 15 == 15)
    ```

    * [x] A) `True` / `False` / `True`
    * [ ] B) `True` / `True` / `True`
    * [ ] C) `True` / `False` / `False`
    * [ ] D) `False` / `False` / `True`

    ??? success "Check Answer"
        ✅ **Correct Answer: A) `True` / `False` / `True`**

        Python supports **chained comparisons** — they work like mathematical notation:

        ```python
        10 < x < 20    →  10 < 15 and 15 < 20  →  True and True  →  True
        10 < x < 15    →  10 < 15 and 15 < 15  →  True and False →  False
        x == 15 == 15  →  15 == 15 and 15 == 15 → True and True  →  True
        ```

        This is cleaner than writing `10 < x and x < 20` — both are equivalent, but chaining reads more naturally.

---

!!! question "Week 2 — Question 8: Division Operators"
    What does this print?

    ```python
    a = 17
    b = 5

    print(a / b)
    print(a // b)
    print(a % b)
    ```

    * [ ] A) `3.4` / `3` / `1`
    * [x] B) `3.4` / `3` / `2`
    * [ ] C) `3` / `3` / `2`
    * [ ] D) `3.4` / `4` / `2`

    ??? success "Check Answer"
        ✅ **Correct Answer: B) `3.4` / `3` / `2`**

        Three division operators, three different jobs:

        | Operator | Name | `17 op 5` | Result |
        |----------|------|-----------|--------|
        | `/` | True division | `17 / 5` | `3.4` (always a float) |
        | `//` | Floor division | `17 // 5` | `3` (rounds down to nearest int) |
        | `%` | Modulo | `17 % 5` | `2` (remainder after division) |

        **Modulo check:** `17 = 5 × 3 + 2` → the remainder is `2`.

        Modulo is extremely useful for:
        ```python
        if number % 2 == 0:   # even/odd check
        if index % 10 == 0:   # "every 10 items" trigger
        ```

---

!!! question "Week 2 — Question 9: Nested if Statements"
    What does this print?

    ```python
    temperature = 22
    is_raining = False

    if temperature > 20:
        if is_raining:
            print("Warm but rainy")
        else:
            print("Great weather!")
    else:
        print("Too cold")
    ```

    * [ ] A) `Warm but rainy`
    * [x] B) `Great weather!`
    * [ ] C) `Too cold`
    * [ ] D) Nothing prints

    ??? success "Check Answer"
        ✅ **Correct Answer: B) `Great weather!`**

        Tracing the conditions:
        - `temperature > 20` → `22 > 20` → `True` → enter outer if block
        - `is_raining` → `False` → skip inner if, go to inner else
        - Print `"Great weather!"`

        Nested `if` statements let you check conditions in sequence. The inner `if` only runs if the outer `if` was true. You can often flatten nested ifs using `and`:

        ```python
        if temperature > 20 and is_raining:
            print("Warm but rainy")
        elif temperature > 20:
            print("Great weather!")
        else:
            print("Too cold")
        ```

---

!!! question "Week 2 — Question 10: The String Multiplication Trap"
    What does this print?

    ```python
    a = "3"
    b = "5"
    print(a + b)
    print(int(a) + int(b))
    ```

    * [ ] A) `8` / `8`
    * [x] B) `35` / `8`
    * [ ] C) `35` / `35`
    * [ ] D) `TypeError` / `8`

    ??? success "Check Answer"
        ✅ **Correct Answer: B) `35` / `8`**

        When `a` and `b` are **strings**, `+` is string concatenation — not addition:

        ```python
        "3" + "5"         # → "35"   (strings joined together)
        int("3") + int("5")  # → 8    (integers added)
        ```

        This is the exact trap that bites students who forget to cast `input()`. The user types `"3"` and `"5"`, and `a + b` gives `"35"` instead of `8`.

        **Always cast `input()` before doing arithmetic:**
        ```python
        a = int(input("First number: "))
        b = int(input("Second number: "))
        print(a + b)   # now correctly adds the numbers
        ```
