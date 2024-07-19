module.exports = {
  client: "mssql",
  connection: {
    server: "DESKTOP-G5921LB",
    database: "user",
    user: "hubert",
    password: "hubert",
  },

  migrations: {
    tableName: "knex_migrations",
    directory: "./migration",
  },
};
