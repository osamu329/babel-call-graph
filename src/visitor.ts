import {parse} from "@babel/parser";
import * as ast from "@babel/types";
import fs from "fs";

//const buf = fs.readFileSync("./node_modules/@babel/parser/lib/index.js");
const buf = fs.readFileSync("./testdata/test.js");
const file = parse(buf.toString());

class State {
    private curFns: string[] = [];

    pushCurFn(fnName: string) {
        this.curFns.push(fnName);
    }

    popCurFn() {
        this.curFns.pop();
    }

    getCurFn() {
        return this.curFns[this.curFns.length-1];
    }
}

function toString(n: ast.Node) {
    switch (n.type) {
        case "Identifier":
            return n.name;
        default:
            return n.type;
    }
}

// shadowing まで考えると、
function enter(n: ast.Node, ancestor: ast.TraversalAncestors, state: State) {
    switch (n.type) {
        case "FunctionDeclaration":
            state.pushCurFn(n.id?.name || "undefined");
            //console.log(n.id?.name);
            break;
        case "AssignmentExpression":
            break;
        case "VariableDeclarator":
            if (typeof n.id !== "undefined") {
                if (n.init?.type == "ArrowFunctionExpression") {
                    state.pushCurFn(toString(n.id));
                }
            }
            break;
        case "CallExpression":
            console.log(`${state.getCurFn()} => ${toString(n.callee)}`);
            break;
        default:
            //console.log(n.loc?.start.line, n.type);

    }
}

function exit(n: ast.Node, ancestor: ast.TraversalAncestors, state: State) {
    switch (n.type) {
        case "FunctionDeclaration":
            state.popCurFn();
            break;
        case "VariableDeclarator":
            if (typeof n.id !== "undefined") {
                if (n.init?.type == "ArrowFunctionExpression") {
                    state.popCurFn();
                }
            }
            break;
    }
}

const handlers = { enter, exit };

const state = new State();
ast.traverse(file, handlers, state);



