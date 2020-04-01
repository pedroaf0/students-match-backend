
exports.up = function(knex) {
    return knex.schema
    .createTable('users', function (table) {
       table.int('id').notNullable();
       table.string('name').notNullable();
       table.string('email').notNullable();
       table.string('cell').notNullable();
       table.string('school').notNullable();
       table.string('city').notNullable();
       table.string('area_fav').notNullable();
       table.string('area_mal').notNullable();
       table.string('bio').notNullable();
       table.string('password').notNullable();
    });
};

exports.down = function(knex) {
    return knex.schema
    .dropTable("users");};
