/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
  return knex.schema.createTable('products', function(table) {
    table.increments('product_id').primary(); // Auto-incrementing product ID
    table.string('product_name').notNullable(); // Product name
    table.string('product_image_url').notNullable(); // Product image URL
    table.decimal('product_price', 14, 2).notNullable(); // Product price with 2 decimal places
    table.timestamps(true, true); // created_at and updated_at columns
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
  return knex.schema.dropTable('products'); // Drop the products table
};
