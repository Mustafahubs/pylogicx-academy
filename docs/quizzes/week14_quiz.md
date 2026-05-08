# Week 14 Quiz — Code Quality, Refactoring & Documentation

---

!!! question "Week 14 — Question 1: The DRY Principle"
    DRY stands for "Don't Repeat Yourself." Which code violates DRY?

    * [ ] A) A function called `calculate_tax(price)` used in 3 places
    * [x] B) The same 10-line calculation copy-pasted in 3 different functions
    * [ ] C) A loop that iterates over 100 items
    * [ ] D) A variable used in multiple functions

    ??? success "Check Answer"
        ✅ **Correct Answer: B) Copy-pasted logic in multiple places**

        When the same logic exists in 3 places, you have 3 places to update when it changes — and 3 places where bugs can diverge. DRY says: extract the logic into one function.

        ```python
        # ❌ DRY violation
        def process_order(price):
            tax = price * 0.2
            total = price + tax
            # ... 8 more lines

        def process_return(price):
            tax = price * 0.2     # same calculation
            total = price + tax
            # ... 8 more lines

        # ✅ DRY — extract to a function
        def calculate_total(price):
            tax = price * 0.2
            return price + tax

        def process_order(price):
            total = calculate_total(price)

        def process_return(price):
            total = calculate_total(price)
        ```

---

!!! question "Week 14 — Question 2: Magic Numbers"
    Which code has a "magic number" problem?

    * [x] A) `if score >= 80:` with no explanation of what 80 means
    * [ ] B) `MAX_SCORE = 100` used throughout the code
    * [ ] C) `for i in range(len(items)):`
    * [ ] D) `radius = float(input("Enter radius: "))`

    ??? success "Check Answer"
        ✅ **Correct Answer: A) Bare numeric literals with unclear meaning**

        A **magic number** is a numeric literal in code whose meaning is not obvious:

        ```python
        # ❌ Magic numbers — what does 80 mean? Why 3? Why 1440?
        if score >= 80:
            status = "pass"
        if retries > 3:
            abort()
        minutes = seconds / 60 * 24  # 1440 minutes in a day

        # ✅ Named constants — meaning is clear
        PASS_THRESHOLD = 80
        MAX_RETRIES = 3
        MINUTES_PER_DAY = 1440

        if score >= PASS_THRESHOLD:
            status = "pass"
        ```

        Named constants make the code self-documenting and give you one place to update the value.

---

!!! question "Week 14 — Question 3: Function Naming"
    Which function name best describes what it does?

    * [ ] A) `def f(x):`
    * [ ] B) `def process(data):`
    * [ ] C) `def doTheThingWithTheFile(path):`
    * [x] D) `def extract_email_addresses(text):`

    ??? success "Check Answer"
        ✅ **Correct Answer: D) `def extract_email_addresses(text):`**

        Good function names:
        - Use a **verb** describing the action (`extract`, `calculate`, `validate`, `send`)
        - Are **specific** about what they do and what they work on
        - Make the code read like English when called: `emails = extract_email_addresses(body)`

        | Name | Problem |
        |------|---------|
        | `f(x)` | Meaningless — gives no information |
        | `process(data)` | Too vague — process how? What data? |
        | `doTheThingWithTheFile` | CamelCase + vague — what "thing"? |
        | `extract_email_addresses` | Clear verb + noun, snake_case ✅ |

---

!!! question "Week 14 — Question 4: Single Responsibility Principle"
    A function `send_report()` reads a CSV, calculates statistics, generates HTML, and sends an email. What principle does it violate?

    * [ ] A) DRY — it repeats itself
    * [x] B) Single Responsibility Principle — one function should do one thing
    * [ ] C) Open/Closed Principle — it's not open for extension
    * [ ] D) Nothing — combining tasks in one function is fine

    ??? success "Check Answer"
        ✅ **Correct Answer: B) Single Responsibility Principle (SRP)**

        SRP: a function/class should have **one reason to change**. `send_report()` has four reasons.

        Refactored:
        ```python
        def load_data(filepath):
            ...

        def calculate_stats(df):
            ...

        def generate_html_report(stats):
            ...

        def send_email(recipient, html):
            ...

        def run_pipeline():
            df    = load_data("sales.csv")
            stats = calculate_stats(df)
            html  = generate_html_report(stats)
            send_email("manager@company.com", html)
        ```

        Each function is now individually testable, reusable, and easy to swap out.

---

!!! question "Week 14 — Question 5: Docstrings"
    What is a docstring, and where does it go?

    ```python
    def calculate_bmi(weight_kg, height_m):
        """Calculate Body Mass Index (BMI).

        Args:
            weight_kg: Weight in kilograms.
            height_m: Height in metres.

        Returns:
            float: BMI value rounded to 1 decimal place.
        """
        return round(weight_kg / height_m ** 2, 1)
    ```

    * [ ] A) A comment that Python ignores completely
    * [x] B) A string literal immediately after a `def`/`class` — Python stores it as `__doc__` and tools like `help()` display it
    * [ ] C) A type hint for the return value
    * [ ] D) A decorator that adds documentation to the function

    ??? success "Check Answer"
        ✅ **Correct Answer: B) A string literal stored as `__doc__`, used by `help()` and IDEs**

        ```python
        help(calculate_bmi)       # displays the docstring in terminal
        calculate_bmi.__doc__     # access the string directly
        ```

        Docstrings are read by:
        - `help()` in the Python REPL
        - IDE autocomplete (the tooltip that appears as you type)
        - Documentation generators (Sphinx, mkdocstrings)

        **When to write a docstring:** any public function, class, or module. Skip it for private helpers that are obvious from the code.

---

!!! question "Week 14 — Question 6: Type Hints"
    What do type hints do in Python?

    ```python
    def greet(name: str, times: int = 1) -> str:
        return (f"Hello, {name}! " * times).strip()
    ```

    * [ ] A) They enforce types at runtime — passing an int for `name` raises a TypeError
    * [x] B) They are documentation only — they help IDEs and tools catch errors but Python doesn't enforce them
    * [ ] C) They are required for all functions in Python 3.9+
    * [ ] D) They make the function run faster

    ??? success "Check Answer"
        ✅ **Correct Answer: B) Documentation-only — Python does not enforce them at runtime**

        ```python
        greet(123, "hello")   # Python won't stop you — no TypeError at runtime
        ```

        But tools like `mypy`, `pyright`, and IDEs like VS Code will highlight the error before you run the code.

        Type hints dramatically improve:
        - **Readability** — the signature tells you exactly what types are expected
        - **Autocomplete** — IDEs know what methods are available on `name` (str methods)
        - **Catch bugs early** — static analysis tools find type errors before runtime

        Python's philosophy: "We're all consenting adults." Types are hints, not handcuffs.

---

!!! question "Week 14 — Question 7: List Comprehension Refactoring"
    Which is the more Pythonic way to build a list of squares for even numbers?

    ```python
    # Option A
    squares = []
    for n in range(10):
        if n % 2 == 0:
            squares.append(n ** 2)

    # Option B
    squares = [n ** 2 for n in range(10) if n % 2 == 0]
    ```

    * [ ] A) Option A — explicit loops are always clearer
    * [x] B) Option B — list comprehensions are idiomatic Python for simple transformations with a filter
    * [ ] C) They produce different results
    * [ ] D) Option B raises a `SyntaxError`

    ??? success "Check Answer"
        ✅ **Correct Answer: B) Option B — list comprehensions for simple filter+transform**

        Both produce `[0, 4, 16, 36, 64]`. Option B is preferred because:
        - It's one line instead of four
        - The intent is immediately clear: "squares of even numbers from 0-9"
        - It's often faster (CPython optimises comprehensions)

        **When to use a regular loop instead:**
        - The transformation is complex (multi-line logic)
        - You need to `break` or `continue`
        - The comprehension would be hard to read

        Readable always beats clever.

---

!!! question "Week 14 — Question 8: Code Smell — Long Parameter List"
    A function has 8 parameters. What is the best refactoring?

    ```python
    def create_user(first, last, email, phone, city, country, age, role):
        ...
    ```

    * [ ] A) Use `*args` to avoid naming the parameters
    * [x] B) Group related parameters into a dataclass or dictionary, or split into smaller functions
    * [ ] C) Use positional arguments only — keyword arguments are slower
    * [ ] D) Long parameter lists are fine — no refactoring needed

    ??? success "Check Answer"
        ✅ **Correct Answer: B) Group into a class/dataclass or split responsibilities**

        ```python
        from dataclasses import dataclass

        @dataclass
        class User:
            first: str
            last: str
            email: str
            phone: str
            city: str
            country: str
            age: int
            role: str

        def create_user(user: User):
            ...
        ```

        Or split conceptually:
        ```python
        def create_user(user: User, address: Address, role: str):
            ...
        ```

        Long parameter lists are a **code smell** — they usually indicate the function is doing too much, or related data should be grouped.

---

!!! question "Week 14 — Question 9: Good README Sections"
    Which sections does a professional project README need?

    * [ ] A) Author name, favourite IDE, and favourite programming language
    * [x] B) Project description, installation steps, usage example, and project structure
    * [ ] C) Full source code (copy-paste into README)
    * [ ] D) A disclaimer that the code is not production-ready

    ??? success "Check Answer"
        ✅ **Correct Answer: B) Description, installation, usage, structure**

        A good README answers: "What is this? How do I install it? How do I use it?"

        ```markdown
        # Project Name

        One-sentence description of what this does.

        ## Features
        - ...

        ## Installation
        ```bash
        pip install -r requirements.txt
        ```

        ## Usage
        ```python
        from mymodule import process
        process("input.csv")
        ```

        ## Project Structure
        my-project/
        ├── main.py
        ├── utils.py
        └── data/
        ```

        The README is the front door of your project — first impressions matter, especially for interviewers and collaborators.

---

!!! question "Week 14 — Question 10: Refactoring Without Breaking"
    You want to rename a function that is used in 10 places. What is the safest approach?

    * [ ] A) Use Find & Replace in the text editor without checking
    * [x] B) Use your IDE's rename/refactor tool so all usages are updated simultaneously, then run the tests
    * [ ] C) Delete the old function and let the errors show you where it was used
    * [ ] D) Create the new function and keep the old name as an alias permanently

    ??? success "Check Answer"
        ✅ **Correct Answer: B) Use IDE rename tool + run tests**

        Modern IDEs (VS Code, PyCharm) have **Rename Symbol** (F2 or right-click → Rename) that:
        - Finds all usages across all files
        - Renames them all simultaneously
        - Skips strings and comments (avoiding false positives)

        After renaming, run your test suite. If tests pass, the refactor is safe. If you have no tests, this is a strong argument for writing them before refactoring.

        Leaving permanent aliases (Option D) accumulates technical debt — now you maintain two names for the same thing.
