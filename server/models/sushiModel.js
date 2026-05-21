const pool = require('../db/pool');

// Returns all sushis for a specific user
module.exports.listByUser = async (user_id) => {
  const query = `
    SELECT *
    FROM sushis
    WHERE user_id = $1
    ORDER BY sushi_id ASC
  `;

  const { rows } = await pool.query(query, [user_id]);
  return rows;
};

// Returns a single sushi row
module.exports.find = async (sushi_id) => {
  const query = `
    SELECT *
    FROM sushis
    WHERE sushi_id = $1
  `;

  const { rows } = await pool.query(query, [sushi_id]);
  return rows[0] || null;
};

// Creates a new sushi
module.exports.create = async (
  title,
  description,
  matrix,
  user_id
) => {
  const query = `
    INSERT INTO sushis (
      title,
      description,
      matrix,
      user_id
    )
    VALUES ($1, $2, $3, $4)
    RETURNING *
  `;

  const { rows } = await pool.query(query, [
    title,
    description,
    JSON.stringify(matrix),
    user_id,
  ]);

  return rows[0];
};

// Updates a sushi
module.exports.update = async (
  sushi_id,
  { title, description, matrix }
) => {
  const query = `
    UPDATE sushis
    SET
      title = COALESCE($1, title),
      description = COALESCE($2, description),
      matrix = COALESCE($3::jsonb, matrix)
    WHERE sushi_id = $4
    RETURNING *
  `;

  const { rows } = await pool.query(query, [
    title,
    description,
    matrix === undefined ? null : JSON.stringify(matrix),
    sushi_id,
  ]);

  return rows[0];
};

// Deletes a sushi
module.exports.destroy = async (sushi_id) => {
  const query = `
    DELETE FROM sushis
    WHERE sushi_id = $1
    RETURNING *
  `;

  const { rows } = await pool.query(query, [sushi_id]);

  return rows[0] || null;
};
