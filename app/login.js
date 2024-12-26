const express = require("express");
const jwt = require("jsonwebtoken");
const db = require("./database.js");
const bcrypt = require('bcryptjs');
const router = express.Router();
JWT_SECRET='supersecretkey12345!@';



router.post("/signup", async (req, res) => {
  try {
    let { username, name, surname, password } = req.body;

    if (!username || !password || !name || !surname) {
      return res.status(400).json({ status: 'error', message: 'All fields required!' }); 
    } 

    const usernameRegex = /^[a-zA-Z0-9_]{3,30}$/;
    if (!usernameRegex.test(username)) {
      return res.status(400).json({ status: 'error', message: 'Invalid username format!' });
    }

    const passwordRegex = /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,}$/;
    if (!passwordRegex.test(password)) {
      return res.status(400).json({
        status: 'error',
        message: 'Password must be at least 8 characters long and include an uppercase letter, a lowercase letter, a number, and a special character.',
      });
    }

    name = name.trim().split(/\s+/).map(n => `${n.charAt(0).toUpperCase()}${n.slice(1).toLowerCase()}`).join(" ");
    surname = surname.trim().split(/\s+/).map(s => `${s.charAt(0).toUpperCase()}${s.slice(1).toLowerCase()}`).join(" ");

    const database = await db.connectToDatabase();

    const existingUser = await database.collection("users").findOne({ username });

    if (existingUser) {
      return res.status(409).json({ status : 'error',  message: `User "${username}" already existing!` });
    }

    const hashedPassword = await bcrypt.hash(password, 12); // 12 = salt CAPIRE A COSA SERVE

    let newUser = {
        username,
        name,
        surname, 
        password: hashedPassword
    };

    const result = await database.collection("users").insertOne(newUser);

    if (result.acknowledged && result.insertedId) {
      res.status(201).json({
      status : 'success', 
      message: 'User created successfully', 
      user: {
        username,
        name,
        surname
      }
    });
    } else {
      res.status(500).json({ status: 'error', message: 'Failed to create user' });
    }
    
  } catch (error) {
    console.error("Signup Error:", error);
    res.status(500).json({ status: 'error', message: 'Internal Server Error during Signup' });
  }
});



router.post("/signin", async (req, res) => {
  try {
    const { username, password } = req.body;

    const database = await db.connectToDatabase();
    const user = await database.collection("users").findOne({ username });

    if (user && await bcrypt.compare(password, user.password)) {

      const data = { id: user._id.toString(), username };
      const token = jwt.sign(data, JWT_SECRET, { expiresIn: 86400 });

      res.cookie("token", token, { httpOnly: true, secure: process.env.NODE_ENV === "production" });
      res.redirect("/dashboard.html");
    } else if (!user) {
      res.status(404).json({ status: 'error', message: 'User not found' });
    } else {
      res.status(401).json({ status: 'error', message: 'Invalid Credentials' });
    }
    
  } catch (error) {
    console.error(error);
    res.status(500).json({ status: 'error', message: 'Internal Server Error' });
  }
});


module.exports = router;