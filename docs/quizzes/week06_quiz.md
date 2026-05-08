# Week 6 Quiz — APIs & the requests Library

---

!!! question "Week 6 — Question 1: Status Code Check"
    What does `response.status_code == 200` mean?

    ```python
    import requests

    response = requests.get("https://api.example.com/data")

    if response.status_code == 200:
        print("Success!")
    else:
        print(f"Error: {response.status_code}")
    ```

    * [ ] A) The request took 200 milliseconds
    * [x] B) The server returned the data successfully
    * [ ] C) The response contains 200 items
    * [ ] D) There are 200 bytes in the response

    ??? success "Check Answer"
        ✅ **Correct Answer: B) The server returned the data successfully**

        HTTP status codes are three-digit numbers that tell you what happened on the server:

        | Code | Meaning |
        |------|---------|
        | `200` | OK — request succeeded |
        | `201` | Created — new resource created |
        | `400` | Bad Request — your request had an error |
        | `401` | Unauthorized — authentication required |
        | `403` | Forbidden — you don't have permission |
        | `404` | Not Found — resource doesn't exist |
        | `429` | Too Many Requests — you're being rate-limited |
        | `500` | Internal Server Error — server crashed |

        Always check the status code before trying to parse the response. A `200` means you can safely call `.json()`.

---

!!! question "Week 6 — Question 2: response.json() vs response.text"
    What is the difference between `response.json()` and `response.text`?

    ```python
    response = requests.get("https://api.example.com/user/1")

    data = response.json()   # returns ???
    raw  = response.text     # returns ???
    ```

    * [ ] A) `.json()` returns bytes; `.text` returns a string
    * [x] B) `.json()` returns a Python dict/list; `.text` returns the raw string
    * [ ] C) `.json()` is faster; `.text` is more accurate
    * [ ] D) They return the same thing — `.json()` is just an alias

    ??? success "Check Answer"
        ✅ **Correct Answer: B) `.json()` returns a Python dict/list; `.text` returns the raw string**

        ```python
        response.text    # → '{"name": "Alice", "age": 25}'  (a string)
        response.json()  # → {"name": "Alice", "age": 25}    (a Python dict)
        ```

        `.json()` calls `json.loads(response.text)` internally — it saves you that step.

        Use `.text` when:
        - The response is HTML, CSV, or plain text (not JSON)
        - You want to inspect the raw content for debugging

        Use `.json()` when:
        - The API returns JSON and you need to work with the data as a dict

---

!!! question "Week 6 — Question 3: Passing URL Parameters"
    A student needs to search for books about Python via an API. Which code is correct?

    ```python
    import requests

    # Option A
    response = requests.get("https://api.books.com/search?q=python&limit=5")

    # Option B
    params = {"q": "python", "limit": 5}
    response = requests.get("https://api.books.com/search", params=params)
    ```

    * [ ] A) Only Option A works — URL parameters must be in the URL string
    * [ ] B) Only Option B works — `params=` is the only valid way
    * [x] C) Both work, but Option B is cleaner and handles encoding automatically
    * [ ] D) Option B raises a `TypeError` because `params` must be a string

    ??? success "Check Answer"
        ✅ **Correct Answer: C) Both work, but Option B is cleaner and handles encoding automatically**

        Both produce the same HTTP request. But `params={}` is better because:

        1. **URL encoding is automatic** — if your query has spaces or special characters, `requests` encodes them correctly (`"hello world"` → `"hello%20world"`)
        2. **Cleaner code** — parameters are separate from the base URL, easier to read and change
        3. **Less error-prone** — no risk of forgetting `?` or `&` between parameters

        ```python
        params = {"q": "web scraping", "limit": 10, "lang": "en"}
        response = requests.get("https://api.books.com/search", params=params)
        # actual URL: ...?q=web+scraping&limit=10&lang=en
        ```

---

!!! question "Week 6 — Question 4: API Keys in Headers"
    An API requires authentication. What is the correct way to send an API key?

    ```python
    import requests

    API_KEY = "my-secret-key-123"
    ```

    * [ ] A) `requests.get("https://api.example.com/data?key=my-secret-key-123")`
    * [x] B) `requests.get("https://api.example.com/data", headers={"Authorization": "Bearer my-secret-key-123"})`
    * [ ] C) `requests.get("https://api.example.com/data", api_key="my-secret-key-123")`
    * [ ] D) `requests.get("https://api.example.com/data", body={"key": "my-secret-key-123"})`

    ??? success "Check Answer"
        ✅ **Correct Answer: B) Using `headers={"Authorization": "Bearer my-secret-key-123"}`**

        API keys in URLs (Option A) appear in server logs and browser history — a security risk. The standard approach is the `Authorization` header:

        ```python
        headers = {
            "Authorization": f"Bearer {API_KEY}",
            "Content-Type": "application/json"
        }
        response = requests.get(url, headers=headers)
        ```

        Different APIs use different header formats:
        - `"Authorization": "Bearer TOKEN"` — OAuth/JWT style
        - `"X-API-Key": "KEY"` — many simpler APIs
        - `"Authorization": "Basic BASE64"` — username/password encoded

        Always check the API's documentation for the exact format expected.

---

!!! question "Week 6 — Question 5: response.raise_for_status()"
    What does `response.raise_for_status()` do?

    ```python
    import requests

    response = requests.get("https://api.example.com/user/999")
    response.raise_for_status()   # user 999 doesn't exist
    data = response.json()
    ```

    * [ ] A) Returns the status code as an integer
    * [ ] B) Prints the error message to the console
    * [x] C) Raises an `HTTPError` exception if the status code indicates failure (4xx or 5xx)
    * [ ] D) Automatically retries the request on failure

    ??? success "Check Answer"
        ✅ **Correct Answer: C) Raises an `HTTPError` exception if the status code indicates failure (4xx or 5xx)**

        `.raise_for_status()` is a convenience method — it replaces manual status checking:

        ```python
        # Manual checking (verbose)
        if response.status_code != 200:
            raise Exception(f"API error: {response.status_code}")

        # Cleaner with raise_for_status()
        response.raise_for_status()   # automatically raises on 4xx/5xx
        ```

        Use it with `try/except` to handle errors gracefully:
        ```python
        try:
            response = requests.get(url)
            response.raise_for_status()
            data = response.json()
        except requests.HTTPError as e:
            print(f"API error: {e}")
        ```

---

!!! question "Week 6 — Question 6: Rate Limiting"
    An API allows 1 request per second. A student needs to fetch 10 pages of data.
    Which code avoids getting rate-limited?

    * [ ] A) Make all 10 requests simultaneously with threading
    * [x] B) Use `time.sleep(1)` between requests
    * [ ] C) Add `rate_limit=1` to the `requests.get()` call
    * [ ] D) APIs never rate-limit GET requests, only POST

    ??? success "Check Answer"
        ✅ **Correct Answer: B) Use `time.sleep(1)` between requests**

        Rate limiting means the API only allows a certain number of requests per time window. Exceeding it returns a `429 Too Many Requests` response.

        ```python
        import requests
        import time

        for page in range(1, 11):
            response = requests.get(f"https://api.example.com/data?page={page}")
            data = response.json()
            process(data)
            time.sleep(1)   # wait 1 second before next request
        ```

        **Threading** (Option A) would make requests in parallel — faster, but likely to trigger the rate limit immediately.

        Be a polite API consumer: add delays, cache results, and read the documentation for rate limit rules.

---

!!! question "Week 6 — Question 7: Accessing Nested API Data"
    The API returns this JSON. How do you get Alice's city?

    ```python
    data = {
        "user": {
            "name": "Alice",
            "location": {
                "city": "London",
                "country": "UK"
            }
        },
        "status": "active"
    }
    ```

    * [ ] A) `data["city"]`
    * [ ] B) `data["user"]["city"]`
    * [x] C) `data["user"]["location"]["city"]`
    * [ ] D) `data.get("city", "Unknown")`

    ??? success "Check Answer"
        ✅ **Correct Answer: C) `data["user"]["location"]["city"]`**

        You must follow the nesting path exactly:
        ```python
        data["user"]              # → {"name": "Alice", "location": {...}}
        data["user"]["location"]  # → {"city": "London", "country": "UK"}
        data["user"]["location"]["city"]  # → "London"
        ```

        In real API work, fields can be missing. The defensive version:
        ```python
        city = (data
                .get("user", {})
                .get("location", {})
                .get("city", "Unknown"))
        ```

        Drawing the JSON as a tree before writing the access chain helps enormously.

---

!!! question "Week 6 — Question 8: requests.get() Connection Error"
    What happens if `requests.get()` is called but there is no internet connection?

    * [ ] A) It returns a response with status code `0`
    * [ ] B) It returns `None`
    * [x] C) It raises a `requests.exceptions.ConnectionError`
    * [ ] D) It waits forever — you need to set a timeout manually

    ??? success "Check Answer"
        ✅ **Correct Answer: C) It raises a `requests.exceptions.ConnectionError`**

        Network errors are exceptions, not failed responses. Always wrap network calls:

        ```python
        import requests

        try:
            response = requests.get("https://api.example.com/data", timeout=10)
            response.raise_for_status()
            data = response.json()
        except requests.exceptions.ConnectionError:
            print("No internet connection.")
        except requests.exceptions.Timeout:
            print("Request timed out.")
        except requests.exceptions.HTTPError as e:
            print(f"HTTP error: {e}")
        ```

        Always set `timeout=` — without it, your script can hang indefinitely if the server never responds.

---

!!! question "Week 6 — Question 9: Storing API Keys Safely"
    A student wants to use an API key without hardcoding it into their script. What is the correct approach?

    * [ ] A) Put the key in a comment: `# API_KEY = "abc123"`
    * [ ] B) Push it to GitHub in a private repository
    * [x] C) Store it in a `.env` file and load it with `python-dotenv`
    * [ ] D) Encode it in Base64 and hardcode the encoded version

    ??? success "Check Answer"
        ✅ **Correct Answer: C) Store it in a `.env` file and load it with `python-dotenv`**

        The safe pattern for secrets:

        **`.env` file** (never commit this):
        ```
        OPENWEATHER_KEY=abc123xyz
        ```

        **`.gitignore`** — add `.env` to prevent it being pushed:
        ```
        .env
        ```

        **Python code:**
        ```python
        from dotenv import load_dotenv
        import os

        load_dotenv()
        API_KEY = os.getenv("OPENWEATHER_KEY")
        ```

        Base64 (Option D) is encoding, not encryption — anyone who sees the string can decode it in seconds. Private repos (Option B) can still be leaked or accidentally made public.

---

!!! question "Week 6 — Question 10: Iterating Over API List Response"
    The API returns a list of users. What does this code print?

    ```python
    import requests

    response = requests.get("https://api.example.com/users")
    users = response.json()

    # users = [
    #   {"id": 1, "name": "Alice", "active": True},
    #   {"id": 2, "name": "Bob",   "active": False},
    #   {"id": 3, "name": "Carol", "active": True}
    # ]

    active_names = [u["name"] for u in users if u["active"]]
    print(active_names)
    ```

    * [ ] A) `["Alice", "Bob", "Carol"]`
    * [x] B) `["Alice", "Carol"]`
    * [ ] C) `["Bob"]`
    * [ ] D) `TypeError: list indices must be integers or slices, not str`

    ??? success "Check Answer"
        ✅ **Correct Answer: B) `["Alice", "Carol"]`**

        The list comprehension filters and transforms in one step:

        ```python
        [u["name"] for u in users if u["active"]]
        ```

        - `u = {"id": 1, "name": "Alice", "active": True}` → `True` ✅ → `"Alice"` included
        - `u = {"id": 2, "name": "Bob", "active": False}` → `False` ❌ → skipped
        - `u = {"id": 3, "name": "Carol", "active": True}` → `True` ✅ → `"Carol"` included

        This pattern — fetch a list from an API, filter it, extract a field — is one of the most common operations in real-world Python scripts.
