# Week 12 Quiz — Error Handling & Logging

---

!!! question "Week 12 — Question 1: try / except / finally"
    What does the `finally` block guarantee?

    ```python
    def read_file(path):
        f = open(path)
        try:
            return f.read()
        except FileNotFoundError:
            return "File not found"
        finally:
            print("Closing file")
            f.close()
    ```

    * [ ] A) It runs only if an exception occurred
    * [ ] B) It runs only if no exception occurred
    * [x] C) It runs regardless of whether an exception occurred or not
    * [ ] D) It runs only if the `return` statement executed

    ??? success "Check Answer"
        ✅ **Correct Answer: C) It always runs — exception or not**

        `finally` is used for **cleanup code** that must run no matter what:

        ```python
        try:
            result = risky_operation()
        except ValueError as e:
            print(f"Error: {e}")
        finally:
            close_connection()   # always runs
            release_lock()       # always runs
        ```

        This is why the `with` statement exists — `with open(...)` is equivalent to a try/finally that closes the file. Prefer `with` for file handling over manual `close()`.

---

!!! question "Week 12 — Question 2: Multiple except Clauses"
    A function might raise a `KeyError` or a `TypeError`. How do you handle both with specific messages?

    * [ ] A) `except KeyError or TypeError:`
    * [ ] B) `except (KeyError, TypeError):` with one message for both
    * [x] C) Two separate `except` clauses — one for `KeyError`, one for `TypeError`
    * [ ] D) `except Exception:` catches everything — no need to be specific

    ??? success "Check Answer"
        ✅ **Correct Answer: C) Separate `except` clauses for specific handling**

        ```python
        try:
            result = process(data)
        except KeyError as e:
            print(f"Missing key: {e}")
        except TypeError as e:
            print(f"Wrong type: {e}")
        except Exception as e:
            print(f"Unexpected error: {e}")   # catch-all fallback
        ```

        You CAN group them: `except (KeyError, TypeError) as e:` — useful when the handling is identical. But separate clauses let you give different error messages and take different actions.

        Always order from **most specific** to **most general** — `except Exception` last, or it catches everything before the specific clauses get a chance.

---

!!! question "Week 12 — Question 3: Raising Exceptions"
    When should you use `raise`?

    ```python
    def set_age(age):
        if age < 0:
            raise ValueError(f"Age cannot be negative: {age}")
        return age
    ```

    * [ ] A) Only in test functions
    * [x] B) When your code detects an invalid state that the caller should handle — raising gives a clear, early error message
    * [ ] C) Only when re-raising a caught exception
    * [ ] D) `raise` is deprecated — use `return None` instead

    ??? success "Check Answer"
        ✅ **Correct Answer: B) When your code detects an invalid state the caller should fix**

        Without `raise`, a negative age would silently propagate through the system and cause a confusing error much later. Raising immediately pinpoints the problem:

        ```python
        try:
            set_age(-5)
        except ValueError as e:
            print(e)   # "Age cannot be negative: -5"
        ```

        **Raise when:** an input is invalid, a precondition is violated, or an operation cannot succeed.

        **Don't raise when:** it's normal for a value to be absent (return `None` instead).

---

!!! question "Week 12 — Question 4: Custom Exceptions"
    How do you create a custom exception class?

    * [ ] A) `def InvalidAgeError(msg): raise Exception(msg)`
    * [x] B) `class InvalidAgeError(Exception): pass`
    * [ ] C) `InvalidAgeError = type("InvalidAgeError", (Exception,), {})`
    * [ ] D) You cannot create custom exceptions in Python

    ??? success "Check Answer"
        ✅ **Correct Answer: B) `class InvalidAgeError(Exception): pass`**

        Inheriting from `Exception` (or any built-in exception) gives your custom class all exception behaviour for free:

        ```python
        class InvalidAgeError(ValueError):
            pass

        class DatabaseError(Exception):
            def __init__(self, message, query=None):
                super().__init__(message)
                self.query = query

        raise InvalidAgeError("Age must be between 0 and 150")
        ```

        Custom exceptions make code self-documenting — `except InvalidAgeError` is clearer than `except ValueError`. They also let callers catch only your specific errors without catching unrelated ones.

---

!!! question "Week 12 — Question 5: Logging Levels"
    What is the correct order of logging levels from least to most severe?

    * [ ] A) `INFO → DEBUG → WARNING → ERROR → CRITICAL`
    * [x] B) `DEBUG → INFO → WARNING → ERROR → CRITICAL`
    * [ ] C) `DEBUG → WARNING → INFO → ERROR → CRITICAL`
    * [ ] D) `INFO → WARNING → DEBUG → ERROR → CRITICAL`

    ??? success "Check Answer"
        ✅ **Correct Answer: B) `DEBUG → INFO → WARNING → ERROR → CRITICAL`**

        | Level | Numeric | Use for |
        |-------|---------|---------|
        | `DEBUG` | 10 | Detailed diagnostic info (dev only) |
        | `INFO` | 20 | Normal operation milestones |
        | `WARNING` | 30 | Something unexpected, but still running |
        | `ERROR` | 40 | A serious problem — function failed |
        | `CRITICAL` | 50 | System is about to crash or stop |

        Setting `level=logging.WARNING` in `basicConfig` means only `WARNING`, `ERROR`, and `CRITICAL` messages appear — `DEBUG` and `INFO` are silenced. This is how you control verbosity without changing code.

---

!!! question "Week 12 — Question 6: Logging to a File"
    How do you configure the logging module to write to a file AND the terminal simultaneously?

    * [ ] A) Call `logging.basicConfig()` twice — once with `filename=`, once without
    * [x] B) Use `handlers=[logging.FileHandler(...), logging.StreamHandler()]` in `basicConfig`
    * [ ] C) `logging.setFile("app.log")` — there is a built-in method for this
    * [ ] D) You can only log to one destination at a time

    ??? success "Check Answer"
        ✅ **Correct Answer: B) Use the `handlers` list in `basicConfig`**

        ```python
        import logging

        logging.basicConfig(
            level=logging.INFO,
            format="%(asctime)s — %(levelname)s — %(message)s",
            handlers=[
                logging.FileHandler("app.log"),    # write to file
                logging.StreamHandler()            # also print to terminal
            ]
        )

        logging.info("Pipeline started")
        ```

        **Important:** `basicConfig()` only takes effect **once** — the first call wins. Call it at the top of your script before any `logging.*` calls.

---

!!! question "Week 12 — Question 7: Exception Chaining with raise from"
    What does `raise RuntimeError("Pipeline failed") from e` do?

    ```python
    try:
        connect_to_database()
    except ConnectionError as e:
        raise RuntimeError("Pipeline failed") from e
    ```

    * [ ] A) Silences the original `ConnectionError` and raises only `RuntimeError`
    * [x] B) Raises `RuntimeError` and attaches the original `ConnectionError` as context, showing both in the traceback
    * [ ] C) Converts the `ConnectionError` into a `RuntimeError` with the same message
    * [ ] D) `raise ... from ...` is a syntax error in Python 3

    ??? success "Check Answer"
        ✅ **Correct Answer: B) Raises the new exception and preserves the original as context**

        ```python
        RuntimeError: Pipeline failed

        The above exception was the direct cause of the following exception:

        ConnectionError: Could not reach database at localhost:5432
        ```

        This is **exception chaining** — you wrap a low-level error with a higher-level one that makes more sense to the caller, without losing the original cause. Invaluable for debugging.

        Use `raise NewError from e` when you want to translate errors.
        Use `raise NewError from None` to suppress the original (not recommended except in libraries).

---

!!! question "Week 12 — Question 8: assert Statement"
    When is it appropriate to use `assert`?

    ```python
    def calculate_average(numbers):
        assert len(numbers) > 0, "List cannot be empty"
        return sum(numbers) / len(numbers)
    ```

    * [ ] A) For all input validation — `assert` is the preferred way to validate user input
    * [x] B) For internal sanity checks during development — not for validating external/user input
    * [ ] C) `assert` is exactly the same as `if ... raise ValueError`
    * [ ] D) `assert` only works in test files

    ??? success "Check Answer"
        ✅ **Correct Answer: B) For internal sanity checks — not for user input validation**

        `assert` can be disabled globally by running Python with the `-O` (optimize) flag:
        ```bash
        python -O script.py   # assertions are skipped entirely
        ```

        This means asserts are not reliable for security or input validation — use `raise ValueError(...)` for those.

        Use `assert` to verify **your own code's internal logic**: "this list should never be empty at this point." If it is, you have a bug.

        Use `raise` for **expected failure conditions** that could legitimately happen at runtime.

---

!!! question "Week 12 — Question 9: Context Managers and with"
    Why is the `with` statement preferred over manual `open()` / `close()`?

    ```python
    # Option A
    f = open("data.txt")
    data = f.read()
    f.close()

    # Option B
    with open("data.txt") as f:
        data = f.read()
    ```

    * [ ] A) Option B is faster because it reads in chunks
    * [x] B) Option B guarantees the file is closed even if an exception occurs; Option A leaves the file open if `f.read()` raises
    * [ ] C) Option A is the correct way — `with` is for network connections only
    * [ ] D) They are identical — `with` is just syntactic sugar with no practical difference

    ??? success "Check Answer"
        ✅ **Correct Answer: B) `with` guarantees cleanup even on exception**

        In Option A, if `f.read()` raises an exception, `f.close()` never runs — the file handle leaks. In Option B:

        ```python
        with open("data.txt") as f:
            data = f.read()   # if this raises, the file is STILL closed
        ```

        The `with` statement calls `f.__exit__()` automatically — equivalent to a `try/finally` that closes the file. Always use `with open(...)` for file handling.

        Objects that support `with` are called **context managers**. Common examples: files, database connections, locks, network sockets.

---

!!! question "Week 12 — Question 10: Catching and Logging in Production"
    In a production script, which approach is best when an exception occurs in a background task?

    * [ ] A) `pass` — silently ignore all errors
    * [ ] B) `print(str(e))` — print to terminal
    * [x] C) `logging.error(f"Task failed: {e}", exc_info=True)` — log with full traceback
    * [ ] D) `sys.exit(1)` — always stop the program on any error

    ??? success "Check Answer"
        ✅ **Correct Answer: C) Log with `exc_info=True` to capture the full traceback**

        `exc_info=True` tells the logger to include the full exception traceback in the log entry:

        ```python
        try:
            process_batch()
        except Exception as e:
            logging.error(f"Batch processing failed: {e}", exc_info=True)
            # continues — doesn't crash the program
        ```

        The log file then contains the exact line, file, and call stack where the error occurred — essential for diagnosing production failures you can't reproduce locally.

        `pass` hides bugs. `print()` output disappears in production. `sys.exit()` is too aggressive for background tasks. `logging.error(..., exc_info=True)` is the professional standard.
