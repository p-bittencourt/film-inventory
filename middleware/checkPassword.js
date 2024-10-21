require('dotenv').config();

function checkPassword(req, res, next) {
  const enteredPassword = req.body.password;
  const correctPassword = process.env.SYSTEM_PASSWORD;
  console.log('in check password');

  if (!enteredPassword || enteredPassword !== correctPassword) {
    return res
      .status(403)
      .json({ success: false, message: 'Incorrect password' });
  }

  next(); // Proceed if password is correct;
}

module.exports = checkPassword;
