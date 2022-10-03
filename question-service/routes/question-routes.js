"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const question_controller_js_1 = __importDefault(require("../controller/question-controller.js"));
const router = express_1.default.Router();
router.post("/difficulty/:difficulty", question_controller_js_1.default.get_one_by_difficulty);
exports.default = router;
