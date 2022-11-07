import { AST, OperatorType } from './Parser';

export class Evaluator {
	constructor() {}

	evaluate(ast: AST) {
		// Ensure root
		if (ast.operator !== OperatorType.Root) {
			throw new Error('Root node is missing in AST');
		}

		return ast.args[0].evaluate();
	}
}
