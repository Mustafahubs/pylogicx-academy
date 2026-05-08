# Week 10 Quiz — Automation Pipelines & File Handling

---

!!! question "Week 10 — Question 1: os.makedirs() with exist_ok"
    What does `exist_ok=True` do in `os.makedirs()`?

    ```python
    import os
    os.makedirs("output/reports/2024", exist_ok=True)
    ```

    * [ ] A) Overwrites any existing files in the folder
    * [x] B) Suppresses the error if the directory already exists — creates it only if it doesn't exist yet
    * [ ] C) Creates the folder only if the parent `output/` exists
    * [ ] D) Asks the user for confirmation before creating

    ??? success "Check Answer"
        ✅ **Correct Answer: B) Suppresses the error if the directory already exists**

        Without `exist_ok=True`:
        ```python
        os.makedirs("output")   # FileExistsError if "output" already exists
        ```

        With `exist_ok=True`:
        ```python
        os.makedirs("output", exist_ok=True)   # safe to call repeatedly
        ```

        `os.makedirs()` (note the `s`) also creates **intermediate directories** — if `output/` doesn't exist, it creates `output/` and then `output/reports/` and then `output/reports/2024/` all in one call. This is unlike `os.mkdir()` which only creates one level.

---

!!! question "Week 10 — Question 2: pathlib.Path"
    What is the advantage of `pathlib.Path` over string-based paths?

    ```python
    from pathlib import Path

    base = Path("data")
    report = base / "2024" / "report.csv"
    print(report)
    ```

    * [ ] A) `Path` is faster than strings for file operations
    * [x] B) `Path` uses `/` for joining (works on all OS), has built-in methods, and avoids string concatenation bugs
    * [ ] C) `Path` only works on Linux — use strings on Windows
    * [ ] D) `Path` automatically creates the directories if they don't exist

    ??? success "Check Answer"
        ✅ **Correct Answer: B) `/` operator for joining, built-in methods, cross-platform**

        ```python
        from pathlib import Path

        p = Path("data") / "2024" / "report.csv"
        # → data/2024/report.csv  (Linux/Mac) or data\2024\report.csv (Windows)

        p.exists()      # True/False
        p.suffix        # ".csv"
        p.stem          # "report"
        p.parent        # Path("data/2024")
        p.name          # "report.csv"
        p.read_text()   # read file content
        p.mkdir(parents=True, exist_ok=True)  # create directories
        ```

        String-based paths like `"data/" + "2024/" + "report.csv"` are fragile and break on Windows (`\` vs `/`). `pathlib` handles separators automatically.

---

!!! question "Week 10 — Question 3: glob.glob() Pattern Matching"
    What does this code do?

    ```python
    import glob

    files = glob.glob("data/*.csv")
    print(files)
    ```

    * [x] A) Returns a list of all `.csv` files in the `data/` folder
    * [ ] B) Deletes all `.csv` files in `data/`
    * [ ] C) Renames all `.csv` files in `data/` to `.txt`
    * [ ] D) Returns `True` if any `.csv` file exists in `data/`

    ??? success "Check Answer"
        ✅ **Correct Answer: A) Returns a list of all `.csv` files in the `data/` folder**

        `glob.glob()` uses shell-style wildcards:

        ```python
        glob.glob("data/*.csv")         # all CSVs in data/
        glob.glob("data/**/*.csv", recursive=True)  # CSVs in data/ and subdirectories
        glob.glob("*.py")               # all Python files in current folder
        glob.glob("report_202?.txt")    # ? matches exactly one character
        ```

        It returns a list of matching path strings. If no files match, it returns an empty list (no error).

        `pathlib` equivalent:
        ```python
        list(Path("data").glob("*.csv"))
        ```

---

!!! question "Week 10 — Question 4: shutil.copy() vs shutil.move()"
    What is the difference between `shutil.copy()` and `shutil.move()`?

    * [x] A) `copy()` duplicates the file (original stays); `move()` relocates it (original is gone)
    * [ ] B) `copy()` copies the folder; `move()` copies the file
    * [ ] C) They do the same thing — `move()` is faster
    * [ ] D) `copy()` preserves metadata; `move()` does not

    ??? success "Check Answer"
        ✅ **Correct Answer: A) `copy()` duplicates; `move()` relocates**

        ```python
        import shutil

        shutil.copy("report.csv", "backup/report.csv")  # original stays in current folder
        shutil.move("report.csv", "archive/report.csv") # original is removed from current folder

        shutil.copy2("a.txt", "b.txt")     # copy with metadata (timestamps)
        shutil.copytree("src/", "dst/")    # copy entire directory tree
        shutil.rmtree("old_folder/")       # delete an entire directory (careful!)
        ```

        Use `copy()` when you need a backup. Use `move()` when you're processing and archiving files.

---

!!! question "Week 10 — Question 5: The logging Module"
    What is the advantage of using `logging` over `print()` for pipeline scripts?

    * [ ] A) `logging` is faster than `print()`
    * [x] B) `logging` supports severity levels, timestamps, can write to files, and can be silenced without changing code
    * [ ] C) `print()` doesn't work in automation scripts
    * [ ] D) `logging` is required by the `schedule` library

    ??? success "Check Answer"
        ✅ **Correct Answer: B) Severity levels, timestamps, file output, configurable**

        ```python
        import logging

        logging.basicConfig(
            level=logging.INFO,
            format="%(asctime)s — %(levelname)s — %(message)s",
            handlers=[
                logging.FileHandler("pipeline.log"),
                logging.StreamHandler()   # also print to terminal
            ]
        )

        logging.debug("Detailed diagnostic info")
        logging.info("Pipeline started")
        logging.warning("Missing column — using default")
        logging.error("Failed to read file")
        logging.critical("Database connection lost — stopping")
        ```

        With `print()`, you must delete or comment out every debug line for production. With `logging`, you just change the `level` — `INFO` silences `DEBUG`, `WARNING` silences `INFO`, etc.

---

!!! question "Week 10 — Question 6: if __name__ == '__main__'"
    What does this pattern do?

    ```python
    def run_pipeline():
        print("Running...")

    if __name__ == "__main__":
        run_pipeline()
    ```

    * [ ] A) It makes the script run faster
    * [x] B) It ensures `run_pipeline()` only runs when the file is executed directly, not when it's imported as a module
    * [ ] C) It is required for the `schedule` library to work
    * [ ] D) It prevents the script from running on Windows

    ??? success "Check Answer"
        ✅ **Correct Answer: B) Guards code from running on import**

        When Python imports a file, `__name__` is set to the module name. When run directly, `__name__` is `"__main__"`.

        ```python
        # Without the guard:
        import pipeline_script   # runs everything in the file — BAD

        # With the guard:
        import pipeline_script   # only imports functions, does NOT run them
        pipeline_script.run_pipeline()   # you control when it runs
        ```

        This is the standard way to write reusable scripts — every well-written Python file that can also be run as a script uses this pattern.

---

!!! question "Week 10 — Question 7: subprocess.run()"
    What does this code do?

    ```python
    import subprocess

    result = subprocess.run(["python", "process.py", "--input", "data.csv"],
                            capture_output=True, text=True)
    print(result.returncode)
    print(result.stdout)
    ```

    * [ ] A) Opens a new terminal window and types the command
    * [x] B) Runs `python process.py --input data.csv` as a child process and captures its output
    * [ ] C) Imports and runs `process.py` in the same Python process
    * [ ] D) Raises `PermissionError` — subprocess requires root/admin

    ??? success "Check Answer"
        ✅ **Correct Answer: B) Runs as a child process and captures its output**

        ```python
        result = subprocess.run(
            ["python", "process.py", "--input", "data.csv"],
            capture_output=True,   # capture stdout and stderr
            text=True              # return strings, not bytes
        )

        result.returncode  # 0 = success, non-zero = error
        result.stdout      # what the script printed
        result.stderr      # any error messages
        ```

        `subprocess.run()` is how Python scripts orchestrate other scripts or command-line tools — the backbone of automation pipelines.

---

!!! question "Week 10 — Question 8: Error Handling in a Pipeline Loop"
    A pipeline processes 100 files. One file is corrupt. What is the best approach?

    ```python
    for filepath in files:
        process(filepath)   # might raise an exception
    ```

    * [ ] A) Use `sys.exit()` if any file fails
    * [x] B) Wrap `process()` in `try/except`, log the error, and continue to the next file
    * [ ] C) Skip error handling — the pipeline should crash loudly on any error
    * [ ] D) Delete the corrupt file automatically before processing

    ??? success "Check Answer"
        ✅ **Correct Answer: B) Catch the error, log it, and continue**

        ```python
        import logging

        success = 0
        failures = []

        for filepath in files:
            try:
                process(filepath)
                success += 1
            except Exception as e:
                logging.error(f"Failed to process {filepath}: {e}")
                failures.append(filepath)

        logging.info(f"Done: {success} succeeded, {len(failures)} failed")
        if failures:
            logging.warning(f"Failed files: {failures}")
        ```

        In automation pipelines, one bad file should not stop the other 99. Log failures for review and continue.

---

!!! question "Week 10 — Question 9: schedule Library"
    How do you run `backup()` every day at 08:00 using the `schedule` library?

    * [ ] A) `schedule.daily("08:00", backup)`
    * [x] B) `schedule.every().day.at("08:00").do(backup)`
    * [ ] C) `schedule.at("08:00").run(backup)`
    * [ ] D) `cron.every_day_at("08:00", backup)`

    ??? success "Check Answer"
        ✅ **Correct Answer: B) `schedule.every().day.at("08:00").do(backup)`**

        ```python
        import schedule
        import time

        def backup():
            print("Running backup...")

        schedule.every().day.at("08:00").do(backup)
        schedule.every(10).minutes.do(backup)         # every 10 minutes
        schedule.every().monday.at("09:00").do(backup) # every Monday at 9am

        while True:
            schedule.run_pending()
            time.sleep(60)   # check every minute
        ```

        The `while True` loop keeps the script running so the scheduler can fire at the right time. For production-grade scheduling (e.g., on a server), use `cron` (Linux/Mac) or Task Scheduler (Windows) instead.

---

!!! question "Week 10 — Question 10: Writing a Pipeline Summary Report"
    At the end of a pipeline run, you want to write a summary to a text file. Which code is correct?

    ```python
    summary = f"Processed: {total}\nSuccess: {ok}\nFailed: {failed}"
    ```

    * [ ] A) `open("summary.txt").write(summary)`
    * [x] B) `with open("summary.txt", "w") as f: f.write(summary)`
    * [ ] C) `file.write("summary.txt", summary)`
    * [ ] D) `print(summary) > "summary.txt"`

    ??? success "Check Answer"
        ✅ **Correct Answer: B) `with open("summary.txt", "w") as f: f.write(summary)`**

        The `with` statement (context manager) ensures the file is properly closed even if an error occurs:

        ```python
        with open("summary.txt", "w", encoding="utf-8") as f:
            f.write(summary)
        ```

        Mode flags:
        - `"w"` — write (creates or overwrites)
        - `"a"` — append (adds to the end)
        - `"r"` — read (default)

        Option A (`open(...).write(...)`) works but leaves the file handle open until garbage collection — unreliable. Always use `with open(...)`.
