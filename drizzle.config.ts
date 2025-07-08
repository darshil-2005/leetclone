/**@type {import('drizzle-kit').Config} */


module.exports = {
    schema: './lib/schema.js',
    out: './drizzle/migrations',
    dbCredentials: {
        url: './sqlite.db'
    },
    dialect: 'sqlite',
};