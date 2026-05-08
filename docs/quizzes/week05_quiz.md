# Week 5 Quiz — Dictionaries, JSON & KeyError Handling

---

!!! question "Week 5 — Question 1: KeyError on Direct Access"
    What happens when this code runs?

    ```python
    contact = {
        "name": "Alice",
        "phone": "555-0101"
    }

    print(contact["email"])
    ```

    * [ ] A) `None`
    * [ ] B) An empty string `""`
    * [x] C) `KeyError: 'email'`
    * [ ] D) `AttributeError: dict has no attribute 'email'`

    ??? success "Check Answer"
        ✅ **Correct Answer: C) `KeyError: 'email'`**

        Accessing a dictionary with `dict[key]` raises a `KeyError` if the key does not exist. Python does not return `None` — it crashes.

        Two safe alternatives:

        ```python
        # Option 1: .get() — returns None if key missing
        print(contact.get("email"))              # None

        # Option 2: .get() with a fallback value
        print(contact.get("email", "No email"))  # No email

        # Option 3: check first with 'in'
        if "email" in contact:
            print(contact["email"])
        ```

        In production code (like our Contact Book App), always use `.get()` or an `in` check when a key might not be present.

---

!!! question "Week 5 — Question 2: .get() vs Direct Access"
    What does this print?

    ```python
    settings = {"theme": "dark", "font_size": 14}

    a = settings.get("theme")
    b = settings.get("language", "English")
    c = settings.get("font_size", 12)

    print(a, b, c)
    ```

    * [ ] A) `dark English 12`
    * [ ] B) `dark None 14`
    * [x] C) `dark English 14`
    * [ ] D) `KeyError: 'language'`

    ??? success "Check Answer"
        ✅ **Correct Answer: C) `dark English 14`**

        `.get(key, default)` returns:
        - The **actual value** if the key exists
        - The **default** if the key does not exist

        | Call | Key exists? | Returns |
        |------|------------|---------|
        | `settings.get("theme")` | ✅ Yes | `"dark"` |
        | `settings.get("language", "English")` | ❌ No | `"English"` (the fallback) |
        | `settings.get("font_size", 12)` | ✅ Yes | `14` (actual value, not the fallback) |

        The fallback `12` is ignored because `"font_size"` **is** in the dictionary with value `14`.

---

!!! question "Week 5 — Question 3: Nested Dictionary Access"
    What does this code print?

    ```python
    student = {
        "name": "Bilal",
        "grades": {
            "math": 88,
            "english": 74,
            "science": 95
        }
    }

    print(student["grades"]["english"])
    print(student["name"])
    print(student["grades"]["science"] - student["grades"]["math"])
    ```

    * [x] A) `74` / `Bilal` / `7`
    * [ ] B) `88` / `Bilal` / `7`
    * [ ] C) `74` / `Bilal` / `95`
    * [ ] D) `KeyError: 'english'`

    ??? success "Check Answer"
        ✅ **Correct Answer: A) `74` / `Bilal` / `7`**

        Each `[]` drills one level deeper into the nested structure:

        ```python
        student["grades"]            # → {"math": 88, "english": 74, "science": 95}
        student["grades"]["english"] # → 74

        student["name"]              # → "Bilal"

        student["grades"]["science"] - student["grades"]["math"]
        # → 95 - 88 → 7
        ```

        **Why the distractors fail:**
        - **B)** `88` is `math`, not `english` — wrong key
        - **C)** `95` is the raw `science` value, not the difference
        - **D)** `"english"` is a valid key — no `KeyError` occurs

        Trace carefully before answering arithmetic questions — it's a common way to lose easy marks.

---

!!! question "Week 5 — Question 4: json.dumps vs json.dump"
    A student wants to convert a dictionary to a JSON string to send over the internet.
    Which line is correct, and what type does it return?

    ```python
    import json

    data = {"user": "Alice", "score": 99}

    result = json.dumps(data)
    print(type(result))
    ```

    * [ ] A) `<class 'dict'>` — `json.dumps()` returns a dict
    * [x] B) `<class 'str'>` — `json.dumps()` returns a JSON-formatted string
    * [ ] C) `<class 'bytes'>` — `json.dumps()` encodes to bytes
    * [ ] D) `<class 'json'>` — `json.dumps()` returns a json object

    ??? success "Check Answer"
        ✅ **Correct Answer: B) `<class 'str'>` — `json.dumps()` returns a JSON-formatted string**

        The two most confused JSON functions:

        | Function | What it does | Where the output goes |
        |----------|-------------|----------------------|
        | `json.dumps(data)` | Dict → JSON **string** | Returns a string (in memory) |
        | `json.dump(data, file)` | Dict → JSON **written to a file** | Writes to an open file object |
        | `json.loads(string)` | JSON string → Dict | Returns a dict |
        | `json.load(file)` | JSON file → Dict | Reads from an open file object |

        Memory trick: **`s` = string**. `dumps` and `loads` work with strings. `dump` and `load` work with files.

        ```python
        # Saving to a file (json.dump)
        with open("data.json", "w") as f:
            json.dump(data, f, indent=2)

        # Reading from a file (json.load)
        with open("data.json") as f:
            loaded = json.load(f)
        ```

---

!!! question "Week 5 — Question 5: Dictionary Key Overwrite"
    What does this print?

    ```python
    inventory = {}

    inventory["apples"] = 10
    inventory["bananas"] = 5
    inventory["apples"] = 20
    inventory["oranges"] = 8
    inventory["bananas"] = inventory["bananas"] + 3

    print(inventory)
    print(len(inventory))
    ```

    * [ ] A) `{'apples': 10, 'bananas': 5, 'apples': 20, 'oranges': 8, 'bananas': 8}` / `5`
    * [ ] B) `{'apples': 30, 'bananas': 8, 'oranges': 8}` / `3`
    * [x] C) `{'apples': 20, 'bananas': 8, 'oranges': 8}` / `3`
    * [ ] D) `TypeError: dictionary already contains key 'apples'`

    ??? success "Check Answer"
        ✅ **Correct Answer: C) `{'apples': 20, 'bananas': 8, 'oranges': 8}` / `3`**

        Dictionaries cannot have duplicate keys. When you assign to an existing key, it **overwrites** the old value — it does not create a second entry.

        Tracing the mutations:

        ```python
        inventory["apples"] = 10   # {"apples": 10}
        inventory["bananas"] = 5   # {"apples": 10, "bananas": 5}
        inventory["apples"] = 20   # {"apples": 20, "bananas": 5}  ← overwrites 10
        inventory["oranges"] = 8   # {"apples": 20, "bananas": 5, "oranges": 8}
        inventory["bananas"] = 5 + 3  # {"apples": 20, "bananas": 8, "oranges": 8}
        ```

        Final dictionary has **3 unique keys**, not 5. The `len()` of a dictionary returns the number of key-value pairs.

---

!!! question "Week 5 — Question 6: Iterating with .items()"
    What does this print?

    ```python
    prices = {"coffee": 2.5, "tea": 1.8, "juice": 3.2}

    for item, price in prices.items():
        if price < 3.0:
            print(item)
    ```

    * [ ] A) `coffee` / `tea` / `juice`
    * [x] B) `coffee` / `tea`
    * [ ] C) `juice`
    * [ ] D) `TypeError: cannot iterate dict with two variables`

    ??? success "Check Answer"
        ✅ **Correct Answer: B) `coffee` / `tea`**

        `.items()` returns `(key, value)` pairs. The loop unpacks each pair into `item` and `price`.

        ```python
        ("coffee", 2.5) → 2.5 < 3.0 ✅ → prints "coffee"
        ("tea",    1.8) → 1.8 < 3.0 ✅ → prints "tea"
        ("juice",  3.2) → 3.2 < 3.0 ❌ → skipped
        ```

        The three ways to iterate a dictionary:
        ```python
        for key in d:            # keys only (default)
        for key in d.keys():     # same as above, more explicit
        for val in d.values():   # values only
        for k, v in d.items():   # key-value pairs (most common in real code)
        ```

---

!!! question "Week 5 — Question 7: dict.update()"
    What does this print?

    ```python
    user = {"name": "Bob", "age": 30, "city": "Paris"}
    updates = {"age": 31, "email": "bob@example.com"}

    user.update(updates)
    print(user)
    ```

    * [ ] A) `{"name": "Bob", "age": 30, "city": "Paris"}`
    * [ ] B) `{"age": 31, "email": "bob@example.com"}`
    * [x] C) `{"name": "Bob", "age": 31, "city": "Paris", "email": "bob@example.com"}`
    * [ ] D) `KeyError: 'age' already exists`

    ??? success "Check Answer"
        ✅ **Correct Answer: C) `{"name": "Bob", "age": 31, "city": "Paris", "email": "bob@example.com"}`**

        `.update(other_dict)` does two things at once:
        - **Updates** existing keys with new values (`"age"` changes from 30 to 31)
        - **Adds** new keys that don't exist yet (`"email"` is inserted)

        Keys not mentioned in `updates` (`"name"`, `"city"`) are left unchanged.

        `.update()` is perfect for merging user edits into an existing record — exactly what our Contact Book App does when you edit a contact.

---

!!! question "Week 5 — Question 8: Dictionary Comprehension"
    What does this print?

    ```python
    numbers = [1, 2, 3, 4, 5]
    squares = {n: n**2 for n in numbers}
    print(squares)
    ```

    * [ ] A) `[1, 4, 9, 16, 25]`
    * [x] B) `{1: 1, 2: 4, 3: 9, 4: 16, 5: 25}`
    * [ ] C) `{1, 4, 9, 16, 25}`
    * [ ] D) `SyntaxError: invalid syntax`

    ??? success "Check Answer"
        ✅ **Correct Answer: B) `{1: 1, 2: 4, 3: 9, 4: 16, 5: 25}`**

        A **dict comprehension** uses `{key: value for item in iterable}` syntax — curly braces with a colon separating key from value.

        ```python
        {n: n**2 for n in [1, 2, 3, 4, 5]}
        → {1: 1, 2: 4, 3: 9, 4: 16, 5: 25}
        ```

        Compare the three comprehension types:
        ```python
        [n**2 for n in numbers]          # list comprehension → [1, 4, 9, 16, 25]
        {n**2 for n in numbers}          # set comprehension  → {1, 4, 9, 16, 25}
        {n: n**2 for n in numbers}       # dict comprehension → {1:1, 2:4, 3:9, ...}
        ```

        The presence of `:` inside `{}` is what distinguishes a dict comprehension from a set comprehension.

---

!!! question "Week 5 — Question 9: Safe Nested Key Access"
    A student receives this API response. What is the safest way to get the city?

    ```python
    profile = {
        "name": "Sara",
        "address": {
            "city": "Dubai",
            "postcode": "00000"
        }
    }
    ```

    * [ ] A) `profile["address"]["city"]`
    * [ ] B) `profile.get("city")`
    * [x] C) `profile.get("address", {}).get("city", "Unknown")`
    * [ ] D) `profile["city"]`

    ??? success "Check Answer"
        ✅ **Correct Answer: C) `profile.get("address", {}).get("city", "Unknown")`**

        Option A crashes with a `KeyError` if `"address"` is missing from the dict.
        Option B returns `None` — it looks for `"city"` at the top level, not nested inside `"address"`.
        Option D crashes immediately.

        Option C chains two `.get()` calls safely:

        ```python
        profile.get("address", {})     # returns the address dict, or {} if missing
        .get("city", "Unknown")        # returns the city, or "Unknown" if missing
        ```

        If `"address"` is missing, `.get("address", {})` returns `{}`, and then `{}.get("city", "Unknown")` returns `"Unknown"` — no crash.

        This chained pattern is essential when working with API responses where fields may be missing.

---

!!! question "Week 5 — Question 10: JSON Round-Trip"
    What does this print?

    ```python
    import json

    original = {"name": "Alice", "score": 95, "passed": True}

    json_string = json.dumps(original)
    recovered = json.loads(json_string)

    print(type(recovered))
    print(recovered["passed"])
    ```

    * [ ] A) `<class 'str'>` / `"True"`
    * [x] B) `<class 'dict'>` / `True`
    * [ ] C) `<class 'dict'>` / `"true"`
    * [ ] D) `<class 'str'>` / `True`

    ??? success "Check Answer"
        ✅ **Correct Answer: B) `<class 'dict'>` / `True`**

        `json.dumps()` converts the dict to a JSON string. `json.loads()` converts it back to a Python dict. The round-trip restores the original types.

        ```python
        json.dumps({"passed": True})   # → '{"passed": true}'  (JSON uses lowercase)
        json.loads('{"passed": true}') # → {"passed": True}    (Python bool restored)
        ```

        Note: JSON uses lowercase `true`/`false`/`null`, but `json.loads()` automatically converts them back to Python's `True`/`False`/`None`. The types survive the round-trip correctly.

        | Python | JSON wire format | Python (after loads) |
        |--------|-----------------|---------------------|
        | `True` | `true` | `True` |
        | `False` | `false` | `False` |
        | `None` | `null` | `None` |
        | `"str"` | `"str"` | `"str"` |
        | `42` | `42` | `42` |
