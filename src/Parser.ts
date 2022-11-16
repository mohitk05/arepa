import { Token, TokenType } from "./Lexer";

interface ASTNodeInterface {
  evaluate(argContext?: FunctionArgContext): string | number | boolean;
}

class Literal implements ASTNodeInterface {
  token: Token;
  constructor(token: Token) {
    this.token = token;
  }

  evaluate(argContext?: FunctionArgContext): string | number | boolean {
    return argContext ? argContext[this.token.value] : this.token.value;
  }
}

class Primitive extends Literal {
  token: Token;
  constructor(token: Token) {
    super(token);
    this.token = token;
  }

  evaluate(): string | number {
    switch (this.token.type) {
      case TokenType.NumberValue:
        return Number(this.token.value);
      case TokenType.StringValue:
        return this.token.value;
    }
  }
}
class List implements ASTNodeInterface {
  args: Argument[];
  constructor(args: Argument[]) {
    this.args = args;
  }

  evaluate(argContext?: FunctionArgContext): string | number | boolean {
    return this.args
      .reduce((acc, curr) => {
        return acc + curr.evaluate(argContext) + "\n";
      }, "")
      .trim();
  }

  slice(start?: number, end?: number) {
    return this.args.slice(start, end);
  }
}

type LiteralOrList = Literal | List;
type Argument = LiteralOrList;

type FunctionArgContext = Record<string, string | number | boolean>;

export enum OperatorType {
  Root,
  Addition,
  Subract,
  Multiply,
  Divide,
  Remainder,
  If,
  Defunc,
  FunctionCall,
}

class Expression extends List {
  operator: OperatorType;
  constructor(operator?: OperatorType) {
    super([]);
    this.operator = operator;
  }

  evaluate(argContext?: FunctionArgContext): string | number | boolean {
    return "";
  }
}

export type AST = List;

class Addition extends Expression {
  constructor() {
    super(OperatorType.Addition);
  }

  evaluate(argContext?: FunctionArgContext): string | number {
    let sum;

    const values = this.args.map((arg) => arg.evaluate(argContext));

    if (values.every((value) => typeof value === "number")) {
      sum = 0;
    } else if (values.every((value) => typeof value === "string")) {
      sum = "";
    } else {
      throw new Error("Cannot add a string to a number");
    }

    return values.reduce((acc, curr) => {
      return acc + curr;
    }, sum);
  }
}

class Subtraction extends Expression {
  constructor() {
    super(OperatorType.Subract);
  }

  evaluate(argContext?: FunctionArgContext): number {
    let diff = null;

    for (const arg of this.args) {
      const value = arg.evaluate(argContext);
      if (typeof value === "number") {
        if (diff === null) {
          diff = value;
        } else {
          diff -= value;
        }
      } else {
        throw new Error("Cannot subtract a string from a number");
      }
    }

    return diff;
  }
}

class Multiplication extends Expression {
  constructor() {
    super(OperatorType.Multiply);
  }

  evaluate(argContext?: FunctionArgContext): number {
    let prod = 1;

    for (const arg of this.args) {
      const value = arg.evaluate(argContext);
      if (typeof value === "number") {
        prod *= value;
      } else {
        throw new Error("Cannot multiply a string with a number");
      }
    }

    return prod;
  }
}

class Division extends Expression {
  constructor() {
    super(OperatorType.Divide);
  }

  evaluate(argContext?: FunctionArgContext): number {
    let quotient = null;

    for (const arg of this.args) {
      const value = arg.evaluate(argContext);
      if (typeof value === "number") {
        if (value === 0) {
          throw new Error("Cannot divide by zero");
        }
        if (quotient === null) {
          quotient = value;
        } else {
          quotient /= value;
        }
      } else {
        throw new Error("Cannot subtract a string from a number");
      }
    }

    return quotient;
  }
}

class Remainder extends Expression {
  constructor() {
    super(OperatorType.Remainder);
  }

  evaluate(argContext?: FunctionArgContext): number {
    let remainder = null;

    if (this.args.length !== 2) {
      throw new Error("Only 2 arguments allowed for 're'.");
    }

    if (this.args[1].evaluate(argContext) === 0) {
      throw new Error("Divide by zero not allowed.");
    }

    const a = this.args[0].evaluate(argContext) as number,
      b = this.args[1].evaluate(argContext) as number;

    return a % b;
  }
}

class Comparison extends Expression {
  constructor() {
    super(OperatorType.If);
  }

  evaluate(argContext?: FunctionArgContext) {
    if (this.args.length > 3) {
      throw new Error(
        "If operator cannot have more that 3 arguments. Usage: (if condition true-exp false-exp)"
      );
    }

    const condition = this.args[0];
    if (condition.evaluate(argContext)) {
      return this.args[1].evaluate(argContext);
    } else if (this.args[2]) {
      return this.args[2].evaluate(argContext);
    }
  }
}

class FunctionDefinition extends Expression {
  name: string;
  arguments: List;
  body: LiteralOrList;
  constructor() {
    super(OperatorType.Defunc);
  }

  evaluate(): boolean {
    this.name = this.args[0].evaluate() as string;
    this.arguments = this.args[1] as List;
    this.body = this.args[2];
    return true;
  }

  get functionValue(): LanguageFunction {
    return {
      name: this.name,
      arguments: this.arguments,
      body: this.body,
    };
  }
}

class FunctionCall extends Expression {
  private _name: string;
  private _function: LanguageFunction;
  constructor(name: LanguageFunction["name"], func: LanguageFunction) {
    super(OperatorType.FunctionCall);
    this._name = name;
    this._function = func;
  }

  evaluate(argContext?: FunctionArgContext): string | number | boolean {
    return FunctionCall.apply(this._function, this.args, argContext);
  }

  static flatten(
    args: LiteralOrList[],
    argContext?: FunctionArgContext
  ): (string | number | boolean)[] {
    return args.reduce((acc, curr) => {
      if (curr instanceof Literal || curr instanceof Expression) {
        return [...acc, curr.evaluate(argContext)];
      } else {
        return [...acc, ...FunctionCall.flatten(curr.args)];
      }
    }, []);
  }

  static apply(
    func: LanguageFunction,
    args: LiteralOrList[],
    prevArgContext?: FunctionArgContext
  ): string | number | boolean {
    const argValues = FunctionCall.flatten(args, prevArgContext);
    const argContext: Record<string, string | number | boolean> = {};
    func.arguments.args.forEach((arg, i) => {
      const value = arg.evaluate() as string;
      argContext[value] = argValues[i];
    });

    return func.body.evaluate(argContext);
  }
}

interface LanguageFunction {
  name: string;
  arguments: List;
  body: LiteralOrList;
}

class Stack<T> {
  stack: Array<T>;
  constructor() {
    this.stack = [];
  }

  push(value: T) {
    this.stack.push(value);
  }

  pop() {
    const popped = this.stack.pop();
    return popped;
  }

  peek() {
    return this.stack[this.stack.length - 1];
  }

  get length() {
    return this.stack.length;
  }
}

export class Parser {
  private _tokens: Token[];
  private _ast: AST;
  private _definedFunctions: Map<Token["value"], LanguageFunction>;
  private static _ArithmeticOperatorSet: Set<TokenType> = new Set([
    TokenType.AddOperator,
    TokenType.SubtractOperator,
    TokenType.MultiplyOperator,
    TokenType.DivideOperator,
    TokenType.RemainderOperator,
  ]);
  private static _LanguageKeyword = new Set([
    TokenType.IfOperator,
    TokenType.DefuncOperator,
  ]);
  constructor(tokens: Token[]) {
    this._tokens = tokens;
    this._definedFunctions = new Map();
    this.generateAST();
  }

  private isValidDefinedFunction(token: Token): boolean {
    return this._definedFunctions.has(token.value);
  }

  private isValidKnownLiteral(token: Token): boolean {
    if (Parser._ArithmeticOperatorSet.has(token.type)) return true;
    if (Parser._LanguageKeyword.has(token.type)) return true;
    if (this.isValidDefinedFunction(token)) return true;

    return false;
  }

  // (+ 1 2)
  generateAST() {
    let i = 0,
      tokensLength = this._tokens.length,
      stack = new Stack<List>(),
      parsingFunctionDefinition = false;
    while (i < tokensLength) {
      const token = this._tokens[i];
      switch (token.type) {
        case TokenType.LeftParentheses:
          const newList = new List([]);
          stack.push(newList);
          i++;
          break;
        case TokenType.RightParentheses: {
          const op = stack.pop();
          if (stack.peek()) {
            const previous = stack.peek();
            if (op instanceof FunctionDefinition) {
              op.evaluate();
              this._definedFunctions.set(op.name, op.functionValue);
              parsingFunctionDefinition = false;
            } else {
              previous.args.push(op);
            }
          } else {
            // Last step, entire AST
            stack.push(op);
          }
          i++;
          break;
        }
        default: {
          if (
            stack.peek().args.length === 0 &&
            this.isValidKnownLiteral(token)
          ) {
            stack.pop();
          }
          switch (token.type) {
            case TokenType.AddOperator:
              stack.push(new Addition());
              i++;
              break;
            case TokenType.SubtractOperator:
              stack.push(new Subtraction());
              i++;
              break;
            case TokenType.MultiplyOperator:
              stack.push(new Multiplication());
              i++;
              break;
            case TokenType.DivideOperator:
              stack.push(new Division());
              i++;
              break;
            case TokenType.RemainderOperator:
              stack.push(new Remainder());
              i++;
              break;
            case TokenType.IfOperator:
              stack.push(new Comparison());
              i++;
              break;
            case TokenType.NumberValue:
            case TokenType.StringValue: {
              const op = stack.peek();
              op.args.push(new Primitive(token));
              i++;
              break;
            }
            case TokenType.DefuncOperator:
              stack.push(new FunctionDefinition());
              parsingFunctionDefinition = true;
              i++;
              break;
            case TokenType.CustomLiteral: {
              if (this.isValidDefinedFunction(token)) {
                stack.push(
                  new FunctionCall(
                    token.value,
                    this._definedFunctions.get(token.value)
                  )
                );
              } else if (parsingFunctionDefinition) {
                const op = stack.peek();
                op.args.push(new Literal(token));
              } else {
                throw new Error(
                  `Unidentified token: '${token.value}'. You must define a function before usage.`
                );
              }
              i++;
              break;
            }
          }
        }
      }
    }

    this._ast = stack.pop();
  }

  getAST() {
    return this._ast;
  }
}
