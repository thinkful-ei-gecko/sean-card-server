const app = require('./app');
const config = require('./config')
const knex = require('knex');

let db = knex({
  client: 'pg',
  connection: config.DATABASE_URL
});

app.set('db',db);

app.listen(config.PORT, () => {
  console.log(`Server listening at http://localhost:${config.PORT}`);
});