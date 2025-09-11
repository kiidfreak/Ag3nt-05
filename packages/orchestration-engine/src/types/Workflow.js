"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ExecutionStatus = exports.ComplexityLevel = exports.VariableType = exports.NodeStatus = exports.NodeType = exports.WorkflowStatus = void 0;
var WorkflowStatus;
(function (WorkflowStatus) {
    WorkflowStatus["DRAFT"] = "draft";
    WorkflowStatus["ACTIVE"] = "active";
    WorkflowStatus["PAUSED"] = "paused";
    WorkflowStatus["ERROR"] = "error";
    WorkflowStatus["COMPLETED"] = "completed";
})(WorkflowStatus || (exports.WorkflowStatus = WorkflowStatus = {}));
var NodeType;
(function (NodeType) {
    NodeType["AGENT_TASK"] = "agent_task";
    NodeType["CONDITION"] = "condition";
    NodeType["PARALLEL"] = "parallel";
    NodeType["SEQUENCE"] = "sequence";
    NodeType["TIMER"] = "timer";
    NodeType["WEBHOOK"] = "webhook";
    NodeType["DATA_TRANSFORM"] = "data_transform";
})(NodeType || (exports.NodeType = NodeType = {}));
var NodeStatus;
(function (NodeStatus) {
    NodeStatus["PENDING"] = "pending";
    NodeStatus["READY"] = "ready";
    NodeStatus["RUNNING"] = "running";
    NodeStatus["COMPLETED"] = "completed";
    NodeStatus["FAILED"] = "failed";
    NodeStatus["SKIPPED"] = "skipped";
})(NodeStatus || (exports.NodeStatus = NodeStatus = {}));
var VariableType;
(function (VariableType) {
    VariableType["STRING"] = "string";
    VariableType["NUMBER"] = "number";
    VariableType["BOOLEAN"] = "boolean";
    VariableType["OBJECT"] = "object";
    VariableType["ARRAY"] = "array";
})(VariableType || (exports.VariableType = VariableType = {}));
var ComplexityLevel;
(function (ComplexityLevel) {
    ComplexityLevel["SIMPLE"] = "simple";
    ComplexityLevel["MODERATE"] = "moderate";
    ComplexityLevel["COMPLEX"] = "complex";
    ComplexityLevel["ENTERPRISE"] = "enterprise";
})(ComplexityLevel || (exports.ComplexityLevel = ComplexityLevel = {}));
var ExecutionStatus;
(function (ExecutionStatus) {
    ExecutionStatus["QUEUED"] = "queued";
    ExecutionStatus["RUNNING"] = "running";
    ExecutionStatus["COMPLETED"] = "completed";
    ExecutionStatus["FAILED"] = "failed";
    ExecutionStatus["CANCELLED"] = "cancelled";
    ExecutionStatus["TIMEOUT"] = "timeout";
})(ExecutionStatus || (exports.ExecutionStatus = ExecutionStatus = {}));
//# sourceMappingURL=Workflow.js.map