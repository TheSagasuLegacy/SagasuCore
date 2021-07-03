// eslint-disable-next-line @typescript-eslint/no-var-requires
const dotenv = require('dotenv');

module.exports = {
  type: 'postgres',
  url: dotenv.config().parsed?.DATABASE_URL,
  entities: ['./**/*.entity.{ts,ts}'],
  migrations: ['./migration/*.{ts,js}'],
  cli: {
    migrationsDir: 'migration',
  },
};
