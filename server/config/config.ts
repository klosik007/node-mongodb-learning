const env = process.env.NODE_ENV || 'development';

if (['test', 'development'].includes(env)) {
  const config = require('./config.json');
  const envConfig = config[env];

  Object.keys(envConfig).forEach((key) =>{
    process.env[key] = envConfig[key];
  });
}