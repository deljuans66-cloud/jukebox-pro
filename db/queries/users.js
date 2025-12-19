import db from "#db/client";
import bcrypt from "bcrypt";

const SALT_ROUNDS = 10;

export async function createUser(username, password) {
  const hashed = await bcrypt.hash(password, SALT_ROUNDS);

  const { rows } = await db.query(
    `
    INSERT INTO users (username, password)
    VALUES ($1, $2)
    RETURNING id, username;
    `,
    [username, hashed]
  );

  return rows[0];
}

export async function getUsers() {
  const { rows } = await db.query(
    `
    SELECT id, username
    FROM users
    ORDER BY id;
    `
  );
  return rows;
}

export async function getUserByUsername(username) {
  const { rows } = await db.query(
    `
    SELECT id, username, password
    FROM users
    WHERE username = $1;
    `,
    [username]
  );
  return rows[0] ?? null;
}

export async function authenticateUser(username, password) {
  const user = await getUserByUsername(username);
  if (!user) return null;

  const ok = await bcrypt.compare(password, user.password);
  if (!ok) return null;

  return { id: user.id, username: user.username };
}
