# arepa-lang

`arepa` is a tiny interepreted programming language derived from Scheme.

To run a program:

```bash
# Install ts-node globally and run
ts-node src/index.ts src/test.arp
```

The language currently supports single-line arithmetic operations and comparisons. Some examples:

```bash
(+ 10 3) # Output = 13
(* 2 (+ 4 1)) # Output = 10
(/ 100 (/ 25 (+ 2 3))) # Output = 20
# ---------------------------------------------------------------------
# Comparisons can be done using the "if" operator

# Syntax: (if <condition> <true expression> <false express>)
# If "condition" is evaluated to true, then execute "true expression"
# and return its value. If it is evaluated to false,
# then execute "false expression" and return its value.

(if 1 2 3) # Output = 2
(if (- 1 1) 2 3) # Output = 3
(if 0 1 (if 1 4 5)) # Output = 4
(if 1 "hello" "goodbye") # Output = "hello"
```
