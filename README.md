  
![NodeJS](https://img.shields.io/badge/node.js-6DA55F?style=for-the-badge&logo=node.js&logoColor=white) ![JavaScript](https://img.shields.io/badge/javascript-%23323330.svg?style=for-the-badge&logo=javascript&logoColor=%23F7DF1E) ![NPM](https://img.shields.io/badge/NPM-%23CB3837.svg?style=for-the-badge&logo=npm&logoColor=white) ![Express.js](https://img.shields.io/badge/express.js-%23404d59.svg?style=for-the-badge&logo=express&logoColor=%2361DAFB) ![JWT](https://img.shields.io/badge/JWT-black?style=for-the-badge&logo=JSON%20web%20tokens)



# API Gateway Service

This microservice acts as a single point of contact for FrontEnd, without exposing other internal microservices.



## Features

```
> Routing
> Authentication
> Logging
> Rate Limiting of Requests
> IP Whitelisting
> DB-Less Design 

```

## services.yaml content
```
rateLimit:
  enabled: true
  durationInSec: 5
  maxRequests: 1

services:
  - serviceName: Foundation
    path: foundation
    url: https://foundation-uatn.theblackswan.in
    rateLimitEnabled: false

  - serviceName: CMS
    path: cms
    url: https://cms-uatn.theblackswan.in

  - serviceName: MASTER
    path: master
    url: https://master-service-uatn.theblackswan.in

  - serviceName: POSP
    path: posp
    url: https://posp-dev.zopperinsurance.com
```
## .ENV file content

```
NODE_ENV=development

```

## Tech Stack

**Server:** Node, ExpressJS, Axios, JWT

