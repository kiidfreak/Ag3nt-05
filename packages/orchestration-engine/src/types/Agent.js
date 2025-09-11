"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TaskStatus = exports.TaskPriority = exports.MessageType = exports.AgentStatus = void 0;
var AgentStatus;
(function (AgentStatus) {
    AgentStatus["ACTIVE"] = "active";
    AgentStatus["INACTIVE"] = "inactive";
    AgentStatus["ERROR"] = "error";
    AgentStatus["STARTING"] = "starting";
    AgentStatus["STOPPING"] = "stopping";
})(AgentStatus || (exports.AgentStatus = AgentStatus = {}));
var MessageType;
(function (MessageType) {
    MessageType["TASK_REQUEST"] = "task_request";
    MessageType["TASK_RESPONSE"] = "task_response";
    MessageType["TASK_ERROR"] = "task_error";
    MessageType["HEARTBEAT"] = "heartbeat";
    MessageType["STATUS_UPDATE"] = "status_update";
    MessageType["CAPABILITY_ANNOUNCEMENT"] = "capability_announcement";
})(MessageType || (exports.MessageType = MessageType = {}));
var TaskPriority;
(function (TaskPriority) {
    TaskPriority[TaskPriority["LOW"] = 1] = "LOW";
    TaskPriority[TaskPriority["NORMAL"] = 2] = "NORMAL";
    TaskPriority[TaskPriority["HIGH"] = 3] = "HIGH";
    TaskPriority[TaskPriority["CRITICAL"] = 4] = "CRITICAL";
})(TaskPriority || (exports.TaskPriority = TaskPriority = {}));
var TaskStatus;
(function (TaskStatus) {
    TaskStatus["PENDING"] = "pending";
    TaskStatus["RUNNING"] = "running";
    TaskStatus["COMPLETED"] = "completed";
    TaskStatus["FAILED"] = "failed";
    TaskStatus["TIMEOUT"] = "timeout";
    TaskStatus["CANCELLED"] = "cancelled";
})(TaskStatus || (exports.TaskStatus = TaskStatus = {}));
//# sourceMappingURL=Agent.js.map