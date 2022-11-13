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
  RemainderOperator,
  IfOperator,
  DefuncOperator,
  CustomLiteral,
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
    super(TokenType.LeftParentheses, "(");
  }
}

class RightParentheses extends Token {
  constructor() {
    super(TokenType.RightParentheses, ")");
  }
}

class NumberValue extends Token {
  constructor(value: string) {
    super(TokenType.NumberValue, value);
  }
}

class AddOperator extends Token {
  constructor() {
    super(TokenType.AddOperator, "+");
  }
}

class SubtractOperator extends Token {
  constructor() {
    super(TokenType.SubtractOperator, "-");
  }
}

class MultiplyOperator extends Token {
  constructor() {
    super(TokenType.MultiplyOperator, "*");
  }
}

class DivideOperator extends Token {
  constructor() {
    super(TokenType.DivideOperator, "/");
  }
}

class StringValue extends Token {
  constructor(value: string) {
    super(TokenType.StringValue, value);
  }
}

class CustomLiteral extends Token {
  constructor(value: string) {
    super(TokenType.CustomLiteral, value);
  }
}
class IfOperator extends Token {
  constructor() {
    super(TokenType.IfOperator, "if");
  }
}

class RemainderOperator extends Token {
  constructor() {
    super(TokenType.RemainderOperator, "re");
  }
}

class DefuncOperator extends Token {
  constructor() {
    super(TokenType.DefuncOperator, "defunc");
  }
}

const getLiteralInstance = (literal: string) => {
  switch (literal) {
    case "if":
      return new IfOperator();
    case "defunc":
      return new DefuncOperator();
    case "re":
      return new RemainderOperator();
    default:
      return new CustomLiteral(literal);
  }
};

const isNumber = (value: string) => {
  return /[0-9]+/.test(value);
};

const isAlpha = (value: string) => {
  return /[a-zA-Z]/.test(value);
};

const isAllowedLiteralChar = (value: string) => {
  return value.split("").every((c) => isAlpha(c) || isNumber(c) || /_/.test(c));
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
      readingLiteral = false,
      tempString = "",
      tempNumber = "",
      tempLiteral = "";
    while (i < srcLength) {
      const char = this._source[i];
      switch (char) {
        case "(":
          this._tokens.push(new LeftParentheses());
          i++;
          break;
        case ")":
          this._tokens.push(new RightParentheses());
          i++;
          break;
        case '"':
          i++;
          if (readingString) {
            this._tokens.push(new StringValue(tempString));
            readingString = false;
            tempString = "";
          } else {
            readingString = true;
          }
          break;
        case "+":
          this._tokens.push(new AddOperator());
          i++;
          break;
        case "-":
          this._tokens.push(new SubtractOperator());
          i++;
          break;
        case "*":
          this._tokens.push(new MultiplyOperator());
          i++;
          break;
        case "/":
          this._tokens.push(new DivideOperator());
          i++;
          break;
        default:
          if (/\s+/.test(char) && !readingString) {
            i++;
          } else if (readingString) {
            // string
            tempString += char;
            i++;
          } else {
            if (!readingLiteral && isAlpha(char)) {
              // start reading literal
              readingLiteral = true;
            }
            if (readingLiteral) {
              tempLiteral += char;
              if (!isAllowedLiteralChar(this._source[i + 1])) {
                // end literal
                this._tokens.push(getLiteralInstance(tempLiteral));
                tempLiteral = "";
                readingLiteral = false;
              }
              i++;
              break;
            } else {
              // number
              tempNumber += char;
              if (i + 1 < srcLength && !isNumber(this._source[i + 1])) {
                this._tokens.push(new NumberValue(tempNumber));
                tempNumber = "";
              }
              i++;
              break;
            }
          }
          break;
      }
    }
  }

  getTokens() {
    return this._tokens;
  }
}
