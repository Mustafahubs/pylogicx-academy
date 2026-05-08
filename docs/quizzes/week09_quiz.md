# Week 9 Quiz — Email Automation with smtplib

---

!!! question "Week 9 — Question 1: smtplib.SMTP vs SMTP_SSL"
    What is the difference between `smtplib.SMTP` and `smtplib.SMTP_SSL`?

    * [ ] A) `SMTP_SSL` is faster; `SMTP` is more compatible
    * [x] B) `SMTP_SSL` opens an encrypted connection from the start (port 465); `SMTP` starts unencrypted and can upgrade with STARTTLS (port 587)
    * [ ] C) `SMTP` requires a password; `SMTP_SSL` does not
    * [ ] D) They are identical — `SMTP_SSL` is just an alias

    ??? success "Check Answer"
        ✅ **Correct Answer: B) `SMTP_SSL` opens encrypted immediately; `SMTP` upgrades with STARTTLS**

        Two common patterns:

        ```python
        # Pattern 1: SMTP_SSL (port 465) — encrypted from the start
        with smtplib.SMTP_SSL("smtp.gmail.com", 465) as server:
            server.login(EMAIL, PASSWORD)
            server.sendmail(...)

        # Pattern 2: SMTP + STARTTLS (port 587) — upgrades to TLS
        with smtplib.SMTP("smtp.gmail.com", 587) as server:
            server.starttls()          # ← upgrade to encrypted
            server.login(EMAIL, PASSWORD)
            server.sendmail(...)
        ```

        Both are secure. For Gmail, both work. Check your email provider's documentation for the correct port and method.

---

!!! question "Week 9 — Question 2: MIMEMultipart and MIMEText"
    Why do we use `MIMEMultipart` and `MIMEText` to build emails?

    ```python
    from email.mime.multipart import MIMEMultipart
    from email.mime.text import MIMEText

    msg = MIMEMultipart()
    msg["From"] = "you@gmail.com"
    msg["To"] = "student@example.com"
    msg["Subject"] = "Your grade"
    msg.attach(MIMEText("You passed!", "plain"))
    ```

    * [ ] A) Because `smtplib.sendmail()` only accepts these objects
    * [x] B) To build a properly structured email with headers, body, and optional attachments according to the MIME standard
    * [ ] C) Because plain strings cannot contain special characters in emails
    * [ ] D) `MIMEText` is required to encode the email as Base64

    ??? success "Check Answer"
        ✅ **Correct Answer: B) To build a properly structured email with MIME headers, body, and attachments**

        A raw `smtplib.sendmail()` can only send plain text. MIME classes let you build rich emails:

        ```python
        msg = MIMEMultipart("alternative")  # for HTML + plain text fallback
        msg.attach(MIMEText(plain_body, "plain"))
        msg.attach(MIMEText(html_body, "html"))  # email clients use the last part
        ```

        The MIME standard defines how email content (text, HTML, attachments) is encoded so that every email client can display it correctly.

---

!!! question "Week 9 — Question 3: Gmail App Password"
    A student wants to send email through Gmail with Python. They try their regular Gmail password and get an authentication error. What is the correct fix?

    * [ ] A) Use `smtplib.SMTP` instead of `smtplib.SMTP_SSL`
    * [ ] B) Disable the firewall on their computer
    * [x] C) Generate a 16-character App Password in Google Account settings (requires 2FA enabled)
    * [ ] D) Change the port from 465 to 25

    ??? success "Check Answer"
        ✅ **Correct Answer: C) Generate a 16-character App Password in Google Account settings**

        Google blocks "less secure app" sign-ins by default. To use Python with Gmail:

        1. Enable 2-Step Verification on your Google Account
        2. Go to: Google Account → Security → App Passwords
        3. Generate a password for "Mail" on "Windows Computer" (or any label)
        4. Use that 16-character password in your Python script — not your real Gmail password

        Store the App Password in a `.env` file:
        ```
        GMAIL_APP_PASSWORD=abcd efgh ijkl mnop
        ```
        ```python
        PASSWORD = os.getenv("GMAIL_APP_PASSWORD")
        ```

---

!!! question "Week 9 — Question 4: Sending to Multiple Recipients"
    How do you send the same email to multiple recipients?

    ```python
    recipients = ["alice@example.com", "bob@example.com", "carol@example.com"]
    ```

    * [ ] A) Call `server.sendmail()` three times in a loop, once per address
    * [ ] B) `msg["To"] = recipients` — pass the list directly
    * [x] C) `msg["To"] = ", ".join(recipients)` for the header; pass the list to `server.sendmail()`
    * [ ] D) Email protocols do not support multiple recipients

    ??? success "Check Answer"
        ✅ **Correct Answer: C) Join for the header; pass the list to `sendmail()`**

        The `To:` header is a human-readable string. `sendmail()` takes the actual delivery list:

        ```python
        recipients = ["alice@example.com", "bob@example.com"]

        msg["To"] = ", ".join(recipients)    # header: "alice@..., bob@..."

        server.sendmail(
            from_addr=SENDER,
            to_addrs=recipients,             # pass the list here
            msg=msg.as_string()
        )
        ```

        Each recipient gets a separate copy. If you want to hide recipients from each other, use BCC — add them to `to_addrs` but leave them out of `msg["To"]`.

---

!!! question "Week 9 — Question 5: Personalising Bulk Emails"
    A student wants to send each student their personal score. Which approach is correct?

    ```python
    students = [
        {"name": "Alice", "email": "alice@ex.com", "score": 92},
        {"name": "Bob",   "email": "bob@ex.com",   "score": 78},
    ]
    ```

    * [ ] A) Send one email with all names and scores in the body
    * [x] B) Loop through `students`, build a new `msg` per student, and call `server.sendmail()` for each one
    * [ ] C) Use `msg["To"] = [s["email"] for s in students]` and one `sendmail()` call
    * [ ] D) Personalised emails require a paid SMTP service

    ??? success "Check Answer"
        ✅ **Correct Answer: B) Build a new message per student inside a loop**

        ```python
        with smtplib.SMTP_SSL("smtp.gmail.com", 465) as server:
            server.login(SENDER, PASSWORD)

            for student in students:
                msg = MIMEMultipart()
                msg["From"] = SENDER
                msg["To"] = student["email"]
                msg["Subject"] = "Your quiz result"

                body = f"Hi {student['name']},\n\nYour score: {student['score']}/100"
                msg.attach(MIMEText(body, "plain"))

                server.sendmail(SENDER, student["email"], msg.as_string())
        ```

        Build a fresh `msg` object for each recipient so each email has the correct name and score.

---

!!! question "Week 9 — Question 6: msg.as_string()"
    What does `msg.as_string()` return, and why is it needed?

    * [ ] A) The email subject line as a plain string
    * [ ] B) A list of all recipients
    * [x] C) The complete MIME-formatted email as a single string, which is what `sendmail()` requires
    * [ ] D) The email body only, without headers

    ??? success "Check Answer"
        ✅ **Correct Answer: C) The complete MIME-formatted email as a single string**

        `server.sendmail()` expects a string, not a `MIMEMultipart` object. `.as_string()` serialises the entire message — headers + body + attachments — into the RFC 2822 format:

        ```
        From: you@gmail.com
        To: student@example.com
        Subject: Your grade
        Content-Type: text/plain; charset="utf-8"

        You passed!
        ```

        ```python
        server.sendmail(SENDER, recipient, msg.as_string())
        ```

        Without `.as_string()`, Python would raise a `TypeError` because `sendmail()` can't accept a MIME object directly.

---

!!! question "Week 9 — Question 7: try/except for SMTP Errors"
    What is the most important reason to wrap `server.login()` and `server.sendmail()` in a `try/except`?

    * [ ] A) To make the code run faster
    * [x] B) Authentication failures, network drops, and invalid addresses raise exceptions — without handling them, the whole script crashes
    * [ ] C) `smtplib` functions always return error codes that must be checked
    * [ ] D) `try/except` is required by the smtplib documentation

    ??? success "Check Answer"
        ✅ **Correct Answer: B) Authentication failures, network drops, and invalid addresses raise exceptions**

        ```python
        import smtplib

        try:
            with smtplib.SMTP_SSL("smtp.gmail.com", 465) as server:
                server.login(SENDER, PASSWORD)
                server.sendmail(SENDER, recipient, msg.as_string())
            print(f"Sent to {recipient}")
        except smtplib.SMTPAuthenticationError:
            print("Wrong password or App Password not set up.")
        except smtplib.SMTPException as e:
            print(f"SMTP error: {e}")
        except Exception as e:
            print(f"Unexpected error: {e}")
        ```

        In a bulk email script, you typically want to catch errors per recipient and continue — not crash the whole run because one address was invalid.

---

!!! question "Week 9 — Question 8: Reading Recipients from a CSV"
    A teacher has a CSV with student names and emails. What is the cleanest way to load them for a bulk email script?

    ```
    name,email,score
    Alice,alice@ex.com,92
    Bob,bob@ex.com,78
    ```

    * [ ] A) Read the file with `open()` and split each line on commas
    * [x] B) Use `pd.read_csv()` and iterate with `df.iterrows()` or convert to `to_dict("records")`
    * [ ] C) Read the file with `json.load()` after converting it
    * [ ] D) Use `csv.reader()` and manually skip the header row

    ??? success "Check Answer"
        ✅ **Correct Answer: B) Use `pd.read_csv()` and iterate conveniently**

        ```python
        import pandas as pd

        df = pd.read_csv("students.csv")

        for _, row in df.iterrows():
            name  = row["name"]
            email = row["email"]
            score = row["score"]
            # build and send email...
        ```

        Or convert to a list of dicts first:
        ```python
        students = df.to_dict("records")
        # → [{"name": "Alice", "email": "alice@ex.com", "score": 92}, ...]
        ```

        `csv.reader()` (Option D) also works, but pandas saves you the manual header-skip and type conversion.

---

!!! question "Week 9 — Question 9: HTML Email"
    How do you send an HTML email while also providing a plain-text fallback for older clients?

    * [ ] A) Send the HTML string directly to `MIMEText(html_body, "html")`
    * [ ] B) Use `MIMEMultipart("mixed")` and attach two `MIMEText` objects
    * [x] C) Use `MIMEMultipart("alternative")` and attach plain-text first, then HTML
    * [ ] D) HTML emails require a third-party library — `smtplib` only supports plain text

    ??? success "Check Answer"
        ✅ **Correct Answer: C) Use `MIMEMultipart("alternative")` with plain first, HTML second**

        ```python
        from email.mime.multipart import MIMEMultipart
        from email.mime.text import MIMEText

        msg = MIMEMultipart("alternative")
        msg["Subject"] = "Your result"

        plain = "You scored 92/100. Well done!"
        html  = "<h2>You scored <strong>92/100</strong>. Well done!</h2>"

        msg.attach(MIMEText(plain, "plain"))
        msg.attach(MIMEText(html,  "html"))
        ```

        Email clients pick the **last** `Content-Type` they understand. Modern clients show HTML; older ones fall back to plain text.

---

!!! question "Week 9 — Question 10: Keeping Credentials Out of Code"
    Which is the correct way to keep email credentials out of your Python script?

    * [ ] A) Store them in a variable at the top of the file with a comment `# do not share`
    * [ ] B) Hardcode them but only push to private GitHub repos
    * [x] C) Store in `.env`, load with `python-dotenv`, and add `.env` to `.gitignore`
    * [ ] D) Encrypt them with `base64.b64encode()` before storing in the script

    ??? success "Check Answer"
        ✅ **Correct Answer: C) Use `.env` + `python-dotenv` + `.gitignore`**

        ```
        # .env  (never commit this file)
        GMAIL_ADDRESS=you@gmail.com
        GMAIL_APP_PASSWORD=abcd efgh ijkl mnop
        ```

        ```python
        from dotenv import load_dotenv
        import os

        load_dotenv()

        SENDER   = os.getenv("GMAIL_ADDRESS")
        PASSWORD = os.getenv("GMAIL_APP_PASSWORD")
        ```

        ```
        # .gitignore
        .env
        ```

        Base64 (Option D) is **encoding**, not encryption — anyone can decode it in one line. Private repos (Option B) can be accidentally made public or accessed by collaborators. The `.env` + `.gitignore` pattern is the industry standard for local credentials.
