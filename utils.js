let services = [];
const jwt = require('jsonwebtoken');

const updateServices = (newServices) => {
  services = newServices;
};

const getServices = () => {
  return services.services;
};

// Function to verify JWT token
const verifyToken = (req) => {
    let result = {};
    try {
        const authHeader = req.headers.authorization;
        if (authHeader) {
            const header = authHeader.split(' ')[0];
            if (header != "Bearer"){
                throw new Error("Invalid Authentication Header.");
            }
            const token = authHeader.split(' ')[1];
            const decoded = jwt.verify(token, '234');
            result.status=200;
            result.data=decoded;
            return result;
        }else{
            result.status=200;
            result.data={};
            return result;
        }

    } catch (error) {
        result.data=error.message;
        if (error instanceof jwt.JsonWebTokenError) {
            result.data="Invalid Authentication Token.";
        }
        result.status=403;
        return result;
    }
    }


module.exports = {
  updateServices: updateServices,
  getServices: getServices,
  verifyToken: verifyToken,
};
