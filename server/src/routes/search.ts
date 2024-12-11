import express, { Request, Response } from "express";
import * as searchController from "../controllers/searchControllers";
const router = express.Router();

// search route
router.get("/", searchController.search);

export default router;
