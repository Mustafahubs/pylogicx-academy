# Week 13 Quiz — Git & GitHub

---

!!! question "Week 13 — Question 1: git init"
    What does `git init` do?

    * [ ] A) Downloads a repository from GitHub
    * [ ] B) Creates your first commit
    * [x] C) Initialises a new local Git repository in the current folder (creates a hidden `.git/` directory)
    * [ ] D) Connects your folder to a GitHub remote

    ??? success "Check Answer"
        ✅ **Correct Answer: C) Initialises a new local Git repository**

        ```bash
        mkdir my-project
        cd my-project
        git init
        # → Initialized empty Git repository in .../my-project/.git/
        ```

        The `.git/` folder contains the entire history and configuration. Delete `.git/` and you lose all version history (but your files remain).

        You only run `git init` once per project. For existing GitHub repos, use `git clone` instead — it initialises Git AND downloads the repo.

---

!!! question "Week 13 — Question 2: Staging vs Committing"
    What is the difference between `git add` and `git commit`?

    * [ ] A) `git add` saves to GitHub; `git commit` saves locally
    * [x] B) `git add` stages changes (marks them for inclusion); `git commit` saves the staged snapshot to the local history
    * [ ] C) `git add` creates a branch; `git commit` merges it
    * [ ] D) They do the same thing — `git add` is just an older alias

    ??? success "Check Answer"
        ✅ **Correct Answer: B) `git add` stages; `git commit` saves**

        Git has a three-area model:

        ```
        Working directory → [git add] → Staging area → [git commit] → Local history
        ```

        ```bash
        git add report.py          # stage one file
        git add .                  # stage everything changed
        git commit -m "Add report" # save staged snapshot with a message
        ```

        The staging area lets you choose *exactly* what goes into each commit. You might change 5 files but commit them as 2 separate, logical commits — one for the feature, one for the bug fix.

---

!!! question "Week 13 — Question 3: git status"
    What information does `git status` show?

    * [ ] A) The last 10 commits on the current branch
    * [x] B) Which files are modified, staged, or untracked in the working directory
    * [ ] C) The current branch's difference from the remote
    * [ ] D) A list of all branches

    ??? success "Check Answer"
        ✅ **Correct Answer: B) Modified, staged, and untracked files**

        `git status` output:
        ```
        On branch main

        Changes to be committed:     ← staged (green)
          modified: app.py

        Changes not staged:          ← modified but not staged (red)
          modified: utils.py

        Untracked files:             ← new files Git doesn't know about
          new_feature.py
        ```

        Run `git status` constantly — before adding, before committing, after pulling. It's your orientation tool.

---

!!! question "Week 13 — Question 4: git log"
    What does `git log --oneline` show?

    * [ ] A) All files changed in the last commit
    * [x] B) A condensed list of commits — one line each showing hash and message
    * [ ] C) Branches that haven't been merged yet
    * [ ] D) The diff between current and previous commit

    ??? success "Check Answer"
        ✅ **Correct Answer: B) Condensed commit history — one line per commit**

        ```bash
        git log --oneline
        # a3f9b12 Add email automation module
        # 7d42c01 Fix CSV export bug
        # 2b91e5f Initial commit
        ```

        Other useful `git log` variants:
        ```bash
        git log                    # full details — author, date, full message
        git log --oneline -5       # last 5 commits
        git log --oneline --graph  # ASCII branch graph
        git log --author="Alice"   # commits by specific author
        git log filename.py        # commits that touched a specific file
        ```

---

!!! question "Week 13 — Question 5: Branches"
    Why do developers work on feature branches instead of directly on `main`?

    * [ ] A) `main` is read-only — Git prevents commits to it
    * [x] B) Branches isolate work-in-progress so `main` stays stable and deployable at all times
    * [ ] C) Feature branches are faster because they skip the staging area
    * [ ] D) GitHub requires branches — you can't push directly to `main`

    ??? success "Check Answer"
        ✅ **Correct Answer: B) Branches keep `main` stable**

        ```bash
        git branch feature/email-report   # create branch
        git checkout feature/email-report  # switch to it
        # or in one command:
        git checkout -b feature/email-report

        # work, commit, test...
        git checkout main
        git merge feature/email-report    # merge when ready
        ```

        If the feature breaks something, `main` is unaffected. Multiple developers can work on different features simultaneously without interfering with each other.

---

!!! question "Week 13 — Question 6: .gitignore"
    Why do you add `.env` to `.gitignore`?

    * [ ] A) `.env` files cause syntax errors when pushed to GitHub
    * [x] B) `.env` contains secrets (API keys, passwords) that should never be in version control — even in private repos
    * [ ] C) Git cannot track `.env` files — they're binary
    * [ ] D) `.env` files are too large for GitHub

    ??? success "Check Answer"
        ✅ **Correct Answer: B) `.env` contains secrets that must never be committed**

        ```
        # .gitignore
        .env
        __pycache__/
        *.pyc
        site/
        .DS_Store
        ```

        Once a secret is in Git history, it's there forever — even if you delete the file in a later commit, it lives in `git log`. Secrets pushed to GitHub (even private) can be exposed by attackers, GitHub security scanning, or accidental repo visibility changes.

        **The rule:** never commit `.env`. Add it to `.gitignore` before your first `git add`.

---

!!! question "Week 13 — Question 7: git push vs git pull"
    What is the difference between `git push` and `git pull`?

    * [x] A) `push` uploads local commits to the remote; `pull` downloads remote commits to local
    * [ ] B) `push` creates a new branch; `pull` merges branches
    * [ ] C) `push` is for files; `pull` is for commits
    * [ ] D) They are the same — `pull` is the older command

    ??? success "Check Answer"
        ✅ **Correct Answer: A) `push` uploads; `pull` downloads**

        ```bash
        git push origin main    # upload local main → remote main
        git pull origin main    # download remote main → local main (and merge)
        ```

        `git pull` = `git fetch` + `git merge`.

        Typical workflow:
        ```bash
        git pull                 # get latest changes from team
        # ... make changes ...
        git add .
        git commit -m "Feature X"
        git push                 # share your changes
        ```

        Always pull before pushing when collaborating — this prevents conflicts.

---

!!! question "Week 13 — Question 8: Pull Requests"
    What is a Pull Request (PR) on GitHub?

    * [ ] A) A request to download a file from GitHub
    * [ ] B) A git command that merges two branches automatically
    * [x] C) A request for your branch to be reviewed and merged into another branch (usually `main`)
    * [ ] D) A way to pull changes from a remote without creating a local branch

    ??? success "Check Answer"
        ✅ **Correct Answer: C) A request for code review and merge**

        Pull Request workflow:
        ```
        1. Create a feature branch locally
        2. Push the branch to GitHub
        3. Open a PR on GitHub (your branch → main)
        4. Team reviews the code, leaves comments
        5. You address feedback with new commits
        6. PR is approved and merged into main
        7. Delete the feature branch
        ```

        PRs are the standard collaboration mechanism in professional software teams. They create a permanent record of what changed, why, and who reviewed it.

---

!!! question "Week 13 — Question 9: git clone"
    What does `git clone https://github.com/user/repo.git` do?

    * [ ] A) Creates an empty local repository linked to GitHub
    * [x] B) Downloads the full repository (all files, history, branches) to a new local folder
    * [ ] C) Downloads only the latest version of the files, without history
    * [ ] D) Copies the repository to your GitHub account

    ??? success "Check Answer"
        ✅ **Correct Answer: B) Downloads the full repository including all history**

        ```bash
        git clone https://github.com/user/repo.git
        # creates a folder called "repo/" with:
        # - all files
        # - full git history (git log works immediately)
        # - the remote "origin" already configured
        ```

        After cloning, you can immediately run `git pull` to get updates, `git push` to contribute back (if you have permission), and `git log` to see the full history.

        `git clone` is how you start working on any existing project.

---

!!! question "Week 13 — Question 10: Merge Conflict"
    Two developers edited the same line in the same file. They both push to `main`. What happens?

    * [ ] A) Git automatically picks the newer version
    * [ ] B) Both changes are combined automatically
    * [x] C) A merge conflict occurs — Git marks the conflict in the file and the developer must manually resolve it
    * [ ] D) Git raises an error and reverts the second push

    ??? success "Check Answer"
        ✅ **Correct Answer: C) A merge conflict — must be resolved manually**

        Git marks the conflict with special markers:
        ```
        <<<<<<< HEAD
        print("Alice's version")
        =======
        print("Bob's version")
        >>>>>>> feature/bob-changes
        ```

        To resolve:
        1. Open the file and decide which version (or a combination) is correct
        2. Delete the conflict markers
        3. `git add` the resolved file
        4. `git commit` to complete the merge

        Conflicts are normal in team workflows. The best prevention: communicate with your team, pull before you start working, and keep commits small and focused.
