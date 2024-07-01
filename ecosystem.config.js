// ecosystem.config.js

module.exports = {
    apps : [{
      name: 'backend',
      script: 'dist/index.js', // Replace with your compiled entry point
      instances: 'max',
      autorestart: true,
      watch: false,
      max_memory_restart: '1G',
      env: {
        NODE_ENV: 'production',
        PORT: 8888, 
      },
      env_production: {
        NODE_ENV: 'production',
        PORT: 8888, 
      }
    }]
  };
  