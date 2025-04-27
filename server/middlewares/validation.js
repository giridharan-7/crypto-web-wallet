const {z} = require('zod')

const passwordSchema=z.object({
    password:z.string().min(8,"Password must be at least 8 characters long").max(100,"Password must be at most 100 characters long"),
    confirmPassword:z.string().min(8,"Password must be at least 8 characters long").max(100,"Password must be at most 100 characters long")
})

const validatePassword=(req,res,next)=>{
    // try{
    //     const result=passwordSchema.safeParse(req.body)

    //     if(!result.success()){
    //        return res.status(400).json({errors:[{message:result.error.errors[0].message}]})
    //     } 
        
    //     if(req.body.password!==req.body.confirmPassword){
    //         return res.status(400).json({errors:[{message:'Passwords do not match'}]})
    //      }
    //      next()
    // }
    // catch(error){
    //     return res.status(400).json({errors:[{message:'Wrong Format entered... or something wrong with the data'}]})
    // }
    next()
}

module.exports={validatePassword}