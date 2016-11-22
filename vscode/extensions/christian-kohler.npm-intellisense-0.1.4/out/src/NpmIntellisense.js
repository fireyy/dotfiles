"use strict";
var vscode_1 = require('vscode');
var fs_1 = require('fs');
var path_1 = require('path');
var packageJson = path_1.join(vscode_1.workspace.rootPath, 'package.json');
var scanDevDependencies = vscode_1.workspace.getConfiguration('npm-intellisense')['scanDevDependencies'];
var NpmIntellisense = (function () {
    function NpmIntellisense() {
    }
    NpmIntellisense.prototype.provideCompletionItems = function (document, position) {
        var _this = this;
        if (!this.shouldProvide(document, position)) {
            return Promise.resolve([]);
        }
        return this.getNpmPackages().then(function (dependencies) { return dependencies.map(function (d) { return _this.toCompletionItem(d); }); });
    };
    NpmIntellisense.prototype.getNpmPackages = function () {
        return this.readFilePromise(packageJson)
            .then(function (config) { return Object.keys(config.dependencies || {}).concat(Object.keys(scanDevDependencies ? config.devDependencies || {} : {})); })
            .catch(function () { return []; });
    };
    NpmIntellisense.prototype.readFilePromise = function (file) {
        return new Promise(function (resolve, reject) {
            fs_1.readFile(file, function (err, data) { return err ? reject(err) : resolve(JSON.parse(data.toString())); });
        });
    };
    NpmIntellisense.prototype.toCompletionItem = function (dep) {
        var item = new vscode_1.CompletionItem(dep);
        item.kind = vscode_1.CompletionItemKind.Module;
        return item;
    };
    NpmIntellisense.prototype.shouldProvide = function (document, position) {
        var line = document.getText(document.lineAt(position).range);
        return (this.isImportOrRequire(line, position.character) &&
            !this.startsWithADot(line, position.character));
    };
    NpmIntellisense.prototype.isImportOrRequire = function (line, position) {
        var isImport = line.substring(0, 6) === 'import';
        var isRequire = line.indexOf('require(') != -1;
        return (isImport && this.isAfterFrom(line, position)) || isRequire;
    };
    NpmIntellisense.prototype.isAfterFrom = function (line, position) {
        var fromPosition = this.stringMatches(line, [
            ' from \'', ' from "',
            '}from \'', '}from "'
        ]);
        return fromPosition != -1 && fromPosition < position;
    };
    NpmIntellisense.prototype.stringMatches = function (line, strings) {
        return strings.reduce(function (position, str) {
            return Math.max(position, line.lastIndexOf(str));
        }, -1);
    };
    NpmIntellisense.prototype.startsWithADot = function (text, position) {
        var textWithinString = this.getTextWithinString(text, position);
        if (!textWithinString || textWithinString.length === 0) {
            return false;
        }
        return textWithinString[0] === '.';
    };
    NpmIntellisense.prototype.getTextWithinString = function (text, position) {
        var textToPosition = text.substring(0, position);
        var quoatationPosition = Math.max(textToPosition.lastIndexOf('\"'), textToPosition.lastIndexOf('\''));
        return quoatationPosition != -1 ? textToPosition.substring(quoatationPosition + 1, textToPosition.length) : undefined;
    };
    return NpmIntellisense;
}());
exports.NpmIntellisense = NpmIntellisense;
//# sourceMappingURL=NpmIntellisense.js.map