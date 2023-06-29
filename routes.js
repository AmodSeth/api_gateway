const express = require('express');
const axios = require('axios');
const utils = require('./utils');
const FormData = require('form-data');

const router = express.Router();

router.all('/:service/:sub_url/*', async (req, res) => {
  const { service, sub_url } = req.params;
  console.log(req.params)
  const matchedService = utils.getServices().find(s => s.path.toLowerCase() === service.toLowerCase());

  if (!matchedService) {
    return res.status(404).send({ error: 'Service not found' });
  }

  const { url } = matchedService;
  const path = req.url.replace(`/${service}`, '');
  
  const bypassAuthArray = ["public", "callback"]
  const oldTokenArray = ["motor","master"]

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
    });
    // console.log(`METHOD=>${req.method}\nURL=>${url}${path}`);
    return res.status(response.status).json(response.data);
  } catch (error) {
    if (error.response) {
      return res.status(error.response.status).json(error.response.data);
    } else {
      console.log(`ERROR=> ${error}`);
      return res.status(500).json({ error: 'Internal Server Error' });
    }
  }
});



module.exports = router;
