# Week 7 Quiz — Web Scraping with BeautifulSoup

---

!!! question "Week 7 — Question 1: soup.find() vs soup.find_all()"
    What is the key difference between `soup.find()` and `soup.find_all()`?

    ```python
    from bs4 import BeautifulSoup

    html = "<p>First</p><p>Second</p><p>Third</p>"
    soup = BeautifulSoup(html, "html.parser")

    result_a = soup.find("p")
    result_b = soup.find_all("p")
    ```

    * [x] A) `.find()` returns the first matching tag; `.find_all()` returns a list of all matches
    * [ ] B) `.find()` searches by tag name; `.find_all()` searches by CSS class
    * [ ] C) `.find()` returns a string; `.find_all()` returns a Tag object
    * [ ] D) They do the same thing — `.find()` is just an older alias

    ??? success "Check Answer"
        ✅ **Correct Answer: A) `.find()` returns the first matching tag; `.find_all()` returns a list of all matches**

        ```python
        soup.find("p")      # → <p>First</p>           (one Tag object or None)
        soup.find_all("p")  # → [<p>First</p>, <p>Second</p>, <p>Third</p>]
        ```

        If `find()` finds nothing, it returns `None` — check before accessing attributes:
        ```python
        tag = soup.find("h1")
        if tag:
            print(tag.text)
        ```

        `find_all()` always returns a list (empty list if nothing found), so you can safely iterate:
        ```python
        for p in soup.find_all("p"):
            print(p.text)
        ```

---

!!! question "Week 7 — Question 2: Extracting Text"
    What does `tag.get_text()` return compared to `tag.text`?

    ```python
    from bs4 import BeautifulSoup

    html = "<div><p>Hello</p> <span>World</span></div>"
    soup = BeautifulSoup(html, "html.parser")
    div = soup.find("div")

    print(div.text)
    print(div.get_text(separator=" ", strip=True))
    ```

    * [ ] A) Both return `"Hello World"` — they're identical
    * [x] B) `.text` returns all text concatenated; `.get_text()` lets you control the separator and strip whitespace
    * [ ] C) `.text` returns a list of strings; `.get_text()` returns a single string
    * [ ] D) `.text` includes HTML tags; `.get_text()` strips them

    ??? success "Check Answer"
        ✅ **Correct Answer: B) `.text` returns all text concatenated; `.get_text()` lets you control the separator and strip whitespace**

        `.text` is a shortcut property — it returns all nested text joined with no separator.
        `.get_text()` is a method with options:

        ```python
        div.text                              # → "Hello World"
        div.get_text(separator=" ", strip=True)  # → "Hello World"
        div.get_text(separator="\n")          # → "Hello\nWorld"
        ```

        For simple cases `.text` is fine. Use `.get_text()` when you need clean, well-formatted output from elements with complex nested structure.

---

!!! question "Week 7 — Question 3: Selecting by CSS Class"
    How do you find all `<div>` elements with the class `"product-card"`?

    * [ ] A) `soup.find_all("div", class="product-card")`
    * [x] B) `soup.find_all("div", class_="product-card")`
    * [ ] C) `soup.find_all("div.product-card")`
    * [ ] D) `soup.select("div", ".product-card")`

    ??? success "Check Answer"
        ✅ **Correct Answer: B) `soup.find_all("div", class_="product-card")`**

        `class` is a reserved keyword in Python, so BeautifulSoup uses `class_` (with a trailing underscore) as the parameter name:

        ```python
        # ❌ SyntaxError: class is reserved
        soup.find_all("div", class="product-card")

        # ✅ Correct
        soup.find_all("div", class_="product-card")

        # ✅ Also correct — CSS selector syntax
        soup.select("div.product-card")
        ```

        `.select()` uses standard CSS selector syntax — if you know CSS, you can use it directly.

---

!!! question "Week 7 — Question 4: Extracting an Attribute"
    How do you get the `href` URL from this anchor tag?

    ```python
    from bs4 import BeautifulSoup

    html = '<a href="https://example.com" class="link">Click here</a>'
    soup = BeautifulSoup(html, "html.parser")
    tag = soup.find("a")
    ```

    * [ ] A) `tag.href`
    * [ ] B) `tag.text`
    * [x] C) `tag["href"]` or `tag.get("href")`
    * [ ] D) `tag.attributes["href"]`

    ??? success "Check Answer"
        ✅ **Correct Answer: C) `tag["href"]` or `tag.get("href")`**

        BeautifulSoup Tag objects behave like dictionaries for attributes:

        ```python
        tag["href"]          # → "https://example.com"  (raises KeyError if missing)
        tag.get("href")      # → "https://example.com"  (returns None if missing)
        tag.get("href", "#") # → returns "#" if href is missing
        ```

        `tag.text` returns the visible text (`"Click here"`), not the URL.

        Use `.get()` when the attribute might not exist — common in real scrapers where HTML is inconsistent.

---

!!! question "Week 7 — Question 5: Parsing HTML — Which Parser?"
    Which parser is available with a standard Python installation (no extra pip install)?

    ```python
    soup = BeautifulSoup(html, "???")
    ```

    * [x] A) `"html.parser"` — Python's built-in HTML parser
    * [ ] B) `"lxml"` — the fastest parser
    * [ ] C) `"html5lib"` — the most lenient parser
    * [ ] D) `"xml"` — works for all HTML and XML

    ??? success "Check Answer"
        ✅ **Correct Answer: A) `"html.parser"` — Python's built-in HTML parser**

        | Parser | Install needed | Speed | Leniency |
        |--------|---------------|-------|----------|
        | `"html.parser"` | None (built-in) | Medium | Medium |
        | `"lxml"` | `pip install lxml` | Fast | Medium |
        | `"html5lib"` | `pip install html5lib` | Slow | Most lenient |

        `"html.parser"` is the safe default — always available. For production scraping of messy real-world HTML, `"lxml"` is the best balance of speed and robustness.

        Always specify the parser explicitly — if you omit it, BeautifulSoup prints a warning and guesses.

---

!!! question "Week 7 — Question 6: Why requests + BeautifulSoup?"
    A student wants to scrape a webpage. Why use `requests.get()` instead of just passing the URL to BeautifulSoup?

    * [ ] A) BeautifulSoup can download web pages directly if you pass a URL
    * [x] B) BeautifulSoup only parses HTML — `requests` fetches the raw HTML from the web
    * [ ] C) `requests` is faster at parsing HTML than BeautifulSoup
    * [ ] D) You must use `requests` because BeautifulSoup is blocked by most websites

    ??? success "Check Answer"
        ✅ **Correct Answer: B) BeautifulSoup only parses HTML — `requests` fetches the raw HTML from the web**

        The two tools do different jobs:

        ```python
        import requests
        from bs4 import BeautifulSoup

        # Step 1: requests downloads the HTML
        response = requests.get("https://example.com")
        html = response.text

        # Step 2: BeautifulSoup parses the HTML
        soup = BeautifulSoup(html, "html.parser")
        ```

        This separation is powerful — you can also parse HTML from a file, an API response, or a local string without needing the internet.

---

!!! question "Week 7 — Question 7: soup.select() with CSS Selectors"
    Using CSS selectors, how do you select all `<li>` elements inside a `<ul>` with id `"menu"`?

    * [ ] A) `soup.find_all("ul li", id="menu")`
    * [x] B) `soup.select("#menu li")`
    * [ ] C) `soup.select("ul.menu > li")`
    * [ ] D) `soup.find("ul", id="menu").li`

    ??? success "Check Answer"
        ✅ **Correct Answer: B) `soup.select("#menu li")`**

        CSS selector syntax:
        - `#menu` — selects the element with `id="menu"`
        - `#menu li` — selects all `<li>` descendants inside `#menu`

        Common CSS selector patterns in BeautifulSoup:
        ```python
        soup.select("p")            # all <p> tags
        soup.select(".card")        # class="card"
        soup.select("#header")      # id="header"
        soup.select("div > p")      # <p> direct children of <div>
        soup.select("a[href]")      # <a> tags that have an href attribute
        soup.select("a[href^='https']")  # href starting with "https"
        ```

        `.select()` always returns a list (like `.find_all()`). Use `.select_one()` for the first match (like `.find()`).

---

!!! question "Week 7 — Question 8: Polite Scraping — User-Agent"
    Why would a scraper add a `User-Agent` header to its requests?

    * [ ] A) To make the request faster
    * [ ] B) To bypass HTTPS/SSL certificate verification
    * [x] C) To identify the scraper to the server and avoid being blocked as a bot
    * [ ] D) Because `requests.get()` raises an error without a User-Agent

    ??? success "Check Answer"
        ✅ **Correct Answer: C) To identify the scraper to the server and avoid being blocked as a bot**

        By default, `requests` sends `User-Agent: python-requests/2.x.x`. Many websites block this automatically.

        A more polite approach:
        ```python
        headers = {
            "User-Agent": (
                "Mozilla/5.0 (compatible; MyResearchBot/1.0; "
                "+mailto:you@example.com)"
            )
        }
        response = requests.get(url, headers=headers)
        ```

        Ethical scraping also means:
        - Checking `robots.txt` before scraping
        - Adding `time.sleep()` between requests
        - Not scraping personal data without permission
        - Respecting the website's terms of service

---

!!! question "Week 7 — Question 9: Saving Scraped Data to CSV"
    After scraping a list of products (names and prices), what is the correct way to save the data?

    ```python
    import csv

    products = [
        {"name": "Notebook", "price": 3.99},
        {"name": "Pen",      "price": 1.49},
    ]
    ```

    * [ ] A) `open("products.csv", "w").write(str(products))`
    * [x] B) Use `csv.DictWriter` with `fieldnames` and `writerows()`
    * [ ] C) `json.dump(products, open("products.csv", "w"))`
    * [ ] D) `print(products)` then copy-paste from the terminal

    ??? success "Check Answer"
        ✅ **Correct Answer: B) Use `csv.DictWriter` with `fieldnames` and `writerows()`**

        ```python
        import csv

        with open("products.csv", "w", newline="", encoding="utf-8") as f:
            writer = csv.DictWriter(f, fieldnames=["name", "price"])
            writer.writeheader()
            writer.writerows(products)
        ```

        This produces a proper CSV file that Excel, pandas, and other tools can read. The `newline=""` parameter is important on Windows to prevent blank lines between rows.

---

!!! question "Week 7 — Question 10: Handling Missing Tags"
    A scraper looks for a product's discount badge. Most products don't have one.
    What is the safe way to handle this?

    ```python
    product = soup.find("div", class_="product")
    badge = product.find("span", class_="discount")
    ```

    * [ ] A) `print(badge.text)` — BeautifulSoup returns an empty string if not found
    * [ ] B) `print(badge)` — printing `None` won't crash
    * [x] C) Check `if badge:` before accessing `badge.text`
    * [ ] D) Use `try/except KeyError` around `badge.text`

    ??? success "Check Answer"
        ✅ **Correct Answer: C) Check `if badge:` before accessing `badge.text`**

        `find()` returns `None` when the tag isn't found. Calling `.text` on `None` raises an `AttributeError`:

        ```python
        badge = product.find("span", class_="discount")

        # ❌ Crashes if badge is None
        print(badge.text)

        # ✅ Safe check
        discount = badge.text if badge else "No discount"
        print(discount)

        # ✅ Also fine with explicit if
        if badge:
            print(badge.text)
        ```

        This `None` check is the single most important habit in real web scraping — real HTML is inconsistent, and missing elements are normal.
