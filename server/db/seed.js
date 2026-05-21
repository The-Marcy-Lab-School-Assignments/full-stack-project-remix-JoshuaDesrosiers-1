require('dotenv').config();
const bcrypt = require('bcrypt');
const pool = require('./pool');

const SALT_ROUNDS = 8;

const seed = async () => {
  // Drop tables in reverse dependency order
  await pool.query('DROP TABLE IF EXISTS sushis');
  await pool.query('DROP TABLE IF EXISTS users');

  await pool.query(`
    CREATE TABLE users (
      user_id       SERIAL PRIMARY KEY,
      username      TEXT UNIQUE NOT NULL,
      password_hash TEXT NOT NULL
    )
  `);

  await pool.query(`
    CREATE TABLE sushis (
      sushi_id     SERIAL PRIMARY KEY,
      title        TEXT NOT NULL,
      description  TEXT NOT NULL,
      matrix       JSONB NOT NULL,
      user_id      INT REFERENCES users(user_id) ON DELETE CASCADE
    )
  `);

  const [aliceHash, bobHash] = await Promise.all([
    bcrypt.hash('password123', SALT_ROUNDS),
    bcrypt.hash('password123', SALT_ROUNDS),
  ]);

  const { rows: users } = await pool.query(
    `
      INSERT INTO users (username, password_hash) VALUES
        ('alice', $1),
        ('bob',   $2)
      RETURNING user_id, username
    `,
    [aliceHash, bobHash]
  );

  const [alice, bob] = users;

  const smileyMatrix = [
    ['', '#FFFF00', '', '#FFFF00', ''],
    ['', '#FFFF00', '', '#FFFF00', ''],
    ['', '', '', '', ''],
    ['#FFFF00', '', '', '', '#FFFF00'],
    ['', '#FFFF00', '#FFFF00', '#FFFF00', ''],
  ];

  const heartMatrix = [
    ['#FF0000', '', '#FF0000'],
    ['#FF0000', '#FF0000', '#FF0000'],
    ['#FF0000', '#FF0000', '#FF0000'],
    ['', '#FF0000', ''],
  ];

  const checkerMatrix = [
    ['#000000', '#FFFFFF', '#000000'],
    ['#FFFFFF', '#000000', '#FFFFFF'],
    ['#000000', '#FFFFFF', '#000000'],
  ];

  await pool.query(
    `
      INSERT INTO sushis (title, description, matrix, user_id) VALUES
        ($1, $2, $3, $4),
        ($5, $6, $7, $8),
        ($9, $10, $11, $12)
    `,
    [
      'Smiley Face',
      'A simple yellow smiley pixel art.',
      JSON.stringify(smileyMatrix),
      alice.user_id,

      'Heart',
      'Red pixel heart design.',
      JSON.stringify(heartMatrix),
      alice.user_id,

      'Checker Pattern',
      'Black and white checkerboard.',
      JSON.stringify(checkerMatrix),
      bob.user_id,
    ]
  );

  return users;
};

seed()
  .then((users) => {
    console.log('Database seeded successfully.');
    console.log(`Users: ${users.map((u) => u.username).join(', ')}`);
  })
  .catch((err) => {
    console.error('Error seeding database:', err);
    process.exit(1);
  })
  .finally(() => pool.end());