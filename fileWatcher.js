const fs = require('fs');
const yaml = require('js-yaml');
const utils = require('./utils');

const watchFileChanges = () => {
  fs.watch('services.yaml', async () => {
    console.log('Reloading server...');
    try {
      await loadServices();
      console.log('Server reloaded successfully');
    } catch (error) {
      console.error('Failed to reload server', error);
    }
  });
};

const loadServices = async () => {
  try {
    const fileContents = await fs.promises.readFile('services.yaml', 'utf8');
    utils.updateServices(yaml.load(fileContents));
    console.log('Services configuration loaded');
  } catch (error) {
    console.error('Failed to load services configuration', error);
  }
};

module.exports = {
  startWatching: watchFileChanges,
  loadServices: loadServices,
};
