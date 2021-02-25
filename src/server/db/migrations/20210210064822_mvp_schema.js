exports.up = async knex => {
  try {
    const tablesCreated = await knex.schema.createTable('users', table => {
        table.uuid('users_id').unique().notNullable()
        table.string('email').unique().notNullable()
        table.string('password').notNullable()
        table.string('first_name').notNullable()
        table.string('last_name').notNullable()
        table.text('bio') //optional field
        table.timestamp('created_at').defaultTo(knex.fn.now())
      })
      .createTable('listings', table => {
        table.uuid('listings_id').unique().notNullable()
        table.uuid('listings_user_id').unique().notNullable()
        table.foreign('listings_user_id').references('users_id').inTable('users')
        table.float('rent', { precision: 2 }).notNullable()
        table.text('description') // optional field
        table.timestamp('created_at').defaultTo(knex.fn.now())
      })
      .createTable('locations', table => {
        table.uuid('locations_id').unique().notNullable()
        table.string('suburb').notNullable()
        table.integer('postcode').unsigned().notNullable()
        table.uuid('locations_user_id').unique()
        table.foreign('locations_user_id').references('users_id').inTable('users')
        table.uuid('locations_listing_id').unique()
        table.foreign('locations_listing_id').references('listings_id').inTable('listings')
        table.timestamp('created_at').defaultTo(knex.fn.now())
    })
    //here we need to check that all likes per ad are unique,
    //i.e. one user cannot leave multiple likes per post.
    //when inserting, we will check, for a post request, if there is a record
    //where user_id equals incoming user id AND listing_id equals
    //incoming advertisement ID, prevent insert as the user has already
    //registered likes on that ad. 
    .createTable('likes', table => {
        table.uuid('likes_id').unique().notNullable()
        table.uuid('likes_user_id').notNullable()
        table.foreign('likes_user_id').references('users_id').inTable('users')
        table.uuid('likes_listing_id').notNullable()
        table.foreign('likes_listing_id').references('listings_id').inTable('listings')
        table.timestamp('created_at').defaultTo(knex.fn.now())
      })
    
    //populate the ENV variables with the names of the fields, so that
    //when requests come from client, we can validate that the data
    //is formed correctly.
    //userskeys
    //listingskeys
    //locationskeys
    //likeskeys

    return tablesCreated
    } catch (e) {
      console.error({msg: 'error from migrations file'}, e)
    }
}

exports.down = knex => {
    return knex.schema.dropTableIfExists('likes')
        .dropTableIfExists('location')
        .dropTableIfExists('listings')
        .dropTableIfExists('users')
}
