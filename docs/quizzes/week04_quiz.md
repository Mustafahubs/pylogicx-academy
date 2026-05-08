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
