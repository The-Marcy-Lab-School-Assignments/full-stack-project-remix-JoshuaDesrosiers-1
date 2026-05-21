const pool = require('../db/pool');

// Returns all sushis for a specific user, ordered by creation time
module.exports.listByUser = async (user_id) => {
  const query = 'SELECT * FROM sushis WHERE user_id = $1 ORDER BY sushi_id ASC';
  const { rows } = await pool.query(query, [user_id]);
  return rows;
};

// Returns a single sushi row (used for ownership checks before update/delete)
module.exports.find = async (sushi_id) => {
  const query = 'SELECT * FROM sushis WHERE sushi_id = $1';
  const { rows } = await pool.query(query, [sushi_id]);
  return rows[0] || null;
};

// Creates a new sushi. Returns the full sushi row.
module.exports.create = async (title, user_id) => {
  const query = 'INSERT INTO sushis (title, user_id) VALUES ($1, $2) RETURNING *';
  const { rows } = await pool.query(query, [title, user_id]);
  return rows[0];
};

// Updates is_complete for a sushi. Returns the updated row.
module.exports.update = async (sushi_id, { is_complete }) => {
  const query = 'UPDATE sushis SET is_complete = $1 WHERE sushi_id = $2 RETURNING *';
  const { rows } = await pool.query(query, [is_complete, sushi_id]);
  return rows[0];
};

// Deletes a sushi by id
module.exports.destroy = async (sushi_id) => {
  const query = 'DELETE FROM sushis WHERE sushi_id = $1 RETURNING *';
  const { rows } = await pool.query(query, [sushi_id]);
  return rows[0] || null;
};
