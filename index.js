const cluster = require('cluster');
const os = require('os');

// if (cluster.isMaster) {
//   const numCPUs = os.cpus().length;
//   console.log();

//   console.log(`Master process is running with ${numCPUs} CPU cores`);

//   for (let i = 0; i < numCPUs; i++) {
//     cluster.fork();
//   }

//   cluster.on('exit', (worker, code, signal) => {
//     console.log(`Worker process ${worker.process.pid} exited`);
//     cluster.fork();
//   });
// } else 
{
  const app = require('./app');
  const startServer = () => {
    const port = process.env.PORT || 8765;
    app.listen(port, () => {
      console.log(`API gateway is running on ${port}`);
    });
  };

  startServer();
}
