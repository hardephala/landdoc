const User = require('../models/UserModel.js');

// Custom middleware function to check user role (admin or normal user)
const checkUserRole = async (req, res, next) => {
  try {
    const { address } = req.body;
    const user = await User.findOne({ address: new RegExp(address, 'i') });

    console.log(address)
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    if (user.role === 'admin') {
      req.isAdmin = true;
    } else {
      req.isAdmin = false;
      return res.status(403).json({ error: 'Permission error' });
    }

    next();
  } catch (error) {
    res.status(500).json({ error: 'Role check failed' });
  }
};


module.exports = checkUserRole