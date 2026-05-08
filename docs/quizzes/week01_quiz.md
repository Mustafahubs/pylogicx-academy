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
