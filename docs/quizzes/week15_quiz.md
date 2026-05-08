# Week 15 Quiz — Interview Prep & Python Mastery

---

!!! question "Week 15 — Question 1: is vs =="
    What is the difference between `is` and `==`?

    ```python
    a = [1, 2, 3]
    b = [1, 2, 3]
    c = a

    print(a == b)
    print(a is b)
    print(a is c)
    ```

    * [x] A) `True` / `False` / `True`
    * [ ] B) `True` / `True` / `True`
    * [ ] C) `False` / `False` / `True`
    * [ ] D) `True` / `False` / `False`

    ??? success "Check Answer"
        ✅ **Correct Answer: A) `True` / `False` / `True`**

        | Operator | Checks | Result for `a` and `b` |
        |----------|--------|------------------------|
        | `==` | Value equality — do they contain the same data? | `True` (same contents) |
        | `is` | Identity — are they the **same object in memory**? | `False` (`a` and `b` are different objects) |

        `c = a` makes `c` point to the **same object** as `a`, so `a is c` is `True`.

        **Interview tip:** always use `==` for value comparison. Use `is` only for `None` checks: `if value is None:` (not `if value == None:`).

---

!!! question "Week 15 — Question 2: Mutable vs Immutable"
    Which of these is mutable in Python?

    * [ ] A) `str`, `int`, `float`, `tuple`
    * [x] B) `list`, `dict`, `set`
    * [ ] C) `str`, `list`, `dict`
    * [ ] D) `tuple`, `frozenset`, `bytes`

    ??? success "Check Answer"
        ✅ **Correct Answer: B) `list`, `dict`, `set`**

        **Mutable** = can be changed after creation.
        **Immutable** = cannot be changed — any "modification" creates a new object.

        | Mutable | Immutable |
        |---------|-----------|
        | `list` | `str` |
        | `dict` | `int`, `float` |
        | `set` | `tuple` |
        | `bytearray` | `frozenset`, `bytes` |

        This matters for:
        - **Function arguments** — mutating a list inside a function affects the caller's list
        - **Dictionary keys** — only immutable objects can be dict keys
        - **Default arguments** — never use a mutable as a default parameter

---

!!! question "Week 15 — Question 3: List Comprehension vs Generator"
    What is the key difference between `[x**2 for x in range(1000)]` and `(x**2 for x in range(1000))`?

    * [ ] A) The parentheses version is faster because it uses parallelism
    * [x] B) The list stores all 1000 values in memory immediately; the generator computes each value on demand (lazy evaluation)
    * [ ] C) They are identical — Python automatically converts lists to generators for efficiency
    * [ ] D) The generator raises a `StopIteration` error after the first value

    ??? success "Check Answer"
        ✅ **Correct Answer: B) List is eager (all in memory); generator is lazy (one at a time)**

        ```python
        squares_list = [x**2 for x in range(1_000_000)]   # 8 MB in memory NOW
        squares_gen  = (x**2 for x in range(1_000_000))   # ~200 bytes — computes as needed
        ```

        Use generators when:
        - The dataset is large and you only need to iterate once
        - You're processing a stream of data (file lines, API pages)

        Use lists when:
        - You need random access (index into it)
        - You need `len()`
        - You need to iterate multiple times

---

!!! question "Week 15 — Question 4: Time Complexity — Big O"
    Which operation has O(1) time complexity (constant time) on a Python list?

    * [ ] A) Searching for a value: `5 in my_list`
    * [ ] B) Inserting at the beginning: `my_list.insert(0, x)`
    * [x] C) Accessing by index: `my_list[99]`
    * [ ] D) Sorting: `my_list.sort()`

    ??? success "Check Answer"
        ✅ **Correct Answer: C) Accessing by index — O(1)**

        Python lists are backed by arrays, so index access goes directly to the memory location — always the same speed regardless of list size.

        | Operation | Time Complexity | Why |
        |-----------|----------------|-----|
        | `list[i]` | O(1) | Direct memory address |
        | `x in list` | O(n) | Must check each element |
        | `list.append(x)` | O(1) amortised | Adds to end |
        | `list.insert(0, x)` | O(n) | Must shift every element |
        | `list.sort()` | O(n log n) | Timsort algorithm |
        | `x in set` | O(1) | Hash table lookup |

        **Interview tip:** if you need fast membership testing, use a `set` instead of a `list`.

---

!!! question "Week 15 — Question 5: Decorators"
    What does a decorator do?

    ```python
    import time

    def timer(func):
        def wrapper(*args, **kwargs):
            start = time.time()
            result = func(*args, **kwargs)
            print(f"{func.__name__} took {time.time() - start:.2f}s")
            return result
        return wrapper

    @timer
    def slow_function():
        time.sleep(1)

    slow_function()
    ```

    * [ ] A) `@timer` is a comment — it has no effect on the function
    * [x] B) `@timer` wraps `slow_function` — calling `slow_function()` now runs `timer(slow_function)()`
    * [ ] C) `@timer` adds `slow_function` to a global registry of timed functions
    * [ ] D) `@timer` raises a `SyntaxError` — decorators can only be used on classes

    ??? success "Check Answer"
        ✅ **Correct Answer: B) `@timer` wraps the function — it replaces `slow_function` with `wrapper`**

        `@timer` is syntactic sugar for:
        ```python
        slow_function = timer(slow_function)
        ```

        Every call to `slow_function()` now calls `wrapper()`, which:
        1. Records the start time
        2. Calls the original function
        3. Prints the elapsed time
        4. Returns the result

        Decorators are used in real code for: timing, logging, authentication checks, caching (`@functools.lru_cache`), and retry logic.

---

!!! question "Week 15 — Question 6: The STAR Interview Method"
    When answering "Tell me about a project you built" — what does STAR stand for?

    * [ ] A) Skills, Technologies, Achievements, Results
    * [x] B) Situation, Task, Action, Result
    * [ ] C) Scope, Timeline, Approach, Review
    * [ ] D) Solution, Testing, Analysis, Reflection

    ??? success "Check Answer"
        ✅ **Correct Answer: B) Situation, Task, Action, Result**

        STAR gives your answer structure:

        - **Situation** — what was the context? (e.g., "I was taking a Python bootcamp and we needed to automate a manual data process")
        - **Task** — what was your responsibility? ("My task was to build a pipeline that emails weekly sales reports automatically")
        - **Action** — what did YOU specifically do? ("I used pandas to process CSV data, smtplib to send formatted HTML emails, and added error logging")
        - **Result** — what was the outcome? ("The pipeline saved 3 hours per week and caught two data quality issues in its first month")

        **Tip:** prepare 3-5 STAR stories from your 16-week bootcamp projects before interviews.

---

!!! question "Week 15 — Question 7: Python's GIL"
    What is the Global Interpreter Lock (GIL)?

    * [ ] A) A security feature that prevents unauthorised code from running
    * [x] B) A mutex in CPython that allows only one thread to execute Python bytecode at a time — limiting true parallelism for CPU-bound tasks
    * [ ] C) A lock that prevents multiple users from accessing the same file
    * [ ] D) A feature that speeds up Python by pre-compiling code

    ??? success "Check Answer"
        ✅ **Correct Answer: B) A mutex allowing only one thread to run Python bytecode at a time**

        The GIL means:
        - **CPU-bound** tasks (heavy computation): threading doesn't help — use `multiprocessing`
        - **I/O-bound** tasks (network calls, file reads): threading works well — threads release the GIL while waiting

        ```python
        # I/O-bound — threading is fine
        import threading
        threads = [threading.Thread(target=fetch_url, args=(url,)) for url in urls]

        # CPU-bound — use multiprocessing instead
        from multiprocessing import Pool
        with Pool() as p:
            results = p.map(heavy_compute, data_chunks)
        ```

        The GIL is an **interview favourite** — mention it shows you understand Python internals.

---

!!! question "Week 15 — Question 8: Debugging Strategy"
    A function returns the wrong answer. In what order should you debug?

    * [ ] A) Delete the function and rewrite it from scratch
    * [x] B) Add print statements / use a debugger to trace values at each step; identify where the actual value diverges from the expected value
    * [ ] C) Search Stack Overflow for the exact error message
    * [ ] D) Run the code 5 more times in case it's a random error

    ??? success "Check Answer"
        ✅ **Correct Answer: B) Trace values systematically to find where they diverge**

        The scientific method for debugging:

        1. **Reproduce** the bug with a specific input
        2. **Hypothesise** where the bug might be
        3. **Inspect** — add `print()` statements or use `breakpoint()` to check values at each step
        4. **Isolate** the exact line where the actual value differs from expected
        5. **Fix** and verify

        ```python
        def calculate(x, y):
            print(f"x={x}, y={y}")        # inspect inputs
            result = x * y + x
            print(f"result={result}")      # inspect output
            return result
        ```

        Or use Python's built-in debugger:
        ```python
        breakpoint()   # drops you into pdb at this line
        ```

---

!!! question "Week 15 — Question 9: What can you say in an interview?"
    After completing this 16-week bootcamp, which statement is most accurate for a job interview?

    * [ ] A) "I know Python but haven't built anything real yet"
    * [ ] B) "I can write Python scripts but only with help from tutorials"
    * [x] C) "I've built 16 Python projects including automation pipelines, a web scraper, a data analysis tool, and an email system — I'm comfortable reading documentation and learning new libraries"
    * [ ] D) "I'm an expert Python developer ready for any senior role"

    ??? success "Check Answer"
        ✅ **Correct Answer: C) Honest, specific, evidence-based**

        Option A undersells you — you have real projects.
        Option B is vague and sounds uncertain.
        Option C is **specific** (names real skills), **honest** (doesn't overclaim), and **forward-looking** (shows you can keep learning).
        Option D overclaims — "expert" invites deep technical questions you may not be ready for.

        The strongest interview answers combine:
        - Concrete projects you built and can discuss in detail
        - Specific technologies and why you chose them
        - Honest acknowledgement of what you're still learning
        - Enthusiasm for the next challenge

---

!!! question "Week 15 — Question 10: What to do when you're stuck"
    During a technical interview, you don't immediately know how to solve the problem. What is the best approach?

    * [ ] A) Say "I don't know" and wait for hints
    * [ ] B) Write code immediately, even if you're not sure it's correct
    * [x] C) Think out loud — explain your approach, what you know, what you'd look up, and work through it step by step
    * [ ] D) Ask the interviewer to move on to the next question

    ??? success "Check Answer"
        ✅ **Correct Answer: C) Think out loud and work through it systematically**

        Interviewers care more about **how you think** than whether you have the answer memorised. Thinking out loud shows:
        - Problem-solving process
        - Ability to break a problem into steps
        - Communication skills
        - Self-awareness about what you know and don't know

        A great response when stuck:
        > *"I'd start by breaking this into smaller parts. The first thing I'd need is... I'm not sure of the exact syntax for X, but I know the pattern — I'd search for 'python X documentation'. My approach would be..."*

        Employers hire people who can **figure things out**, not people who already know everything.
