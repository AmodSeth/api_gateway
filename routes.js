const express = require('express');
const axios = require('axios');
const utils = require('./utils');

const router = express.Router();

// Rate Limit Middleware
// router.use('/:service/*', (req, res, next) => {
//   const { service } = req.params;
//   const matchedService = utils.getServices().find(s => s.path.toLowerCase() === service.toLowerCase());
//   const rateLimitConfig = utils.getRateLimit()
//   if (rateLimitConfig && rateLimitConfig.enabled) {
//     rateLimitConfig.limiter()
//     .then(function () {
//       console.log('ffasfaf');
//       next();
//     })
//     .catch(
//       function() {
//         console.log('123123123');
//         res.status(429).send(rateLimitConfig.errorMsg);
//       }
//     );
//   } else {
//     next();
//   }
// });

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
