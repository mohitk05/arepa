export enum TokenType {
	NumberValue,
	StringValue,
	LeftParentheses,
	RightParentheses,
	// Quote,
	AddOperator,
	SubtractOperator,
	MultiplyOperator,
	DivideOperator,
}

export class Token {
	type: TokenType;
	value: string;
	constructor(type: TokenType, value: string) {
		this.type = type;
		this.value = value;
	}
}

// class Quote extends Token {
// 	constructor() {
// 		super(TokenType.Quote, '"');
// 	}
// }

class LeftParentheses extends Token {
	constructor() {
		super(TokenType.LeftParentheses, '(');
	}
}

class RightParentheses extends Token {
	constructor() {
		super(TokenType.RightParentheses, ')');
	}
}

class NumberValue extends Token {
	constructor(value: string) {
		super(TokenType.NumberValue, value);
	}
}

class AddOperator extends Token {
	constructor() {
		super(TokenType.AddOperator, '+');
	}
}

class SubtractOperator extends Token {
	constructor() {
		super(TokenType.SubtractOperator, '-');
	}
}

class MultiplyOperator extends Token {
	constructor() {
		super(TokenType.MultiplyOperator, '*');
	}
}

class DivideOperator extends Token {
	constructor() {
		super(TokenType.DivideOperator, '/');
	}
}

class StringValue extends Token {
	constructor(value: string) {
		super(TokenType.StringValue, value);
	}
}

const isNumber = (value: string) => {
	return /[0-9]+/.test(value);
};

export class Lexer {
	private _source: string;
	private _tokens: Token[];

	constructor(source: string) {
		this._source = source;
		this._tokens = [];
		this.generateTokens();
	}

	// (+ 1 2)
	generateTokens() {
		let i = 0,
			srcLength = this._source.length,
			readingString = false,
			tempString = '',
			tempNumber = '';
		while (i < srcLength) {
			const char = this._source[i];
			switch (char) {
				case '(':
					this._tokens.push(new LeftParentheses());
					i++;
					break;
				case ')':
					this._tokens.push(new RightParentheses());
					i++;
					break;
				case '"':
					i++;
					if (readingString) {
						this._tokens.push(new StringValue(tempString));
						readingString = false;
						tempString = '';
					} else {
						readingString = true;
					}
					break;
				case '+':
					this._tokens.push(new AddOperator());
					i++;
					break;
				case '-':
					this._tokens.push(new SubtractOperator());
					i++;
					break;
				case '*':
					this._tokens.push(new MultiplyOperator());
					i++;
					break;
				case '/':
					this._tokens.push(new DivideOperator());
					i++;
					break;
				default:
					if (char === ' ' && !readingString) {
						i++;
					} else if (readingString) {
						// string
						tempString += char;
						i++;
					} else {
						// number
						tempNumber += char;
						if (
							i + 1 < srcLength &&
							!isNumber(this._source[i + 1])
						) {
							this._tokens.push(new NumberValue(tempNumber));
							tempNumber = '';
						}
						i++;
					}
					break;
			}
		}
	}

	getTokens() {
		return this._tokens;
	}
}
