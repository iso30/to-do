CREATE TABLE IF NOT EXISTS users (
  ID SERIAL PRIMARY KEY,
  email VARCHAR,
  passhash VARCHAR,
  nickname VARCHAR,
  logintype VARCHAR
);

CREATE TABLE IF NOT EXISTS todos(
  ID SERIAL PRIMARY KEY,
  user_ID INTEGER REFERENCES users(ID),
  title VARCHAR,
  description VARCHAR,
  isdone BOOLEAN,
  created_on TIMESTAMP DEFAULT(NOW())
);
