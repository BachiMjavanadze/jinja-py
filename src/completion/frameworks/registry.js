// src/completion/frameworks/registry.js
const vscode = require('vscode');
const flask = require('./flask');
const django = require('./django');
const fastapi = require('./fastapi');

const EMPTY = { globals: [], filters: [], tests: [], statementKeywords: [], attributes: {} };
const DATA = { flask, django, fastapi, none: EMPTY };

function getFramework() {
    return vscode.workspace.getConfiguration('jinjaPy').get('framework', 'flask');
}

function current() {
    return DATA[getFramework()] || DATA.flask;
}

// chainTokens like ['request', 'args'] -> attrs array of the final node (or [])
function resolveAttributes(chainTokens) {
    let node = current().attributes[chainTokens[0]];
    if (!node) return [];
    for (let i = 1; i < chainTokens.length; i++) {
        node = node.children && node.children[chainTokens[i]];
        if (!node) return [];
    }
    return node.attrs || [];
}

module.exports = { getFramework, current, resolveAttributes };
