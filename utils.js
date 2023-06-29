let services = [];
let rateLimitConfig = {
    enabled: false,
    limiter:{},
    errorMsg: "Too many requests, please try again later."
};



const jwt = require('jsonwebtoken');


const updateServices = (conf) => {
  services = conf.services;
};
const updateRateLimit = (conf) => {

    // Sets rate limiting configuration if enabled
    if (conf.rateLimit.enabled){
        rateLimitConfig.enabled = true;
    }
};

const getServices = () => {
  return services;
};

const getRateLimit = () => {
  return rateLimitConfig;
};

// Function to verify JWT token
const verifyToken = (req, service) => {
    let result = {};
    try {
        const authHeader = req.headers.authorization;
        if (authHeader) {
            const header = authHeader.split(' ')[0];
            if (header != "Bearer"){
                throw new Error("Invalid Authentication Header.");
            }
            const token = authHeader.split(' ')[1];
            const pub_key = process.env.TOKEN_KEY // add double quotes around the key variable in env file

            const decoded = jwt.verify(token, pub_key);
            result.status=200;
            result.data=decoded;
            

            return result;
        }else{
            throw new Error("Authentication Header Missing.");
        }

    } catch (error) {
        result.data=error.message;
        console.log('sss', error.message);
        if (error instanceof jwt.JsonWebTokenError) {
            console.log(error.message)
            result.data="Invalid or Expired Authentication Token.";
        }
        result.status=403;
        return result;
    }
    }


module.exports = {
  updateServices: updateServices,
  getServices: getServices,
  verifyToken: verifyToken,
  getRateLimit: getRateLimit,
  updateRateLimit: updateRateLimit,
};
