const findConfig = (config, name) => config.find(c => c.name === name);

module.exports = findConfig;
