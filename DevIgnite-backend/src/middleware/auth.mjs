import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();

export const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if (!token) return res.status(401).json({ msg: "Access token required" });

    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user)=>{
        if (err) {
            if (err.name === 'TokenExpiredError') {
                return res.status(401).json({ msg: "Token expired" });
            }
            return res.status(403).json({ msg: "Invalid token" });
        }
        req.user = user;
        next();
    });

};