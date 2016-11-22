"use strict";
var TodoType = (function () {
    function TodoType(file, content, line) {
        if (line === void 0) { line = 0; }
        this.file = file;
        this.content = content;
        this.lineNumber = line;
    }
    TodoType.prototype.getContent = function () {
        return this.content;
    };
    TodoType.prototype.getLineNumber = function () {
        return this.lineNumber;
    };
    TodoType.prototype.getFile = function () {
        return this.file;
    };
    TodoType.prototype.getDisplayString = function () {
        var path = this.getFile().getName() + ":" + this.getLineNumber();
        return "From " + path + "\n----------------------------------\n" + this.getContent();
    };
    TodoType.prototype.toString = function () {
        return this.getFile().toString() + "\n" + this.getContent.toString();
    };
    return TodoType;
}());
exports.TodoType = TodoType;
//# sourceMappingURL=TodoType.js.map