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
