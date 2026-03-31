/**
 * PM2 process file — adjust cwd and env for your Ubuntu server paths.
 * Usage: pm2 start ecosystem.config.cjs && pm2 save && pm2 startup
 */
module.exports = {
  apps: [
    {
      name: 'bilim-api',
      cwd: __dirname + '/backend',
      script: 'dist/main.js',
      instances: 1,
      exec_mode: 'fork',
      autorestart: true,
      watch: false,
      max_memory_restart: '512M',
      env: {
        NODE_ENV: 'production',
      },
    },
  ],
};
