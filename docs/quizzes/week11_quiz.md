# Week 11 Quiz — Object-Oriented Programming (OOP)

---

!!! question "Week 11 — Question 1: class vs Instance"
    What is the difference between a **class** and an **instance**?

    ```python
    class Dog:
        def __init__(self, name):
            self.name = name

    rex = Dog("Rex")
    ```

    * [ ] A) A class is a variable; an instance is a function
    * [x] B) A class is a blueprint; an instance is a specific object created from that blueprint
    * [ ] C) A class is in memory; an instance is on disk
    * [ ] D) They are the same thing — "instance" is just the technical term for a class

    ??? success "Check Answer"
        ✅ **Correct Answer: B) A class is a blueprint; an instance is a specific object**

        ```python
        class Dog:           # the blueprint — defines what Dogs have and can do
            def __init__(self, name):
                self.name = name

        rex  = Dog("Rex")    # instance 1 — a specific Dog
        spot = Dog("Spot")   # instance 2 — another specific Dog
        ```

        You can create unlimited instances from one class, each with its own data. The class itself is just the template — it doesn't hold any specific dog's name.

---

!!! question "Week 11 — Question 2: __init__ and self"
    What is `self` in a class method?

    ```python
    class BankAccount:
        def __init__(self, owner, balance=0):
            self.owner = owner
            self.balance = balance
    ```

    * [ ] A) A keyword that refers to the class itself
    * [x] B) A reference to the specific instance (object) being created or used
    * [ ] C) A required parameter name — you must always call it `self`
    * [ ] D) A placeholder for optional keyword arguments

    ??? success "Check Answer"
        ✅ **Correct Answer: B) A reference to the specific instance being created or used**

        `self` is automatically passed by Python when you call a method — you never pass it manually:

        ```python
        account = BankAccount("Alice", 1000)
        # Python calls: BankAccount.__init__(account, "Alice", 1000)
        # Inside __init__: self IS the account object
        ```

        `self.owner = owner` stores `"Alice"` ON the specific instance. Without `self.`, it would just be a local variable that disappears when `__init__` finishes.

        The name `self` is a convention, not a keyword — but **always use `self`**. Any other name confuses readers.

---

!!! question "Week 11 — Question 3: Instance Methods"
    What does this print?

    ```python
    class Circle:
        def __init__(self, radius):
            self.radius = radius

        def area(self):
            return 3.14159 * self.radius ** 2

    c = Circle(5)
    print(round(c.area(), 2))
    ```

    * [ ] A) `78.54` — correct (5² × π)
    * [x] B) `78.54`
    * [ ] C) `31.42` (circumference, not area)
    * [ ] D) `TypeError: area() takes 0 positional arguments but 1 was given`

    ??? success "Check Answer"
        ✅ **Correct Answer: B) `78.54`**

        ```python
        self.radius ** 2   →  5 ** 2 = 25
        3.14159 * 25       →  78.53975
        round(78.53975, 2) →  78.54
        ```

        Instance methods receive `self` automatically — you call `c.area()` with no arguments, but Python passes `c` as `self` behind the scenes.

        The `TypeError` in option D would appear if you forgot `self` in the method signature: `def area():` instead of `def area(self):`.

---

!!! question "Week 11 — Question 4: Inheritance"
    What does this print?

    ```python
    class Animal:
        def speak(self):
            return "..."

    class Dog(Animal):
        def speak(self):
            return "Woof!"

    class Cat(Animal):
        pass

    d = Dog()
    c = Cat()
    print(d.speak())
    print(c.speak())
    ```

    * [x] A) `Woof!` / `...`
    * [ ] B) `Woof!` / `Woof!`
    * [ ] C) `...` / `...`
    * [ ] D) `AttributeError: Cat has no method speak`

    ??? success "Check Answer"
        ✅ **Correct Answer: A) `Woof!` / `...`**

        `Dog` **overrides** `speak()` with its own version — `"Woof!"`.
        `Cat` has no `speak()`, so it **inherits** `speak()` from `Animal` — `"..."`.

        Inheritance lets child classes reuse parent code and selectively override only what's different. `pass` means "inherit everything from the parent, add nothing."

        This is the **is-a** relationship: a `Dog` IS-A `Animal`. A `Cat` IS-A `Animal`.

---

!!! question "Week 11 — Question 5: __str__ Method"
    What does `__str__` control?

    ```python
    class Student:
        def __init__(self, name, grade):
            self.name = name
            self.grade = grade

        def __str__(self):
            return f"{self.name} (Grade: {self.grade})"

    s = Student("Alice", "A")
    print(s)
    ```

    * [ ] A) `<__main__.Student object at 0x7f...>`
    * [x] B) `Alice (Grade: A)`
    * [ ] C) `Student(name=Alice, grade=A)`
    * [ ] D) `TypeError: Student is not printable`

    ??? success "Check Answer"
        ✅ **Correct Answer: B) `Alice (Grade: A)`**

        `__str__` is a **dunder (double underscore) method** — Python calls it automatically when you `print()` an object or use `str()` on it.

        Without `__str__`, `print(s)` shows the unhelpful memory address (`<__main__.Student object at 0x...>`).

        With `__str__`, you control exactly how the object looks as text. Always define `__str__` for any class users will print or display.

---

!!! question "Week 11 — Question 6: Class Variable vs Instance Variable"
    What does this print?

    ```python
    class Counter:
        count = 0   # class variable

        def __init__(self):
            Counter.count += 1
            self.id = Counter.count   # instance variable

    a = Counter()
    b = Counter()
    c = Counter()

    print(Counter.count)
    print(c.id)
    ```

    * [ ] A) `1` / `1`
    * [ ] B) `3` / `1`
    * [x] C) `3` / `3`
    * [ ] D) `3` / `Counter.count`

    ??? success "Check Answer"
        ✅ **Correct Answer: C) `3` / `3`**

        `count` is a **class variable** — shared across ALL instances. Every call to `__init__` increments the shared `Counter.count`.

        `self.id` is an **instance variable** — unique to each object. When `c` is created (third), `Counter.count` is already `3`, so `c.id = 3`.

        | Variable | Shared? | Accessed via |
        |----------|---------|-------------|
        | Class variable (`count`) | ✅ All instances | `Counter.count` or `self.count` |
        | Instance variable (`self.id`) | ❌ Per instance | `self.id` only |

---

!!! question "Week 11 — Question 7: super()"
    What does `super().__init__()` do in a child class?

    ```python
    class Vehicle:
        def __init__(self, make, model):
            self.make = make
            self.model = model

    class Car(Vehicle):
        def __init__(self, make, model, doors):
            super().__init__(make, model)   # ← this line
            self.doors = doors

    c = Car("Toyota", "Corolla", 4)
    print(c.make, c.doors)
    ```

    * [ ] A) Creates a new `Vehicle` object separate from the `Car`
    * [x] B) Calls the parent class's `__init__` to set up `self.make` and `self.model`
    * [ ] C) Copies the parent class's attributes by value
    * [ ] D) Raises `TypeError` — you cannot call `super()` in `__init__`

    ??? success "Check Answer"
        ✅ **Correct Answer: B) Calls the parent's `__init__` to initialise inherited attributes**

        Without `super().__init__(make, model)`, the `Car` object would never get `self.make` or `self.model` — they're only set in `Vehicle.__init__`.

        ```python
        c = Car("Toyota", "Corolla", 4)
        print(c.make)   # "Toyota"  ← set by Vehicle.__init__ via super()
        print(c.doors)  # 4          ← set by Car.__init__
        ```

        `super()` lets you extend the parent rather than replacing it entirely.

---

!!! question "Week 11 — Question 8: @property"
    What does the `@property` decorator do?

    ```python
    class Temperature:
        def __init__(self, celsius):
            self._celsius = celsius

        @property
        def fahrenheit(self):
            return self._celsius * 9/5 + 32

    t = Temperature(100)
    print(t.fahrenheit)   # no parentheses!
    ```

    * [ ] A) It makes `fahrenheit` a class variable
    * [x] B) It lets you call the method like an attribute (no parentheses needed at call site)
    * [ ] C) It prevents the method from being overridden
    * [ ] D) It caches the return value so the calculation only runs once

    ??? success "Check Answer"
        ✅ **Correct Answer: B) Lets you access a method like an attribute**

        Without `@property`: `t.fahrenheit()` — looks like a method call.
        With `@property`: `t.fahrenheit` — looks like reading an attribute.

        This is great for computed values that feel like data:
        ```python
        t.fahrenheit   # → 212.0  (100°C in Fahrenheit)
        ```

        Properties also allow validation when setting values with `@attr.setter`.

---

!!! question "Week 11 — Question 9: Encapsulation — Private Attributes"
    What is the convention for "private" attributes in Python?

    ```python
    class BankAccount:
        def __init__(self, balance):
            self._balance = balance   # or self.__balance

        def get_balance(self):
            return self._balance
    ```

    * [ ] A) Python enforces private attributes — they cannot be accessed outside the class
    * [x] B) Single underscore `_attr` is a convention meaning "don't touch from outside"; double underscore `__attr` triggers name-mangling but is still technically accessible
    * [ ] C) Private attributes are encrypted at runtime
    * [ ] D) You must use the `private` keyword before the attribute name

    ??? success "Check Answer"
        ✅ **Correct Answer: B) Conventions, not enforcement — Python trusts the programmer**

        Python has no true private attributes. The conventions are:

        | Prefix | Convention | Meaning |
        |--------|-----------|---------|
        | `_attr` | Single underscore | "Internal use — be careful" |
        | `__attr` | Double underscore | Name-mangled to `_ClassName__attr` — harder to access accidentally |

        ```python
        account = BankAccount(1000)
        account._balance       # works, but breaks the convention
        account.__balance      # AttributeError (name-mangled to _BankAccount__balance)
        account._BankAccount__balance  # still accessible — just annoying
        ```

        The mangling prevents accidental name clashes in inheritance, not intentional access.

---

!!! question "Week 11 — Question 10: isinstance()"
    What does `isinstance()` check?

    ```python
    class Animal: pass
    class Dog(Animal): pass

    d = Dog()

    print(isinstance(d, Dog))
    print(isinstance(d, Animal))
    print(isinstance(d, str))
    ```

    * [ ] A) `True` / `False` / `False`
    * [x] B) `True` / `True` / `False`
    * [ ] C) `True` / `True` / `True`
    * [ ] D) `False` / `True` / `False`

    ??? success "Check Answer"
        ✅ **Correct Answer: B) `True` / `True` / `False`**

        `isinstance(obj, Class)` returns `True` if `obj` is an instance of `Class` **or any of its parent classes**.

        `Dog` inherits from `Animal`, so a `Dog` instance IS-A `Dog` AND IS-A `Animal`.

        ```python
        isinstance(d, Dog)    # True  — d is a Dog
        isinstance(d, Animal) # True  — Dog is a subclass of Animal
        isinstance(d, str)    # False — Dog has nothing to do with str
        ```

        Use `isinstance()` instead of `type(obj) == Dog` — `isinstance` respects inheritance, `type()` does not.
