import UserModel from "../models/User.js"
import bcrypt from 'bcrypt';
const admin=async(req,res)=>{
     try {
        const Users= await UserModel.find()
        res.status(200).json({users:Users})
     } catch (error) {
        console.log(error)
        res.status(500).json({message:"intenral server error"})

     }
}
const delet = async (req, res) => {
    try {
        const userId = req.params.id;
         const checkIadmin= await UserModel.findById(userId)
         if (checkIadmin.role == 'admin') {
            return res.status(409).json({ message: 'You Can not delet Your Selefe' });
            
         }
        const user = await UserModel.findByIdAndDelete(userId);
        
        if (!user) {
            return res.status(404).json({ message: 'User Not Found' });
        }

        res.status(200).json({ message: 'User deleted Successfully', user });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal Server Error" });
    }
}
const updateUser = async (req, res) => {
    try {
        const userId = req.params.id;
        const updates = req.body;

        // Check if the password is being updated
        if (updates.password) {
            // Hash the password
            const saltRounds = 10;
            updates.password = await bcrypt.hash(updates.password, saltRounds);
        }

        const user = await UserModel.findByIdAndUpdate(userId, updates, { new: true });

        if (!user) {
            return res.status(404).json({ message: 'User Not Found' });
        }

        res.status(200).json({ message: 'User updated successfully', user });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};
///////////////////////////////////////////////////////////////////////////////




export {admin,delet,updateUser}