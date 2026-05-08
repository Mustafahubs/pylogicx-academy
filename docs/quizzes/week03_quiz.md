# Week 3 Quiz — Loops, Loop Control & the os Module

---

!!! question "Week 3 — Question 1: range() Boundaries"
    What does this code print?

    ```python
    for i in range(2, 8, 2):
        print(i, end=" ")
    ```

    * [ ] A) `2 4 6 8`
    * [x] B) `2 4 6`
    * [ ] C) `0 2 4 6`
    * [ ] D) `2 3 4 5 6 7`

    ??? success "Check Answer"
        ✅ **Correct Answer: B) `2 4 6`**

        `range(start, stop, step)` generates numbers **starting at `start`, up to but NOT including `stop`, jumping by `step`**.

        ```
        range(2, 8, 2) → 2, 4, 6    (8 is excluded)
        ```

        The stop value is **always excluded**. This is one of the most consistent beginner traps.

        | `range(...)` | Values produced |
        |-------------|----------------|
        | `range(5)` | 0 1 2 3 4 |
        | `range(1, 5)` | 1 2 3 4 |
        | `range(1, 10, 3)` | 1 4 7 |
        | `range(5, 0, -1)` | 5 4 3 2 1 |

---

!!! question "Week 3 — Question 2: continue vs break"
    What does this code print?

    ```python
    for i in range(1, 7):
        if i % 2 == 0:
            continue
        if i == 5:
            break
        print(i, end=" ")
    ```

    * [ ] A) `1 3 5`
    * [x] B) `1 3`
    * [ ] C) `2 4 6`
    * [ ] D) `1 2 3 4`

    ??? success "Check Answer"
        ✅ **Correct Answer: B) `1 3`**

        Trace through each value of `i`:

        | `i` | `i % 2 == 0`? | `i == 5`? | Action |
        |-----|--------------|---------|--------|
        | 1 | False | False | print `1` |
        | 2 | True | — | `continue` (skip to next) |
        | 3 | False | False | print `3` |
        | 4 | True | — | `continue` (skip to next) |
        | 5 | False | True | `break` (exit loop entirely) |

        `continue` skips the rest of the current iteration. `break` exits the entire loop immediately. Since `i == 5` triggers `break` before `print(i)` is reached, `5` is never printed.

---

!!! question "Week 3 — Question 3: while Loop with a Counter"
    How many times does `"Hello"` print?

    ```python
    count = 10
    while count > 0:
        print("Hello")
        count -= 3
    ```

    * [ ] A) `10`
    * [x] B) `4`
    * [ ] C) `3`
    * [ ] D) Infinite loop — it never stops

    ??? success "Check Answer"
        ✅ **Correct Answer: B) `4`**

        Trace the value of `count` at the start of each iteration:

        | Iteration | `count` at start | `count > 0`? | Prints? | `count` after |
        |-----------|-----------------|-------------|---------|--------------|
        | 1 | 10 | True ✅ | Yes | 7 |
        | 2 | 7 | True ✅ | Yes | 4 |
        | 3 | 4 | True ✅ | Yes | 1 |
        | 4 | 1 | True ✅ | Yes | -2 |
        | 5 | -2 | False ❌ | — | loop ends |

        `"Hello"` is printed **4 times**. The loop stops when `count` drops below zero, not exactly when it equals zero.

---

!!! question "Week 3 — Question 4: Loop Variable After the Loop"
    What does this print?

    ```python
    for letter in ["X", "Y", "Z"]:
        pass

    print(letter)
    ```

    * [ ] A) `X`
    * [ ] B) `None`
    * [x] C) `Z`
    * [ ] D) `NameError: name 'letter' is not defined`

    ??? success "Check Answer"
        ✅ **Correct Answer: C) `Z`**

        In Python, the loop variable **persists after the loop ends** and holds the last value it was assigned. Here, the loop ran `X → Y → Z`, so `letter` is `"Z"` when the loop finishes.

        This is different from some other languages where the loop variable is scoped to the loop body. In Python, it leaks out.

        `pass` is a do-nothing placeholder — it lets the loop body be syntactically valid without doing anything.

        ```python
        # Practical use: find the last item in a filtered loop
        for name in ["Alice", "Bob", "Carol"]:
            if len(name) > 3:
                last_long_name = name

        print(last_long_name)  # Carol
        ```

---

!!! question "Week 3 — Question 5: os.rename — Missing File"
    A student writes a script to rename a file. What happens when they run it if `"report_old.txt"` does not exist in the folder?

    ```python
    import os
    os.rename("report_old.txt", "report_new.txt")
    print("File renamed successfully.")
    ```

    * [ ] A) It silently creates an empty file called `"report_new.txt"`
    * [ ] B) It does nothing and prints `"File renamed successfully."`
    * [x] C) `FileNotFoundError: [Errno 2] No such file or directory: 'report_old.txt'`
    * [ ] D) `NameError: name 'report_old.txt' is not defined`

    ??? success "Check Answer"
        ✅ **Correct Answer: C) `FileNotFoundError: [Errno 2] No such file or directory: 'report_old.txt'`**

        `os.rename()` requires the source file to **actually exist** on disk. It has no way to create a file that isn't there.

        In real scripts — like our Bulk File Renamer — you should always guard against this:

        ```python
        import os

        old_name = "report_old.txt"
        new_name = "report_new.txt"

        if os.path.exists(old_name):
            os.rename(old_name, new_name)
            print(f"Renamed to {new_name}")
        else:
            print(f"File not found: {old_name}")
        ```

        `os.path.exists()` checks for the file before attempting the rename — this is the safe pattern.

---

!!! question "Week 3 — Question 6: enumerate()"
    What does this print?

    ```python
    fruits = ["apple", "banana", "cherry"]

    for i, fruit in enumerate(fruits, start=1):
        print(f"{i}. {fruit}")
    ```

    * [ ] A) `0. apple` / `1. banana` / `2. cherry`
    * [x] B) `1. apple` / `2. banana` / `3. cherry`
    * [ ] C) `apple 0` / `banana 1` / `cherry 2`
    * [ ] D) `TypeError: enumerate() takes 1 argument`

    ??? success "Check Answer"
        ✅ **Correct Answer: B) `1. apple` / `2. banana` / `3. cherry`**

        `enumerate(iterable, start=0)` produces `(index, value)` pairs. The `start` keyword sets the first index value.

        ```python
        enumerate(fruits)           # → (0,"apple"), (1,"banana"), (2,"cherry")
        enumerate(fruits, start=1)  # → (1,"apple"), (2,"banana"), (3,"cherry")
        ```

        Without `enumerate`, you'd need a separate counter variable. `enumerate` is cleaner:
        ```python
        # Old way
        i = 1
        for fruit in fruits:
            print(f"{i}. {fruit}")
            i += 1

        # Pythonic way
        for i, fruit in enumerate(fruits, start=1):
            print(f"{i}. {fruit}")
        ```

---

!!! question "Week 3 — Question 7: Nested Loop Count"
    How many times does `"*"` get printed in total?

    ```python
    for row in range(3):
        for col in range(4):
            print("*", end="")
        print()
    ```

    * [ ] A) `7`
    * [ ] B) `9`
    * [x] C) `12`
    * [ ] D) `3`

    ??? success "Check Answer"
        ✅ **Correct Answer: C) `12`**

        The outer loop runs **3 times** (row = 0, 1, 2).
        For each outer iteration, the inner loop runs **4 times** (col = 0, 1, 2, 3).

        Total prints of `"*"` = 3 × 4 = **12**

        The `print()` at the end of the outer loop just adds a newline after each row. Output looks like:
        ```
        ****
        ****
        ****
        ```

        Nested loops multiply: **outer iterations × inner iterations = total inner executions**. This pattern creates tables, grids, and multiplication tables.

---

!!! question "Week 3 — Question 8: zip()"
    What does this print?

    ```python
    names = ["Alice", "Bob", "Carol"]
    scores = [88, 95, 72]

    for name, score in zip(names, scores):
        print(f"{name}: {score}")
    ```

    * [x] A) `Alice: 88` / `Bob: 95` / `Carol: 72`
    * [ ] B) `["Alice", "Bob", "Carol"]: [88, 95, 72]`
    * [ ] C) `TypeError: zip requires same-length lists`
    * [ ] D) `Alice: 72` / `Bob: 95` / `Carol: 88`

    ??? success "Check Answer"
        ✅ **Correct Answer: A) `Alice: 88` / `Bob: 95` / `Carol: 72`**

        `zip()` pairs up items from two (or more) iterables by position:

        ```python
        zip(["Alice","Bob","Carol"], [88, 95, 72])
        # → ("Alice", 88), ("Bob", 95), ("Carol", 72)
        ```

        If the lists have different lengths, `zip` stops at the **shortest** — no error is raised.

        `zip` is ideal when you have parallel lists that logically belong together. The alternative — using index-based access — is error-prone and harder to read:
        ```python
        # Fragile
        for i in range(len(names)):
            print(f"{names[i]}: {scores[i]}")
        ```

---

!!! question "Week 3 — Question 9: while Loop with break"
    What is the final value of `total` when this code finishes?

    ```python
    total = 0
    numbers = [4, 7, 2, 9, 1, 5]

    for n in numbers:
        if n == 9:
            break
        total += n

    print(total)
    ```

    * [ ] A) `28` (sum of all numbers)
    * [x] B) `13`
    * [ ] C) `9`
    * [ ] D) `22`

    ??? success "Check Answer"
        ✅ **Correct Answer: B) `13`**

        The loop adds each number to `total` until it hits `9`, at which point `break` exits immediately — **without** adding `9`.

        ```python
        n = 4  → total = 0 + 4 = 4
        n = 7  → total = 4 + 7 = 11
        n = 2  → total = 11 + 2 = 13
        n = 9  → break (13 is not changed, 9 is not added)
        ```

        The final total is `13`. The numbers after `9` (`1`, `5`) are also never processed.

        `break` is useful when searching: once you've found what you're looking for, stop early and save time.

---

!!! question "Week 3 — Question 10: os.listdir() and File Filtering"
    A folder contains these files: `notes.txt`, `photo.jpg`, `data.csv`, `backup.txt`, `image.png`.
    What does this code print?

    ```python
    import os

    files = os.listdir(".")
    txt_files = [f for f in files if f.endswith(".txt")]
    print(len(txt_files))
    ```

    Assume `os.listdir(".")` returns exactly those 5 files.

    * [ ] A) `5`
    * [x] B) `2`
    * [ ] C) `3`
    * [ ] D) `1`

    ??? success "Check Answer"
        ✅ **Correct Answer: B) `2`**

        `.endswith(".txt")` returns `True` only for filenames that end with `.txt`:

        | File | Ends with `.txt`? |
        |------|-----------------|
        | `notes.txt` | ✅ Yes |
        | `photo.jpg` | ❌ No |
        | `data.csv` | ❌ No |
        | `backup.txt` | ✅ Yes |
        | `image.png` | ❌ No |

        The list comprehension keeps only the 2 `.txt` files. `len(txt_files)` is `2`.

        This is a core pattern from our Bulk File Renamer project:
        ```python
        for filename in os.listdir(folder):
            if filename.endswith(".txt"):
                # process only text files
        ```
