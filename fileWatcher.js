const fs = require('fs');
const yaml = require('js-yaml');
const utils = require('./utils');

const watchFileChanges = () => {
  fs.watch('services.yaml', async () => {
    console.log('Reloading server...');
    try {
      await loadYAML();
      console.log('Server reloadd successfully');
    } catch (error) {
      console.error('Failed to reload server', error);
    }
  });
};

const loadYAML = async () => {
  try {
    const fileContents = await fs.promises.readFile('services.yaml', 'utf8');
    utils.updateServices(yaml.load(fileContents));
    utils.updateRateLimit(yaml.load(fileContents));
    utils.updateAllowedHosts(yaml.load(fileContents));
    console.log('YAML configuration loaded');
  } catch (error) {
    console.error('Failed to load YAML configuration', error);
  }
};



module.exports = {
  startWatching: watchFileChanges,
  loadYAML: loadYAML,
};
