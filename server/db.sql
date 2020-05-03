docker run --rm --name pg-italki -e POSTGRES_PASSWORD=italki -d -p 5434:5432 -v $HOME/docker/volumes/italki:/var/lib/postgresql/data postgres

psql -h localhost -p 5434 -U postgres -d postgres
psql -h localhost -p 5434 -U italki_user -d italki_db

CREATE ROLE <role_name> WITH PASSWORD '<role_password>';
ALTER ROLE <role_name> WITH LOGIN;
CREATE DATABASE <db_name> OWNER <owner_name>;
GRANT ALL PRIVILEGES ON DATABASE  <db_name> TO <role_name>;


------------------------------------------------------------

DROP TABLE jobs;
DROP INDEX teacher_lesson;
DROP TABLE lessons;
DROP INDEX teacher_rate;
DROP TABLE rates;
DROP INDEX teacher_language;
DROP TABLE languages;
DROP TABLE teachers;

DROP SEQUENCE lesson_id_seq;
DROP SEQUENCE rate_id_seq;
DROP SEQUENCE language_id_seq;


----------------------------------------------------------------

CREATE SEQUENCE language_id_seq;
CREATE SEQUENCE rate_id_seq;
CREATE SEQUENCE lesson_id_seq;

CREATE TABLE teachers (
  id INT PRIMARY KEY NOT NULL,
  name VARCHAR(64),
  country VARCHAR(6),
  schedule INT DEFAULT 10
);

CREATE TABLE languages (
  id INT PRIMARY KEY NOT NULL DEFAULT nextval('language_id_seq'),
  teacher INT NOT NULL,
  language VARCHAR(30),
  level SMALLINT,
  FOREIGN KEY (teacher) REFERENCES teachers (id) ON DELETE CASCADE
);

CREATE UNIQUE INDEX teacher_language ON languages (teacher, language);

CREATE TABLE rates (
  id INT PRIMARY KEY NOT NULL DEFAULT nextval('rate_id_seq'),
  teacher INT NOT NULL,
  rate SMALLINT,
  changed date,
  FOREIGN KEY (teacher) REFERENCES teachers (id) ON DELETE CASCADE
);

CREATE INDEX teacher_rate ON rates (teacher);

CREATE TABLE lessons (
  id INT PRIMARY KEY NOT NULL DEFAULT nextval('lesson_id_seq'),
  teacher INT NOT NULL,
  date date,
  total SMALLINT,
  FOREIGN KEY (teacher) REFERENCES teachers (id) ON DELETE CASCADE
);

CREATE UNIQUE INDEX teacher_lesson ON lessons (teacher, date);

CREATE TABLE jobs (
  hash VARCHAR(32) PRIMARY KEY NOT NULL,
  week SMALLINT
);

