// src/routes/problemRoutes.js
const express = require("express");
const router = express.Router();
const problemController = require("../controllers/problemController");
const auth = require("../middleware/auth");

router.post("/", problemController.createProblem);
router.get("/", problemController.getProblems);
router.get("/:id", problemController.getProblem);
router.get("/:id/analysis", problemController.getProblemAnalysis);

// Protected routes (require authentication)
router.post("/:id/submit", auth, problemController.submitSolution);
router.post("/:id/discussion", auth, problemController.addDiscussion);

// Admin only routes
// router.post("/", auth, authorize("admin"), problemController.createProblem);
// router.put("/:id", auth, authorize("admin"), problemController.updateProblem);
// router.delete(
//   "/:id",
//   auth,
//   authorize("admin"),
//   problemController.deleteProblem
// );

module.exports = router;
