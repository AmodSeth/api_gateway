const express = require('express');
const axios = require('axios');
const utils = require('./utils');
const FormData = require('form-data');

const router = express.Router();

router.all('/:service/*', async (req, res) => {
  const { service } = req.params;
  const matchedService = utils.getServices().find(s => s.path.toLowerCase() === service.toLowerCase());

  if (!matchedService) {
    return res.status(404).send({ error: 'Service not found' });
  }

  const { url } = matchedService;
  const path = req.url.replace(`/${service}`, '');

  try {
    delete req.headers['host']; // Need to look into it
    delete req.headers['content-length'] // content-length is added automatically by the libraries
    // Verify Auth Token [if present]
    // const {status, data} = utils.verifyToken(req)
    // if (status != 200){
    //   return res.status(status).json({ error: data });
    // }

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
