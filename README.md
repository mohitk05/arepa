# arepa-lang

`arepa` is a tiny interepreted programming language based on LISP.

To run a program:

```bash
# Install ts-node globally and run
ts-node src/index.ts src/test.arp
```

### Arithmetic

```bash
(+ 10 3) # Output = 13
(* 2 (+ 4 1)) # Output = 10
(/ 100 (/ 25 (+ 2 3))) # Output = 20
```

### Conditionals

Comparisons can be done using the `if` operator

```bash
# Syntax: (if <condition> <true expression> <false express>)
# If "condition" is evaluated to true, then execute "true expression"
# and return its value. If it is evaluated to false,
# then execute "false expression" and return its value.

(if 1 2 3) # Output = 2
(if (- 1 1) 2 3) # Output = 3
(if 0 1 (if 1 4 5)) # Output = 4
(if 1 "hello" "goodbye") # Output = "hello"
```

### Lists

Everything in arepa inside a pair of `()` is a list. A list can be a set of any other type.

```bash
(1 2 3 4)
("a" "b" "c")
(1 (1 2) 4)
```

### Functions

Functions are a powerful construct in any language. They can be defined in arepa using the `defunc` operator.

```bash
(
    (defunc add (a b) (+ a b)) (add 1 2)
)
# Output = 3
```

As arepa is an interpreted language, the function definition should be before the function call. You can declare multiple functions and construct nested patterns.

```bash
(
    (defunc add (a b) (+ a b))
    (defunc square (a) (* a a))
    (square 2) # Output = 4
    (add 2 (square 4)) # Output = 18
    (defunc concat_w_space (a b) (+ a " " b))
    (concat_w_space "Have" "an" "arepa!") # Output = Have an arepa!
)
```

Recursion is not supported yet (I'll be working on it next!).

Remainder calculation can be done by using an inbuilt operator `re`. This can be used to build functions with conditional bodies.

```bash
(
    (defunc even_or_odd (num) (if (re num 2) "odd" "even"))
    (even_or_odd 4) # Output = "even"
    (even_or_odd 7) # Output = "odd"
)
```
