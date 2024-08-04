"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const auth_1 = __importDefault(require("../middleware/auth"));
const discussion_1 = __importDefault(require("../models/discussion"));
const express_validator_1 = require("express-validator");
const router = express_1.default.Router();
router.post("/new", auth_1.default, [
    (0, express_validator_1.check)("title", "Title is required").notEmpty(),
    (0, express_validator_1.check)("description", "Description cannot be empty").notEmpty(),
], (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const errors = (0, express_validator_1.validationResult)(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ message: errors.array() });
    }
    try {
        const discussion = new discussion_1.default(req.body);
        discussion.createdBy = req.userId;
        discussion.createdAt = Date.now();
        discussion.updatedAt = Date.now();
        yield discussion.save();
        res.status(200).send({ message: "Discussion created successfully." });
    }
    catch (e) {
        res.status(500).json({ message: "Something went wrong" });
    }
}));
router.get("/", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const allDiscussions = yield discussion_1.default.find({});
        res.status(200).send(allDiscussions);
    }
    catch (e) {
        res.status(501).json({ message: "Something went wrong" });
    }
}));
router.get("/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const discussion = yield discussion_1.default.findById(id);
        if (!discussion)
            res.status(404).json({ message: "No discussion found" });
        res.status(200).send(discussion);
    }
    catch (e) {
        res.status(501).json({ message: "Something went wrong" });
    }
}));
exports.default = router;
