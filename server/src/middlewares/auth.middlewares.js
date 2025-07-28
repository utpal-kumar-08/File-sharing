import jwt from "jsonwebtoken";

const authenticate = (req, res, next) => {
  const authHeader = req.header("Authorization");

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Access denied. No token provided." });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || "Qw8!zR2@vL6");
    req.user = decoded; // You can access this in your controllers via req.user.userId
    next();
  } catch (err) {
    return res.status(400).json({ message: "Invalid or expired token." });
  }
};

export default authenticate;
