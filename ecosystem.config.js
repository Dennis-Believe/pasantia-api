module.exports = {
  apps: [
    {
      name: 'hono-cloud-api',
      script: './dist/index.js',
      instances: 1,
      exec_mode: 'fork',
      autorestart: true,
      watch: false,
      max_memory_restart: '1G',
    },
  ],
}
