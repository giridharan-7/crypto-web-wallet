const jwt = require('jsonwebtoken')

const validateToken = (req, res, next) => {
    const authHeader = req.headers['authorization']
    const token = authHeader && authHeader.startsWith('Bearer ') 
        ? authHeader.slice(7) 
        : null

    if (!token) {
        return res.status(401).json({ message: "Token missing, authorization denied" })
    }
    
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET || "hellothisisaphantomwalletgeneratedbyjagan")
        req.user = decoded
        next()
    } catch (error) {
        return res.status(401).json({ message: "Token is not valid" })
    }
}

module.exports = { validateToken }