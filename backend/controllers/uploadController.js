const { cloudinary } = require("../config/cloudinary");
const User = require("../Models/userModel");

// @desc    Upload profile picture
// @route   POST /api/upload/profile-pic
// @access  Private
const uploadProfilePic = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    // Update user's profile picture URL in database
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    user.pic = req.file.path;
    await user.save();

    res.status(200).json({
      message: "Profile picture uploaded successfully",
      pic: user.pic,
    });
  } catch (error) {
    console.error("Error uploading profile picture:", error);
    res.status(500).json({ message: "Error uploading profile picture" });
  }
};

module.exports = {
  uploadProfilePic,
};
