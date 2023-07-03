let services = [];
let rateLimitConfig = {};
let allowedHosts = [];



const jwt = require('jsonwebtoken');
const FormData = require('form-data');


const updateServices = (conf) => {
    //validation for each service
    if (!conf.hasOwnProperty('services')) {
        throw new Error('YAML file is missing the services object');
    }
    const requiredKeys = ['serviceName', 'path', 'url'];
    conf.services.forEach(obj => {
    const missingKeys = [];

    requiredKeys.forEach(key => {
        if (!obj.hasOwnProperty(key)) {
        missingKeys.push(key);
        }
    });

    if (missingKeys.length > 0) {
        const errorMessage = `Services is missing the following key(s): ${missingKeys.join(', ')}`;
        throw new Error(errorMessage);
    }

    });
    services = conf.services;
};

const updateRateLimit = (conf) => {
    //validation for rateLimit
    if (!conf.hasOwnProperty('rateLimit')) {
        throw new Error('YAML file is missing the rateLimit object');
    }
    const requiredKeys = ['enabled', 'durationInSec', 'maxRequests'];
    if (requiredKeys.some(key => !conf.rateLimit.hasOwnProperty(key))) {
        const missingKeys = requiredKeys.filter(key => !conf.rateLimit.hasOwnProperty(key));
        const errorMessage = `rateLimit is missing the following key(s): ${missingKeys.join(', ')}`;
        throw new Error(errorMessage);
    }

    rateLimitConfig = conf.rateLimit
};

const updateAllowedHosts = (conf) => {
    //validation for AllowedHosts
    if (!conf.hasOwnProperty('allowedHosts')) {
        throw new Error('YAML file is missing the allowedHosts object');
    }
    if (conf.allowedHosts){
        allowedHosts = conf.allowedHosts
    }
};

const getServices = () => {
  return services;
};

const getRateLimit = () => {
  return rateLimitConfig;
};
const getAllowedHosts = () => {
  return allowedHosts;
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
        if (error instanceof jwt.JsonWebTokenError) {
            result.data="Invalid or Expired Authentication Token.";
        }
        result.status=403;
        return result;
    }
};

// Modifing Relative urls present an HTML file with service name
const modifingRelativeUrls = (html, service) => {
    prefix = `/${service}/`
    const attrRegex = /(["'])\/([^"']+?)\1/g
    html = html.replace(attrRegex, `$1${prefix}$2$1`);
    return html
}

const createFormDataUsingReqFiles = (req) => {
    const form = new FormData();
    // Add file data to the FormData object
    Object.keys(req.files).forEach(key => {
        const fileData = req.files[key];
        form.append(fileData.fieldname, fileData.buffer, {
            filename: fileData.originalname,
            contentType: fileData.mimetype,
        });
    });
    // Add other data from req.body to the FormData object
    Object.keys(req.body).forEach(key => {
        const value = req.body[key];
        form.append(key, value);
    });
    req.body = form;
    return req
}

module.exports = {
  updateServices: updateServices,
  getServices: getServices,
  verifyToken: verifyToken,
  getRateLimit: getRateLimit,
  getAllowedHosts: getAllowedHosts,
  updateRateLimit: updateRateLimit,
  updateAllowedHosts: updateAllowedHosts,
  modifingRelativeUrls: modifingRelativeUrls,
  createFormDataUsingReqFiles: createFormDataUsingReqFiles
};
