import jwt from 'jsonwebtoken';

export const verifyUser = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).json({ error: "No token provided" });

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) return res.status(403).json({ error: "Invalid token" });
    console.log("Decoded Token:", decoded);
    req.user = decoded;
    next();
  });
};

export const verifyAdmin = (req, res, next) => {
  verifyUser(req, res, () => {
    if (req.user.role === "admin") {
      next();
    } else {
      res.status(403).json({ error: "Admin access only" });
    }
  });
};
