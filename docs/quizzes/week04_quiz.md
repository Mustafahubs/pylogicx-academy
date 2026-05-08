# Week 4 Quiz — Functions, Parameters, Returns & Scope

---

!!! question "Week 4 — Question 1: Missing return Statement"
    What does this print?

    ```python
    def add_numbers(a, b):
        result = a + b

    total = add_numbers(10, 5)
    print(total)
    ```

    * [ ] A) `15`
    * [ ] B) `0`
    * [x] C) `None`
    * [ ] D) `NameError: name 'result' is not defined`

    ??? success "Check Answer"
        ✅ **Correct Answer: C) `None`**

        The function calculates `result = 15` but **never returns it**. A function without a `return` statement implicitly returns `None`.

        `total` is assigned whatever the function returns — which is `None` — so `print(total)` prints `None`.

        ```python
        # ❌ Common mistake: forgetting return
        def add_numbers(a, b):
            result = a + b          # result exists only inside the function

        # ✅ Correct
        def add_numbers(a, b):
            result = a + b
            return result           # send it back to the caller
        ```

        **Rule of thumb:** if you need to use the output of a function somewhere else, it must have a `return`.

---

!!! question "Week 4 — Question 2: Local vs. Global Scope"
    What does this code print?

    ```python
    score = 100

    def update_score():
        score = 200
        print(f"Inside: {score}")

    update_score()
    print(f"Outside: {score}")
    ```

    * [ ] A) `Inside: 200` / `Outside: 200`
    * [ ] B) `Inside: 100` / `Outside: 100`
    * [x] C) `Inside: 200` / `Outside: 100`
    * [ ] D) `UnboundLocalError: local variable 'score' referenced before assignment`

    ??? success "Check Answer"
        ✅ **Correct Answer: C) `Inside: 200` / `Outside: 100`**

        `score = 200` inside the function creates a **new local variable** called `score` that exists only inside `update_score()`. It does not touch the global `score = 100`.

        After the function exits, the local `score` is destroyed. The global `score` is unchanged.

        ```
        Global scope:  score = 100  ← untouched
        Local scope:   score = 200  ← exists only during function call
        ```

        To actually modify the global variable, you'd need the `global` keyword — but this is generally discouraged. Better to `return` the new value and reassign it.

        ```python
        def update_score():
            return 200

        score = update_score()   # score is now 200
        ```

---

!!! question "Week 4 — Question 3: Default Parameter Values"
    What does this print?

    ```python
    def greet(name, message="Good morning"):
        print(f"{message}, {name}!")

    greet("Alice")
    greet("Bob", "Good evening")
    greet(message="Hey there", name="Carol")
    ```

    * [ ] A) `Good morning, Alice!` / `Good morning, Bob!` / `Hey there, Carol!`
    * [x] B) `Good morning, Alice!` / `Good evening, Bob!` / `Hey there, Carol!`
    * [ ] C) `SyntaxError: default argument follows non-default argument`
    * [ ] D) `Good morning, Alice!` / `Good evening, Bob!` / `Hey there, message!`

    ??? success "Check Answer"
        ✅ **Correct Answer: B) `Good morning, Alice!` / `Good evening, Bob!` / `Hey there, Carol!`**

        - `greet("Alice")` — only `name` provided, `message` uses its default `"Good morning"`
        - `greet("Bob", "Good evening")` — both provided positionally, default is overridden
        - `greet(message="Hey there", name="Carol")` — **keyword arguments** can be in any order

        Keyword arguments let you skip defaults selectively without worrying about position. This becomes very useful in functions with many optional parameters.

---

!!! question "Week 4 — Question 4: The Mutable Default Argument Trap"
    This is a classic Python gotcha. What does this print?

    ```python
    def add_tag(tag, tag_list=[]):
        tag_list.append(tag)
        return tag_list

    print(add_tag("python"))
    print(add_tag("coding"))
    print(add_tag("beginner"))
    ```

    * [ ] A) `['python']` / `['coding']` / `['beginner']`
    * [x] B) `['python']` / `['python', 'coding']` / `['python', 'coding', 'beginner']`
    * [ ] C) `['python', 'coding', 'beginner']` (printed three times)
    * [ ] D) `TypeError: list is not a valid default argument type`

    ??? success "Check Answer"
        ✅ **Correct Answer: B) `['python']` / `['python', 'coding']` / `['python', 'coding', 'beginner']`**

        This is one of Python's most infamous traps. **Default argument values are created once when the function is defined** — not each time it is called.

        The `[]` in `def add_tag(tag, tag_list=[])` is a single list object in memory. Every call that doesn't provide `tag_list` uses that *same* list, so tags accumulate across calls.

        **The correct pattern** — use `None` as the default and create a fresh list inside the function:

        ```python
        def add_tag(tag, tag_list=None):
            if tag_list is None:
                tag_list = []       # new list created on every call
            tag_list.append(tag)
            return tag_list

        print(add_tag("python"))    # ['python']
        print(add_tag("coding"))    # ['coding']   ← fresh list each time
        ```

        **Rule:** Never use a mutable object (list, dict, set) as a default argument.

---

!!! question "Week 4 — Question 5: *args — Variable Positional Arguments"
    What does this print?

    ```python
    def summarise(*values):
        total = sum(values)
        average = total / len(values)
        return f"Total: {total}, Average: {average:.1f}"

    print(summarise(10, 20, 30))
    print(summarise(5, 15))
    ```

    * [x] A) `Total: 60, Average: 20.0` / `Total: 20, Average: 10.0`
    * [ ] B) `Total: (10, 20, 30), Average: 3.0` / `Total: (5, 15), Average: 2.0`
    * [ ] C) `TypeError: summarise() takes 0 positional arguments but 3 were given`
    * [ ] D) `Total: 60, Average: 2.0` / `Total: 20, Average: 1.0`

    ??? success "Check Answer"
        ✅ **Correct Answer: A) `Total: 60, Average: 20.0` / `Total: 20, Average: 10.0`**

        `*values` collects **all positional arguments into a tuple**.

        ```python
        summarise(10, 20, 30)  →  values = (10, 20, 30)
        sum(values)            →  60
        len(values)            →  3
        60 / 3                 →  20.0
        ```

        The `:.1f` format specifier rounds to 1 decimal place.

        `*args` lets you write functions that accept any number of arguments — like Python's built-in `print()`, `sum()`, and `max()` do. The name `args` is just a convention; the `*` is what matters.

---

!!! question "Week 4 — Question 6: Returning Multiple Values"
    What does this print?

    ```python
    def min_max(numbers):
        return min(numbers), max(numbers)

    low, high = min_max([3, 1, 7, 2, 9, 4])
    print(low)
    print(high)
    ```

    * [x] A) `1` / `9`
    * [ ] B) `(1, 9)` / `TypeError`
    * [ ] C) `3` / `9`
    * [ ] D) `SyntaxError: can't return two values`

    ??? success "Check Answer"
        ✅ **Correct Answer: A) `1` / `9`**

        A Python function can return multiple values as a **tuple**. The caller can **unpack** that tuple into separate variables:

        ```python
        return min(numbers), max(numbers)
        # equivalent to: return (1, 9)

        low, high = (1, 9)   # tuple unpacking
        # low = 1, high = 9
        ```

        This is called **multiple return values** — but technically it's one tuple being unpacked. The commas on the `return` line create the tuple automatically.

        ```python
        # You can also capture the tuple without unpacking:
        result = min_max([3, 1, 7, 2, 9, 4])
        print(result)   # (1, 9)
        ```

---

!!! question "Week 4 — Question 7: **kwargs — Keyword Arguments"
    What does this print?

    ```python
    def display(**details):
        for key, value in details.items():
            print(f"{key}: {value}")

    display(name="Alice", age=25, city="London")
    ```

    * [x] A) `name: Alice` / `age: 25` / `city: London`
    * [ ] B) `TypeError: display() takes 0 positional arguments but 3 were given`
    * [ ] C) `{'name': 'Alice', 'age': 25, 'city': 'London'}`
    * [ ] D) `Alice` / `25` / `London`

    ??? success "Check Answer"
        ✅ **Correct Answer: A) `name: Alice` / `age: 25` / `city: London`**

        `**kwargs` collects all **keyword arguments** (name=value pairs) into a **dictionary** called `details`.

        ```python
        display(name="Alice", age=25, city="London")
        # inside function: details = {"name": "Alice", "age": 25, "city": "London"}
        ```

        Iterating `details.items()` gives `(key, value)` pairs in insertion order.

        | Pattern | Collects into | Use when |
        |---------|--------------|----------|
        | `*args` | tuple | unknown number of positional args |
        | `**kwargs` | dict | unknown number of keyword args |

---

!!! question "Week 4 — Question 8: Function Calling Another Function"
    What does this print?

    ```python
    def square(n):
        return n * n

    def sum_of_squares(a, b):
        return square(a) + square(b)

    print(sum_of_squares(3, 4))
    ```

    * [ ] A) `7`
    * [ ] B) `12`
    * [x] C) `25`
    * [ ] D) `49`

    ??? success "Check Answer"
        ✅ **Correct Answer: C) `25`**

        Functions can call other functions. The evaluation chains:

        ```python
        sum_of_squares(3, 4)
        → square(3) + square(4)
        → (3 * 3) + (4 * 4)
        → 9 + 16
        → 25
        ```

        Breaking big problems into small, focused functions is a core principle of good code design. `sum_of_squares` doesn't need to know *how* squaring works — it just calls `square` and trusts it.

---

!!! question "Week 4 — Question 9: The global Keyword"
    What does this print?

    ```python
    counter = 0

    def increment():
        global counter
        counter += 1

    increment()
    increment()
    increment()
    print(counter)
    ```

    * [ ] A) `0`
    * [ ] B) `1`
    * [ ] C) `2`
    * [x] D) `3`

    ??? success "Check Answer"
        ✅ **Correct Answer: D) `3`**

        The `global` keyword tells Python: "when I write `counter` inside this function, I mean the **global** `counter`, not a new local one."

        Without `global counter`, writing `counter += 1` would raise an `UnboundLocalError` because Python sees the assignment and treats `counter` as a local variable — but it was never assigned a local value before being read.

        ```python
        # Without global → UnboundLocalError
        def increment():
            counter += 1   # Python treats counter as local, but it hasn't been set locally

        # With global → works
        def increment():
            global counter
            counter += 1
        ```

        **Best practice:** avoid `global` where possible. Prefer returning values and reassigning at the call site. Use `global` only when genuinely needed.

---

!!! question "Week 4 — Question 10: lambda and map()"
    What does this print?

    ```python
    numbers = [1, 2, 3, 4, 5]
    doubled = list(map(lambda x: x * 2, numbers))
    print(doubled)
    ```

    * [ ] A) `[1, 2, 3, 4, 5]`
    * [x] B) `[2, 4, 6, 8, 10]`
    * [ ] C) `lambda x: x * 2`
    * [ ] D) `TypeError: 'map' object is not subscriptable`

    ??? success "Check Answer"
        ✅ **Correct Answer: B) `[2, 4, 6, 8, 10]`**

        `lambda x: x * 2` is an **anonymous function** (no `def`, no name) that takes `x` and returns `x * 2`.

        `map(function, iterable)` applies the function to every item and returns a lazy iterator. `list()` converts it to a list.

        ```python
        map(lambda x: x * 2, [1, 2, 3, 4, 5])
        # applies to each: 1*2, 2*2, 3*2, 4*2, 5*2
        # → [2, 4, 6, 8, 10]
        ```

        The equivalent list comprehension (more readable in most cases):
        ```python
        doubled = [x * 2 for x in numbers]
        ```

        Lambdas are useful for short, one-off functions passed to `map()`, `filter()`, or `sorted()`.
