const jwt = require("jsonwebtoken");

exports.authenticateToken = (req, res, next) => {
  try {
    const token = req.headers.authorization;

    if (!token) {
      return res.sendStatus(401, "Empty token"); // Unauthorized..x
    }

    const secretKey = process.env.JW_TKEY;

    const decodedata = jwt.verify(token, secretKey);

    // req.user = decoded;
    next();
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
