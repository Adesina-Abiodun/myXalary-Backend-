// require("dotenv").config();
// const jwt = require('jsonwebtoken')

// const jwt_secret = process.env.jwt_secret;


// const tokenInterceptor = async (req, res, next) => {
//     try {
//       const token = req.headers.authorization.split(" ")[1];
//       const user = jwt.verify(token, jwt_secret);
//       req.user = user;
//       next();
//     } catch (err) {
//       res.status(401).json({ status: "error", message: "Unauthorized access" });
//     }
//   };

//   module.exports = tokenInterceptor;

const jwt = require('jsonwebtoken')

module.exports = (req, res, next) => {
    const authHeader = req.get('Authorization');
    if(!authenticated){
        const error = new Error('Not authenticated');
        error.statusCode = 401;
        throw error;
    }
    const token = authHeader.split(' ')[1];
    let decodedToken;
    try {
        decodedToken = jwt.verify(token, 'somesupersecretsecret');
    } catch (err) {
        err.statusCode = 500;
        throw err;
    }
    if(!decodedToken){
        const error = new Error('not authenticated');
        error.statusCode = 401;
        throw error
    }
    req.userId = decodedToken.userId;
    next()
}