# Week 1 Quiz — Variables, F-strings & Lists

---

!!! question "Week 1 — Question 1: F-string Expression Evaluation"
    What is the output of this code?

    ```python
    score = 85
    grade = "B"
    print(f"Score: {score}, Grade: {grade.lower()}")
    ```

    * [ ] A) `Score: 85, Grade: B`
    * [x] B) `Score: 85, Grade: b`
    * [ ] C) `Score: {score}, Grade: {grade.lower()}`
    * [ ] D) `TypeError: can't use methods inside f-strings`

    ??? success "Check Answer"
        ✅ **Correct Answer: B) `Score: 85, Grade: b`**

        F-strings evaluate everything inside `{}` at runtime — including method calls.
        `grade.lower()` converts `"B"` to `"b"` before inserting it into the string.
        You can place any valid Python expression inside `{}`: arithmetic, method calls, even conditionals.

        ```python
        # All of these are valid f-string expressions
        print(f"{10 + 5}")           # 15
        print(f"{'hello'.upper()}")  # HELLO
        print(f"{len([1,2,3])}")     # 3
        ```

---

!!! question "Week 1 — Question 2: String Case Sensitivity"
    A student's program checks if the user typed the correct password.
    What does this print?

    ```python
    password = "Python"

    if password == "python":
        print("Access granted.")
    else:
        print("Access denied.")
    ```

    * [ ] A) `Access granted.`
    * [x] B) `Access denied.`
    * [ ] C) `True`
    * [ ] D) `SyntaxError: invalid comparison`

    ??? success "Check Answer"
        ✅ **Correct Answer: B) `Access denied.`**

        String comparison in Python is **case-sensitive**. `"Python"` and `"python"` are not equal — the capital `P` makes them different strings.

        This is one of the most common bugs in beginner code. The fix is to normalise both sides before comparing:

        ```python
        # Safe, case-insensitive check
        if password.lower() == "python":
            print("Access granted.")
        ```

        Always use `.lower()` or `.upper()` on both sides when you want case-insensitive matching.

---

!!! question "Week 1 — Question 3: List Negative Indexing"
    What does this code print?

    ```python
    fruits = ["apple", "banana", "cherry", "date"]
    print(fruits[-2])
    ```

    * [ ] A) `date`
    * [x] B) `cherry`
    * [ ] C) `banana`
    * [ ] D) `IndexError: list index out of range`

    ??? success "Check Answer"
        ✅ **Correct Answer: B) `cherry`**

        Negative indices count **backwards from the end** of the list:

        | Index | -4 | -3 | -2 | -1 |
        |-------|----|----|----|----|
        | Value | `"apple"` | `"banana"` | `"cherry"` | `"date"` |

        `-1` is always the last element, `-2` is second-to-last, and so on.
        Negative indexing never raises an `IndexError` as long as you stay within range.

---

!!! question "Week 1 — Question 4: String + Integer TypeError"
    What happens when you run this code?

    ```python
    age = 20
    print("I am " + age + " years old.")
    ```

    * [ ] A) `I am 20 years old.`
    * [ ] B) `I am age years old.`
    * [x] C) `TypeError: can only concatenate str (not "int") to str`
    * [ ] D) `SyntaxError: invalid syntax`

    ??? success "Check Answer"
        ✅ **Correct Answer: C) `TypeError: can only concatenate str (not "int") to str`**

        The `+` operator cannot mix strings and integers. Python doesn't automatically convert `age` to a string for you.

        Three correct ways to fix this:

        ```python
        age = 20

        # Option 1: f-string (recommended)
        print(f"I am {age} years old.")

        # Option 2: str() conversion
        print("I am " + str(age) + " years old.")

        # Option 3: comma in print (adds a space automatically)
        print("I am", age, "years old.")
        ```

        F-strings (Option 1) are the cleanest — they handle the conversion silently.

---

!!! question "Week 1 — Question 5: List Length After Mutations"
    What does this print?

    ```python
    items = ["pen", "notebook"]
    items.append("ruler")
    items.append("eraser")
    items.remove("pen")
    print(len(items))
    ```

    * [ ] A) `2`
    * [x] B) `3`
    * [ ] C) `4`
    * [ ] D) `ValueError: list.remove(x): x not in list`

    ??? success "Check Answer"
        ✅ **Correct Answer: B) `3`**

        Trace through the mutations step by step:

        ```python
        items = ["pen", "notebook"]      # length: 2
        items.append("ruler")            # length: 3 → ["pen", "notebook", "ruler"]
        items.append("eraser")           # length: 4 → ["pen", "notebook", "ruler", "eraser"]
        items.remove("pen")              # length: 3 → ["notebook", "ruler", "eraser"]
        print(len(items))                # 3
        ```

        `.append()` adds one item to the end. `.remove()` deletes the **first occurrence** of the value (not by index). If the value doesn't exist, it raises a `ValueError`.

---

!!! question "Week 1 — Question 6: List Slicing"
    What does this code print?

    ```python
    numbers = [10, 20, 30, 40, 50]
    print(numbers[1:4])
    ```

    * [ ] A) `[10, 20, 30]`
    * [x] B) `[20, 30, 40]`
    * [ ] C) `[20, 30, 40, 50]`
    * [ ] D) `[10, 20, 30, 40]`

    ??? success "Check Answer"
        ✅ **Correct Answer: B) `[20, 30, 40]`**

        `list[start:stop]` returns elements from index `start` up to **but not including** index `stop`.

        ```
        Index:    0    1    2    3    4
        Value:   10   20   30   40   50
        Slice [1:4]  → indices 1, 2, 3 → [20, 30, 40]
        ```

        The stop index is always **excluded** — same rule as `range()`.

        Common slice patterns:
        ```python
        numbers[:3]   # first 3 items → [10, 20, 30]
        numbers[2:]   # from index 2 onward → [30, 40, 50]
        numbers[-2:]  # last 2 items → [40, 50]
        numbers[::2]  # every 2nd item → [10, 30, 50]
        ```

---

!!! question "Week 1 — Question 7: Chained String Methods"
    What does this print?

    ```python
    text = "  hello world  "
    result = text.strip().title()
    print(result)
    ```

    * [x] A) `Hello World`
    * [ ] B) `  Hello World  `
    * [ ] C) `hello world`
    * [ ] D) `HELLO WORLD`

    ??? success "Check Answer"
        ✅ **Correct Answer: A) `Hello World`**

        Method calls chain left-to-right. Each call returns a new string that the next call acts on:

        ```python
        "  hello world  ".strip()   # → "hello world"   (removes leading/trailing spaces)
        "hello world".title()       # → "Hello World"   (capitalises first letter of each word)
        ```

        String methods **never modify the original** — they return new strings. That's why chaining works: `.strip()` returns a string, then `.title()` is called on that returned string.

---

!!! question "Week 1 — Question 8: Step-by-Step Variable Reassignment"
    What does this code print?

    ```python
    x = 5
    x = x + 3
    x = x * 2
    print(x)
    ```

    * [ ] A) `10`
    * [ ] B) `13`
    * [x] C) `16`
    * [ ] D) `8`

    ??? success "Check Answer"
        ✅ **Correct Answer: C) `16`**

        Each line reassigns `x` using its current value:

        ```python
        x = 5          # x is 5
        x = x + 3      # x = 5 + 3 = 8
        x = x * 2      # x = 8 * 2 = 16
        print(x)       # 16
        ```

        The right-hand side is always evaluated **first**, using the current value of `x`, then the result is stored back into `x`. There is no "memory" of the previous values.

---

!!! question "Week 1 — Question 9: The .pop() Method"
    What does this print?

    ```python
    colours = ["red", "green", "blue", "yellow"]
    removed = colours.pop(1)
    print(removed)
    print(colours)
    ```

    * [ ] A) `red` / `["green", "blue", "yellow"]`
    * [x] B) `green` / `["red", "blue", "yellow"]`
    * [ ] C) `blue` / `["red", "green", "yellow"]`
    * [ ] D) `yellow` / `["red", "green", "blue"]`

    ??? success "Check Answer"
        ✅ **Correct Answer: B) `green` / `["red", "blue", "yellow"]`**

        `.pop(index)` does two things at once: it **removes** the item at the given index and **returns** it.

        ```python
        colours = ["red", "green", "blue", "yellow"]
        #  index:    0       1       2       3
        removed = colours.pop(1)   # removes index 1 → "green"
        ```

        After the pop, `colours` is `["red", "blue", "yellow"]` and `removed` holds `"green"`.

        With no argument, `.pop()` removes and returns the **last** item:
        ```python
        colours.pop()   # returns "yellow", list shrinks by one
        ```

---

!!! question "Week 1 — Question 10: F-string Number Formatting"
    What does this print?

    ```python
    price = 9.5
    quantity = 3
    print(f"Total: £{price * quantity:.2f}")
    ```

    * [ ] A) `Total: £28.5`
    * [x] B) `Total: £28.50`
    * [ ] C) `Total: £{price * quantity:.2f}`
    * [ ] D) `TypeError: can't use arithmetic in f-strings`

    ??? success "Check Answer"
        ✅ **Correct Answer: B) `Total: £28.50`**

        The `:.2f` format specifier means: format as a **float** with exactly **2 decimal places**.

        ```python
        price * quantity  →  9.5 * 3  →  28.5
        f"{28.5:.2f}"     →  "28.50"   (trailing zero is added)
        ```

        Useful formatting specifiers:
        ```python
        f"{3.14159:.2f}"   # "3.14"   — 2 decimal places
        f"{1000:.0f}"      # "1000"   — no decimal places
        f"{0.75:.1%}"      # "75.0%"  — percentage
        f"{42:05d}"        # "00042"  — zero-padded integer
        ```

        The `:.2f` pattern is essential for displaying prices, scores, and measurements cleanly.
