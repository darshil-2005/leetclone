require('dotenv').config({ path: '../.env.local' });

/**@type {import('drizzle-kit').Config} */
module.exports = {
    schema: './src/schema.js',
    out: './drizzle/migrations',
    dbCredentials: {
        url: process.env.DATABASE_URL
    },
    dialect: 'postgresql',
};
