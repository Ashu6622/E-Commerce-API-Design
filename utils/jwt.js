const jwt = require('jsonwebtoken');

const jwtAuth = (req, res, next)=>{

   // first check weather the token is present or not in the header

   const authToken = req.cookies.token;

   console.log(authToken);


   if(!authToken){
      return res.status(401).json({message:'Token is Not Provided'});
   }

   try{

      const verifyToken = jwt.verify(authToken, process.env.SECRET_KEY);
      req.user_id = verifyToken; 
      next();

   }
   catch(error){
      return res.status(400).json({message:'Token Expires'});
   }
}

const generateToken = (payload)=>{
   console.log(payload)
   return jwt.sign(payload, process.env.SECRET_KEY, {expiresIn:300} );
}

module.exports = {jwtAuth, generateToken};