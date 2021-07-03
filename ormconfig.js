// eslint-disable-next-line @typescript-eslint/no-var-requires
const dotenv = require('dotenv');

module.exports = {
  type: 'postgres',
  url: dotenv.config().parsed?.DATABASE_URL,
  entities: ['dist/**/*.entity{.ts,.js}'],
  migrations: ['dist/migration/*{.ts,.js}'],
  cli: {
    migrationsDir: 'migration',
  },
};
