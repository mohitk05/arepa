import { AST, OperatorType } from "./Parser";

export class Evaluator {
  constructor() {}

  evaluate(ast: AST) {
    return ast.evaluate();
  }
}
