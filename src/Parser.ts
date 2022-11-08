import { Token, TokenType } from './Lexer';

interface ASTNode {
	evaluate(): string | number | boolean;
}

class Primitive implements ASTNode {
	token: Token;
	constructor(token: Token) {
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

export enum OperatorType {
	Root,
	Addition,
	Subract,
	Multiply,
	Divide,
	If,
}

class Expression implements ASTNode {
	operator: OperatorType;
	args: ASTNode[];
	constructor(operator?: OperatorType) {
		this.operator = operator;
		this.args = [];
	}

	evaluate(): string | number | boolean {
		return '';
	}
}

export type AST = Expression;

class Addition extends Expression {
	args: ASTNode[];
	constructor() {
		super(OperatorType.Addition);
	}

	evaluate(): number {
		let sum = 0;

		for (const arg of this.args) {
			const value = arg.evaluate();
			if (typeof value === 'number') {
				sum += value;
			} else {
				throw new Error('Cannot add a string to a number');
			}
		}

		return sum;
	}
}

class Subtraction extends Expression {
	args: ASTNode[];
	constructor() {
		super(OperatorType.Subract);
	}

	evaluate(): number {
		let diff = null;

		for (const arg of this.args) {
			const value = arg.evaluate();
			if (typeof value === 'number') {
				if (diff === null) {
					diff = value;
				} else {
					diff -= value;
				}
			} else {
				throw new Error('Cannot subtract a string from a number');
			}
		}

		return diff;
	}
}

class Multiplication extends Expression {
	args: ASTNode[];
	constructor() {
		super(OperatorType.Multiply);
	}

	evaluate(): number {
		let prod = 1;

		for (const arg of this.args) {
			const value = arg.evaluate();
			if (typeof value === 'number') {
				prod *= value;
			} else {
				throw new Error('Cannot multiply a string with a number');
			}
		}

		return prod;
	}
}

class Division extends Expression {
	args: ASTNode[];
	constructor() {
		super(OperatorType.Divide);
	}

	evaluate(): number {
		let quotient = null;

		for (const arg of this.args) {
			const value = arg.evaluate();
			if (typeof value === 'number') {
				if (value === 0) {
					throw new Error('Cannot divide by zero');
				}
				if (quotient === null) {
					quotient = value;
				} else {
					quotient /= value;
				}
			} else {
				throw new Error('Cannot subtract a string from a number');
			}
		}

		return quotient;
	}
}

class Comparison extends Expression {
	args: ASTNode[];
	constructor() {
		super(OperatorType.If);
	}

	evaluate() {
		if (this.args.length > 3) {
			throw new Error(
				'If operator cannot have more that 3 arguments. Usage: (if condition true-exp false-exp)'
			);
		}

		const condition = this.args[0];
		if (condition.evaluate()) {
			return this.args[1].evaluate();
		} else {
			return this.args[2].evaluate();
		}
	}
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

	constructor(tokens: Token[]) {
		this._tokens = tokens;
		this.generateAST();
	}

	// (+ 1 2)
	generateAST() {
		let i = 0,
			tokensLength = this._tokens.length,
			stack = new Stack<Expression>(),
			ast = new Expression(OperatorType.Root);
		stack.push(ast);
		while (i < tokensLength) {
			const token = this._tokens[i];
			switch (token.type) {
				case TokenType.LeftParentheses:
					// Do nothing, expect an operator next
					i++;
					break;
				case TokenType.RightParentheses: {
					const op = stack.pop();
					if (stack.peek()) {
						const previous = stack.peek();
						previous.args.push(op);
					}
					i++;
					break;
				}
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
			}
		}

		this._ast = ast;
	}

	getAST() {
		return this._ast;
	}
}
