module.exports = {
  apps: [
    {
      name: "result-api",
      script: "./dist/index.js",
      instances: 1, // Solo 1 instancia
      exec_mode: "fork", // Modo fork en lugar de cluster
      autorestart: true,
      watch: false,
      max_memory_restart: "1G",
      env: {
        NODE_ENV: "production",
        PORT: 3000,
        DATABASE_URL: "postgresql://user:password@localhost:5432/dbname",
        JWT_SECRET: "your-jwt-secret",
        JWT_SECRET_EXPIRES_IN: "1d",
      },
    },
  ],
};
