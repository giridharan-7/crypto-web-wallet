const jwt=require('jsonwebtoken')

const validateToken= (req,res,next) => {
    const token=req.headers('Authorization') ?.replace('Bearer ','')

    if(!token){
        return res.sendStatus(401).json({message:"Token missing , authorization denied"})
    }
    try{

        const decoded=jwt.verify(token,process.env.JWT_SECRET || "hellothisisaphantomwalletgeneratedbyjagan")
        next()

    } catch(error){
        return res.status(401).json({message:"Token is not valid"})
    }
}

module.exports={validateToken}