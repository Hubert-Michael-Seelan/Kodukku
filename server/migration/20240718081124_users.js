/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
  return knex.schema.createTable('users', function(table) {
    table.increments('id').primary(); // Auto-incrementing ID column
    table.string('name').notNullable(); // Name column
    table.string('email').notNullable().unique(); // Email column (unique)
    table.string('password').notNullable(); // Password column
    table.timestamps(true, true); // created_at and updated_at columns
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
  return knex.schema.dropTable('users'); // Drop the users table
};
