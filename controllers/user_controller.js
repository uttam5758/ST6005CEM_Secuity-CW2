const User = require('../Model/User')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

const MAX_FAILED_LOGIN_ATTEMPTS = 5; 
const LOCK_DURATION = 5 * 60 * 1000; // 5 minutes

function validatePassword(password, username, email, fullname) {
  const passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*()_+{}\[\]:;<>,.?~\\/-]).{8,}$/;

  const commonPasswords = ["123456", "password", "qwerty", "1234567890"]; 
  if (commonPasswords.includes(password.toLowerCase())) {
      return false;
  }

  if (username && password.toLowerCase().includes(username.toLowerCase()) ||
    email && password.toLowerCase().includes(email.toLowerCase()) ||
    fullname && password.toLowerCase().includes(fullname.toLowerCase())
   ) {
      return false;
  }

  return passwordRegex.test(password);
}


const registerUser = (req, res, next) => {
    User.findOne({username: req.body.username})
        .then(user => {
            if(user != null) {
                let err = new Error (`User ${req.body.username} already exists`)
                res.status(400)
                return next(err)
            }

            const password = req.body.password;
            if (!validatePassword(password, req.body.username, req.body.email, req.body.fullname)) {
                let err = new Error(`Password must be at least 8 characters long and include uppercase, lowercase, and special characters`);
                res.status(400);
                return next(err);
            }

            bcrypt.hash(req.body.password, 10, (err, hash) => {
                if(err) return next(err)
                user = new User()
                user.username = req.body.username
                user.email = req.body.email
                user.fullname = req.body.fullname
                user.password = hash
                if(req.body.role) user.role = req.body.role
                if (req.file) {
                    user.image = req.file.path.replace("uploads\\", "");
                  }
                user.save().then(user => {
                    res.status(201).json({
                        'status': 'User has registered successfully',
                        userId: user._id,
                        username: user.username,
                        email: user.email,
                        fullname: user.fullname,
                        role: user.role,
                        image: user.image,
                    })
                }).catch(next)
            })
        }).catch(next)
}

const loginUser = (req, res, next) => {
    User.findOne({username: req.body.username})
        .then(user => {
            if(user == null) {
                let err = new Error(`Username or Password does not match`)
                res.status(404)
                return next(err)
            }

            if (user.failedLoginAttempts >= MAX_FAILED_LOGIN_ATTEMPTS) {
              const now = new Date();
              const lastFailedLogin = user.lastFailedLogin;
              if (lastFailedLogin && now - lastFailedLogin < LOCK_DURATION) {
                  const remainingLockTime = Math.ceil((LOCK_DURATION - (now - lastFailedLogin)) / (1000 * 60)); // Convert milliseconds to minutes
                  const err = new Error(`Account is locked due to too many failed login attempts. Try again after ${remainingLockTime} minutes.`);
                  res.status(403);
                  return next(err);
              } else {
                  user.failedLoginAttempts = 0;
                  user.lastFailedLogin = null;
                  user.save();
              }
          }

            bcrypt.compare(req.body.password, user.password, (err, status) => {
                if(err) return next(err)
                if(!status) {
                    user.failedLoginAttempts += 1;
                    user.lastFailedLogin = new Date();
                    user.save();

                    let err = new Error('Username or Password does not match')
                    res.status(401)
                    return next(err)
                }

                user.failedLoginAttempts = 0;
                user.lastFailedLogin = null;
                user.save();

                let data = {
                    userId: user._id,
                    username: user.username,
                    email: user.email,
                    fullname: user.fullname,
                    role: user.role,
                }
                jwt.sign(data, process.env.SECRET,
                    {'expiresIn': '1d'}, (err, token) => {
                        if(err) return next(err)
                        res.json({
                            userId: user._id,
                            role: user.role,
                            'status': 'User was logged in successfully',
                            token: token
                        })
                        console.log('User has logged in successfully')
                    })
            })
        }).catch(next)
}

const getUserData = async(req, res, next) => {
    const userId = req.params.user_id;
    console.log(userId)

      try {
        const userData = await User.findById({ _id: userId });
        console.log(userData)
        if (!userData) {
          const error = new Error(`No user found with ID ${userId}`);
          error.status = 404;
          throw error;
        }
        res.status(200).json(userData);
      } catch (err) {
        res.status(500).json({ success: false });
      }
  };

  const updateUser = async (req, res) => {
    const { user_id } = req.params;
    const { username, fullname } = req.body;
  
    try {
      const existingUser = await User.findOne({ _id: user_id });
      if (!existingUser) {
        return res.status(404).json({ message: 'User not found' });
      }
  
      if (username && existingUser.username !== username) {
        const userWithSameUsername = await User.findOne({ username });
        if (userWithSameUsername && userWithSameUsername._id.toString() !== user_id) {
          return res.status(400).json({ message: 'Username already exists' });
        }
      }
  
      let updateFields = { username, fullname };

      // Check if image file is present in the request form-data
      if (req.file) {
        // Assuming you are using a file upload library that saves the image file and returns a file path or URL
        const imagePath = req.file.path.replace("uploads\\", ""); // Replace with the actual path or URL of the uploaded image
        updateFields.image = imagePath;
      }
  
      const updatedUser = await User.findByIdAndUpdate(
        user_id,
        updateFields,
        { new: true }
      );
  
      if (!updatedUser) {
        return res.status(404).json({ message: 'User not found' });
      }
  
      res.status(200).json({ data: updatedUser });
    } catch (err) {
      console.error(err);
      res.status(500).json({ success: false, message: 'Server error' });
    }
  };

  const updatePassword = async (req, res, next) => {
    const { user_id } = req.params;
    const { currentPassword, newPassword } = req.body;
  
    try {
      const user = await User.findOne({ _id: user_id });
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
  
      const isPasswordValid = await bcrypt.compare(currentPassword, user.password);
      if (!isPasswordValid) {
        return res.status(401).json({ message: 'Invalid previous password' });
      }
  
      const hashedNewPassword = await bcrypt.hash(newPassword, 10);
      user.password = hashedNewPassword;
  
      await user.save();
  
      res.status(200).json({ message: 'Password updated successfully' });
    } catch (err) {
      console.error(err);
      res.status(500).json({ success: false, message: 'Server error' });
    }
  };

  const getAllUsers = async (req, res, next) => {
    try {
        const users = await User.find({}, '-password'); // Exclude the password field from the response
        res.status(200).json(users);
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};
  
  
module.exports = {
    registerUser,
    loginUser,
    getUserData,
    updateUser,
    updatePassword,
    getAllUsers,
}