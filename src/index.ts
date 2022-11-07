import * as fs from 'fs';
import * as path from 'path';
import { Evaluator } from './Evaluator';
import { Lexer } from './Lexer';
import { Parser } from './Parser';

/*
    Source code -> Lexer = Tokens
    Tokens -> Parser = AST
    AST -> Eval = Output
*/

const execute = () => {
	const srcPath = process.argv[2];
	const src = fs.readFileSync(
		srcPath || path.resolve(__dirname, '..', 'test.arp'),
		{
			encoding: 'utf-8',
		}
	);
	const tokens = new Lexer(src).getTokens();
	const ast = new Parser(tokens).getAST();
	const output = new Evaluator().evaluate(ast);
	console.log(output);
	// return output;
};

execute();
