"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TaskPriority = exports.TaskState = void 0;
var TaskState;
(function (TaskState) {
    TaskState["ToDo"] = "ToDo";
    TaskState["InProgress"] = "progress";
    TaskState["AwaitingFeedback"] = "awaiting";
    TaskState["Done"] = "done";
})(TaskState || (exports.TaskState = TaskState = {}));
var TaskPriority;
(function (TaskPriority) {
    TaskPriority[TaskPriority["Urgent"] = -1] = "Urgent";
    TaskPriority[TaskPriority["Medium"] = 0] = "Medium";
    TaskPriority[TaskPriority["Low"] = 1] = "Low";
})(TaskPriority || (exports.TaskPriority = TaskPriority = {}));
