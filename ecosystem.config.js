module.exports = {
  apps: [
    {
      name: 'backend',
      script: 'src/index.ts',
      watch: true,
      ignore_watch: ['node_modules', 'logs'],
      instances: 1,
      exec_mode: 'fork',
      interpreter: '/usr/bin/ts-node',
      interpreter_args: '-r tsconfig-paths/register',
      autorestart: true,
      max_restarts: 10,
      env: {
        NODE_ENV: 'production',
        PORT: 8888,
      },
    },
  ],
};
