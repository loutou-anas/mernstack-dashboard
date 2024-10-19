import bcryptjs from 'bcryptjs';
import jwt from 'jsonwebtoken';
import UserModel from '../models/User.js';

const Register = async (req, res) => {
    try {
        // Extracting user details from request body
        const { name, email, password, role } = req.body;

        // Check if user already exists
        const existingUser = await UserModel.findOne({ email });

        if (existingUser) {
            return res.status(400).json({ message: "User already exists" });
        }
        
        // Hashing the password
        const hashedPassword = await bcryptjs.hash(password, 10);

        // Create a new user
        const newUser = new UserModel({
            name,
            email,
            password: hashedPassword,
            role  // Assign the role from the request
        });

        // Save the user to the database
        await newUser.save();

        // Return success message
        res.status(201).json({ success: true, message: "User registered successfully", newUser });
    } catch (error) {
        // Handle error
        console.error("Error registering user:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};


const login = async (req, res) => {
    try {
        // Extracting user details from request body
        const { email, password } = req.body;

        // Check if user exists
        const user = await UserModel.findOne({ email });

        if (!user) {
            return res.status(400).json({ message: "Invalid infos" });
        }

        // Check password
        const isPasswordValid = await bcryptjs.compare(password, user.password);

        if (!isPasswordValid) {
            return res.status(400).json({ message: "Invalid infos" });
        }

        // Create JWT tokenjsonwebtoken
        const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET);

        // Set the token in cookies
        // res.cookie('token', token, { httpOnly: true,secure:false,  sameSite: 'none'  });
        res.cookie('token', token, {    
            httpOnly: true,
            secure: true, // Set to true if using HTTPS, even on localhost
            sameSite: 'None', // Add SameSite attribute
            maxAge: 3600000 // This sets the cookie to expire after 1 hour
        });
        
        
        // Return success message
        res.status(200).json({ message: "Login successful", token,user });
    } catch (error) {
        // Handle error
        console.error("Error logging in:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

const CheckUser=async(req,res)=>{
    try {
        const User=req.user
       if (!User) {
            return res.status(401).json({succes:false,message:"User Not Found"})
       }
       res.status(200).json(User)
    } catch (error) {
       res.status(500).json({success:false,message:"Internal Server error"})

        console.log(error)
    }
}

const logout=async(req,res)=>{
    try {
        // Clear the token cookie
        res.clearCookie('token', {
            httpOnly: true,
            secure: true, // Set to true if using HTTPS
            sameSite: 'None' // Add SameSite attribute
        });
        
        // Return success message
        res.status(200).json({ message: "Logout successful" });
    } catch (error) {
        // Handle error
        console.error("Error logging out:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
}

// Generate a new access token using the refresh token
const refreshToken = async (req, res) => {
    const refreshToken = req.body.token;

    if (!refreshToken) {
        return res.status(403).json({ message: "Refresh Token is required!" });
    }

    try {
        // Verify the refresh token
        const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
        console.log("Decoded token:", decoded);  // Log the decoded token

        const user = await UserModel.findById(decoded.id);
        if (!user) {
            console.log("User not found for ID:", decoded.id);  // Log if user is not found
            return res.status(403).json({ message: "Invalid Refresh Token!" });
        }

        // Generate a new access token
        const accessToken = jwt.sign({ id: user._id }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '15m' });

        res.json({ accessToken });

    } catch (error) {
        console.error("Error refreshing token:", error);  // Log any error during token verification
        res.status(403).json({ message: "Invalid or expired refresh token!" });
    }
};



export { Register, login,CheckUser,logout, refreshToken };
