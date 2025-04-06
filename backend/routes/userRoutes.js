const express = require("express");
const router = express.Router();
const {
  registerUser,
  authUser,
  allUsers,
} = require("../controllers/userControllers");
const { protect } = require("../middleware/authMiddleware");

/**
 * @desc    User routes configuration
 * @route   /api/user
 *
 * POST /api/user - Register a new user
 * GET /api/user - Search for users (requires authentication)
 * POST /api/user/login - Authenticate user and get token
 */

// Route for user registration and user search
router.route("/").post(registerUser).get(protect, allUsers);

// Route for user authentication
router.post("/login", authUser);

module.exports = router;
