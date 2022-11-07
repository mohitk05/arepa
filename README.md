# arepa-lang

`arepa` is a tiny interepreted programming language derived from Scheme.

To run a program:

```bash
# Install ts-node globally and run
ts-node src/index.ts src/test.arp
```

The language currently supports single-line arithmetic operations. Some examples:

```bash
(+ 10 3) # Output = 13
(* 2 (+ 4 1)) # Output = 10
(/ 100 (/ 25 (+ 2 3))) # Output = 20
```
