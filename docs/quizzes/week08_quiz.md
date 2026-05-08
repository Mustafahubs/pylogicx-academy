# Week 8 Quiz — Data Analysis with pandas

---

!!! question "Week 8 — Question 1: Loading a CSV File"
    What does `pd.read_csv("sales.csv")` return?

    ```python
    import pandas as pd

    df = pd.read_csv("sales.csv")
    print(type(df))
    ```

    * [ ] A) A Python list of dictionaries
    * [x] B) A pandas DataFrame
    * [ ] C) A list of lists (rows)
    * [ ] D) A dictionary where keys are column names

    ??? success "Check Answer"
        ✅ **Correct Answer: B) A pandas DataFrame**

        A **DataFrame** is the core pandas data structure — a two-dimensional table with labelled rows (index) and columns.

        ```python
        df = pd.read_csv("sales.csv")
        print(type(df))   # <class 'pandas.core.frame.DataFrame'>
        ```

        Key pandas functions for loading data:
        ```python
        pd.read_csv("file.csv")       # CSV file
        pd.read_excel("file.xlsx")    # Excel file
        pd.read_json("file.json")     # JSON file
        pd.DataFrame(list_of_dicts)   # from Python data
        ```

---

!!! question "Week 8 — Question 2: df.shape"
    A DataFrame has 1,000 rows and 5 columns. What does `df.shape` return?

    ```python
    print(df.shape)
    ```

    * [ ] A) `5000`
    * [x] B) `(1000, 5)`
    * [ ] C) `(5, 1000)`
    * [ ] D) `[1000, 5]`

    ??? success "Check Answer"
        ✅ **Correct Answer: B) `(1000, 5)`**

        `df.shape` returns a tuple `(rows, columns)` — rows first, columns second.

        ```python
        df.shape[0]   # number of rows → 1000
        df.shape[1]   # number of columns → 5
        ```

        Other quick inspection methods:
        ```python
        df.head()        # first 5 rows
        df.tail()        # last 5 rows
        df.info()        # column types and non-null counts
        df.describe()    # statistics (mean, std, min, max, ...)
        df.columns       # list of column names
        ```

---

!!! question "Week 8 — Question 3: Selecting a Column"
    How do you get the `"price"` column from a DataFrame as a Series?

    ```python
    import pandas as pd

    df = pd.read_csv("products.csv")
    # columns: name, price, category, in_stock
    ```

    * [ ] A) `df.price()` — method call
    * [x] B) `df["price"]` — bracket notation
    * [ ] C) `df[0]` — column by index
    * [ ] D) `df.get("price")` — dictionary method

    ??? success "Check Answer"
        ✅ **Correct Answer: B) `df["price"]` — bracket notation**

        ```python
        df["price"]         # → Series (one column)
        df[["price"]]       # → DataFrame (one-column DataFrame — note double brackets)
        df[["name","price"]]  # → DataFrame with two columns
        ```

        You can also use dot notation for simple column names (`df.price`), but it breaks for names with spaces, names that clash with methods, or when the name is stored in a variable. **Bracket notation always works.**

---

!!! question "Week 8 — Question 4: Filtering Rows"
    How do you select only rows where the price is greater than 50?

    ```python
    df = pd.DataFrame({
        "name": ["A", "B", "C", "D"],
        "price": [30, 75, 20, 90]
    })
    ```

    * [ ] A) `df.filter(price > 50)`
    * [ ] B) `df.where("price > 50")`
    * [x] C) `df[df["price"] > 50]`
    * [ ] D) `df.select(df.price > 50)`

    ??? success "Check Answer"
        ✅ **Correct Answer: C) `df[df["price"] > 50]`**

        Boolean indexing:

        ```python
        df["price"] > 50          # → Series of True/False per row
        df[df["price"] > 50]      # → only rows where True
        ```

        Result: rows B (`75`) and D (`90`).

        Combine conditions with `&` (and) and `|` (or) — use parentheses around each condition:
        ```python
        df[(df["price"] > 50) & (df["price"] < 100)]
        df[(df["category"] == "food") | (df["category"] == "drink")]
        ```

        Note: do NOT use Python's `and`/`or` keywords for combining — use `&`/`|` instead.

---

!!! question "Week 8 — Question 5: Handling Missing Values"
    A DataFrame has `NaN` values in the `"score"` column. What does `df.dropna()` do?

    * [ ] A) Fills `NaN` values with 0
    * [ ] B) Removes columns that have any `NaN`
    * [x] C) Removes rows that have any `NaN` in any column
    * [ ] D) Returns the count of missing values

    ??? success "Check Answer"
        ✅ **Correct Answer: C) Removes rows that have any `NaN` in any column**

        ```python
        df.dropna()                      # drop rows with ANY missing value
        df.dropna(subset=["score"])      # drop rows where "score" is NaN only
        df.dropna(axis=1)               # drop columns with any NaN
        df.fillna(0)                     # fill NaN with 0
        df["score"].fillna(df["score"].mean())  # fill with column mean
        ```

        `dropna()` returns a **new DataFrame** — the original is unchanged unless you use `inplace=True` or reassign:
        ```python
        df = df.dropna()   # save the result back
        ```

---

!!! question "Week 8 — Question 6: groupby() and Aggregation"
    What does this code produce?

    ```python
    import pandas as pd

    df = pd.DataFrame({
        "category": ["food", "tech", "food", "tech", "food"],
        "sales":    [100,    200,    150,    300,    120]
    })

    result = df.groupby("category")["sales"].sum()
    print(result)
    ```

    * [x] A) `food: 370` / `tech: 500`
    * [ ] B) `food: 150` / `tech: 300` (the max values)
    * [ ] C) `food: 3` / `tech: 2` (the counts)
    * [ ] D) `TypeError: groupby requires numeric columns only`

    ??? success "Check Answer"
        ✅ **Correct Answer: A) `food: 370` / `tech: 500`**

        `groupby()` groups rows by category, then `.sum()` totals the sales within each group:

        ```
        food: 100 + 150 + 120 = 370
        tech: 200 + 300       = 500
        ```

        Common aggregation functions after `groupby()`:
        ```python
        .sum()    # total
        .mean()   # average
        .count()  # number of rows
        .max()    # highest value
        .min()    # lowest value
        .agg(["sum", "mean", "count"])  # multiple at once
        ```

---

!!! question "Week 8 — Question 7: Adding a New Column"
    How do you add a `"discount_price"` column that is 10% off the `"price"` column?

    * [ ] A) `df.add_column("discount_price", df["price"] * 0.9)`
    * [x] B) `df["discount_price"] = df["price"] * 0.9`
    * [ ] C) `df.discount_price = df.price * 0.9`
    * [ ] D) `df.insert("discount_price", df["price"] * 0.9)`

    ??? success "Check Answer"
        ✅ **Correct Answer: B) `df["discount_price"] = df["price"] * 0.9`**

        Assignment to a new column name creates it automatically:

        ```python
        df["discount_price"] = df["price"] * 0.9
        ```

        This works because pandas applies the multiplication to every row at once (vectorized operation) — no loop needed.

        More column operations:
        ```python
        df["total"] = df["qty"] * df["price"]          # multiply two columns
        df["label"] = df["name"].str.upper()           # string method on a column
        df["is_expensive"] = df["price"] > 100         # boolean column
        ```

---

!!! question "Week 8 — Question 8: Saving to CSV"
    How do you save a DataFrame to a CSV file without the index column?

    * [ ] A) `df.save("output.csv")`
    * [ ] B) `df.to_csv("output.csv")`
    * [x] C) `df.to_csv("output.csv", index=False)`
    * [ ] D) `csv.write(df, "output.csv")`

    ??? success "Check Answer"
        ✅ **Correct Answer: C) `df.to_csv("output.csv", index=False)`**

        By default, `df.to_csv()` includes the row index (0, 1, 2, ...) as the first column. This is rarely useful and clutters the output. Use `index=False` to omit it:

        ```python
        df.to_csv("output.csv", index=False)
        df.to_csv("output.csv", index=False, encoding="utf-8")   # safe for special characters
        ```

        Other export formats:
        ```python
        df.to_excel("output.xlsx", index=False)
        df.to_json("output.json", orient="records")
        ```

---

!!! question "Week 8 — Question 9: value_counts()"
    What does this code do?

    ```python
    df["category"].value_counts()
    ```

    * [ ] A) Returns the unique values in the column
    * [x] B) Returns each unique value and how many times it appears, sorted by count
    * [ ] C) Returns the total number of rows
    * [ ] D) Returns `True` if all values are the same

    ??? success "Check Answer"
        ✅ **Correct Answer: B) Returns each unique value and how many times it appears, sorted by count**

        ```python
        df["category"].value_counts()
        # food    3
        # tech    2
        # dtype: int64
        ```

        It's the fastest way to explore a categorical column. Related methods:
        ```python
        df["category"].nunique()       # number of distinct values
        df["category"].unique()        # array of distinct values
        df["price"].describe()         # stats: mean, std, min, 25%, 50%, 75%, max
        ```

---

!!! question "Week 8 — Question 10: Sorting a DataFrame"
    How do you sort the DataFrame by `"sales"` in descending order?

    ```python
    df = pd.DataFrame({
        "product": ["A", "B", "C"],
        "sales":   [150,  80,  220]
    })
    ```

    * [ ] A) `df.sort("sales", reverse=True)`
    * [ ] B) `df.order_by("sales", ascending=False)`
    * [x] C) `df.sort_values("sales", ascending=False)`
    * [ ] D) `sorted(df, key=lambda x: x["sales"])`

    ??? success "Check Answer"
        ✅ **Correct Answer: C) `df.sort_values("sales", ascending=False)`**

        ```python
        df.sort_values("sales")                  # ascending (default)
        df.sort_values("sales", ascending=False)  # descending
        df.sort_values(["category", "sales"])     # sort by multiple columns
        ```

        Like most pandas operations, `sort_values()` returns a **new DataFrame**. Save it back or use `inplace=True`:
        ```python
        df = df.sort_values("sales", ascending=False)
        # or
        df.sort_values("sales", ascending=False, inplace=True)
        ```
