const express = require('express');
const axios = require('axios');
const utils = require('./utils');

const router = express.Router();

router.all('/:service/*', async (req, res) => {
  const { service } = req.params;

  const matchedService = utils.getServices().find(s => s.path.toLowerCase() === service.toLowerCase());
  if (!matchedService) {
    res.status(404).json({ error: 'Service not found' });
    return;
  }

  const { url } = matchedService;
  const path = req.url.replace(`/${service}`, '');

  try {
    delete req.headers['host'];

    // Verify Auth Token [if present]
    const {status, data} = utils.verifyToken(req)
    if (status != 200){
      res.status(status).json({ error: data });
    }


    const response = await axios({
      method: req.method,
      url: `${url}${path}`,
      headers: req.headers,
      data: req.body,
    });
    // console.log(`METHOD=>${req.method}\nURL=>${url}${path}`);
    res.status(response.status).send(response.data);
  } catch (error) {
    if (error.response) {
      res.status(error.response.status).json({ error: error.response.data });
    } else {
      console.log(error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  }
});

module.exports = router;
