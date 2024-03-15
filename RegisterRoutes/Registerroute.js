const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const Register = require("../Schema/RegisterUser");
const multer = require("multer");

// Route to register a new user
router.post("/register/user", async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const newUser = new Register({
      name,
      email,
      password,
      role: 2,
    });
    await newUser.save();
    res.status(201).json({ message: "User registered successfully!" });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Route to register a new admin
router.post("/register/admin", async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const newAdmin = new Register({
      name,
      email,
      password,
      role: 1,
    });
    await newAdmin.save();
    res.status(201).json({ message: "Admin registered successfully!" });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Route to login a user
router.post("/login/user", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await Register.findOne({ email, role: 2 });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    // Compare passwords
    if (password !== user.password) {
      return res.status(401).json({ message: "Incorrect password" });
    }
    // If user found and password matched, return success
    res.status(200).json({ message: "User logged in successfully!" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Route to login an admin
router.post("/login/admin", async (req, res) => {
  try {
    const { email, password } = req.body;
    const admin = await Register.findOne({ email, role: 1 });
    if (!admin) {
      return res.status(404).json({ message: "Admin not found" });
    }
    // Compare passwords
    if (password !== admin.password) {
      return res.status(401).json({ message: "Incorrect password" });
    }
    // If admin found and password matched, return success
    res.status(200).json({ message: "Admin logged in successfully!" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


// Multer configuration for handling file uploads
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, "uploads");
    },
    filename: function (req, file, cb) {
      cb(null, Date.now() + "-" + file.originalname);
    },
  });
  const upload = multer({ storage: storage });



router.post("/upload", upload.single("document"), async (req, res) => {
  try {
    if (!req.file || !req.body.username) {
      return res
        .status(400)
        .json({
          error:
            "Incomplete data: 'document' and 'username' fields are required",
        });
    }

    console.log("Uploaded File:", req.file);

    const { username } = req.body;
    const user = await Register.findOne({ name: username });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    user.document = req.file.path; // Save file path to user document field
    await user.save();
    res.status(201).json({ message: "Document uploaded successfully" });
  } catch (error) {
    console.error("Error uploading document:", error);
    res.status(500).json({ error: error.message });
  }
});

// Route for admin to approve a document
router.put("/approve/:adminName/:userName", async (req, res) => {
  try {
    const { adminName, userName } = req.params;
    // Check if the admin exists
    const admin = await Register.findOne({ name: adminName, role: 1 });
    if (!admin) {
      return res.status(404).json({ message: "Admin not found" });
    }
    // Check if the user exists
    const user = await Register.findOne({ name: userName });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    user.documentApproved = true;
    await user.save();
    res.status(200).json({ message: "Document approved successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
