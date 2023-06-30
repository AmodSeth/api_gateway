const express = require('express');
const axios = require('axios');
const utils = require('./utils');
const FormData = require('form-data');
const rateCheck = require('./ratelimiter')

const router = express.Router();

router.all('/:service/:sub_url/*', async (req, res) => {
  const { service, sub_url } = req.params;

  const matchedService = utils.getServices().find(s => s.path.toLowerCase() === service.toLowerCase());
  
  // API RateLimit Checker
  if (utils.getRateLimit().enabled){
    let overLimit = await rateCheck.isOverLimit(req.ip)
    if (overLimit) {
      return res.status(429).send({message:'Too many requests - try again later'})
    }
  }

  if (!matchedService) {
    return res.status(404).send({ error: 'Service not found' });
  }

  const { url } = matchedService;
  const path = req.url.replace(`/${service}`, '');
  
  const bypassAuthArray = ["public", "callback","media"] // auth token is not checked
  const oldTokenArray = ["motor","master"] // sends old django auth token and jwt-token header

  try {
    delete req.headers['host']; // Need to look into it
    delete req.headers['content-length'] // content-length is added automatically by the libraries
    
    if (bypassAuthArray.indexOf(sub_url) == -1){
      // Verify Auth Token
      const {status, data} = utils.verifyToken(req, service)
      if (status != 200){
        return res.status(status).json({ error: data });
      }
      
      //add jwt header for motor,master
      if (oldTokenArray.indexOf(service) != -1){
        req.headers['JWT-Token']=req.headers.authorization
        req.headers.authorization="Token "+data.authtoken
      }
    }

    if (req.files) {
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
    }

    
    const response = await axios({
      method: req.method,
      url: `${url}${path}`,
      headers: req.headers,
      data: req.body,
      responseType: 'stream', // Set the response type to stream
    });
    // Set the appropriate headers for file download
    const contentDisposition = response.headers['content-disposition'];
    const contentType = response.headers['content-type'];
    if (contentDisposition) {
      res.set('Content-Disposition', contentDisposition);
    }
    if (contentType) {
      res.set('Content-Type', contentType);
    }
    response.data.pipe(res);
    // res.status(response.status).send(response.data);
  } catch (error) {
    if (error.response) {
      const contentDisposition = error.response.headers['content-disposition'];
      if (contentDisposition) {
        res.set('Content-Disposition', contentDisposition);
      }
      error.response.data.pipe(res);
      // res.status(error.response.status).send(error.response.data);
    } else {
      console.log(`ERROR=> ${error}`);
      return res.status(500).json({ error: 'Internal Server Error' });
    }
  }
});


module.exports = router;
