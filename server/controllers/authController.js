const bcrypt=require('bcryptjs')
const jwt=require('jsonwebtoken')
const crypto=require('crypto')


const {generateMnemonic,mnemonicToSeed}=require('bip39')

// const register = async (req, res) => {
//   console.log("Register function hit");  // Debugging log
// }
const register=async (req,res) => {
  // console.log('register endpoint hit')

    try{
      // console.log('register endpoint hit')
        const {password} = req.body;

        const salt=await bcrypt.genSalt(10);
        const hashedPassword=await bcrypt.hash(password,salt)
        const mnemonic=generateMnemonic().toString()
        const seed=await mnemonicToSeed(mnemonic)

        const saltForKey=crypto.randomBytes(32).toString('hex')
        const key=crypto.pbkdf2Sync(hashedPassword,saltForKey,10000,16,'sha256')
        const iv=crypto.randomBytes(16)
        const cipher=crypto.createCipheriv('aes-128-cbc',key,iv)
        let encryptedMnemonic = cipher.update(mnemonic, 'utf8', 'hex');
        encryptedMnemonic += cipher.final('hex');
        
        const cipherSeed = crypto.createCipheriv('aes-128-cbc', key, iv);
        let encryptedSeed = cipherSeed.update(seed.toString('hex'), 'utf8', 'hex');
        encryptedSeed += cipherSeed.final('hex');
        // console.log(hashedPassword,saltForKey,encryptedMnemonic,encryptedSeed,iv)
        return res.status(201).json({
          message: 'Password created successfully',
          hashedPassword,
          saltForKey,  
          encryptedMnemonic,
          encryptedSeed,
          iv: iv.toString('hex'),  
        });
    
      } catch (error) {
       return  res.status(500).json({ errors: [{ message: 'Server Error', error: req.body }] });
      }
    };

const login = async(req,res) =>{
    const {password,hashedPasswordFromStorage}=req.body;

    if(!password || !hashedPasswordFromStorage){
        return res.status(400).json({errors:[{message:'Please provide password and hashed password or register first if hashed password was not there'}]})
    }

    const isMatch=await bcrypt.compare(password,hashedPasswordFromStorage)

    if(!isMatch){
        return res.status(400).json({errors:[{message:'Invalid credentials'}]})
    }
    const token = jwt.sign(
        { hashedPassword: hashedPasswordFromStorage },
        process.env.JWT_SECRET || "hellothisisaphantomwalletgeneratedbyjagan", 
        { expiresIn: '1h' } 
      );
  
    res.status(200).json({message:'Logged in successfully',token,})
}

module.exports={register,login}