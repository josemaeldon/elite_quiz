-- PostgreSQL schema for Elite Quiz

-- users table (converted from tbl_users)
CREATE TABLE IF NOT EXISTS tbl_users (
  id SERIAL PRIMARY KEY,
  firebase_id TEXT NOT NULL DEFAULT '',
  name VARCHAR(128) NOT NULL DEFAULT '',
  email VARCHAR(128) NOT NULL DEFAULT '',
  mobile VARCHAR(32) NOT NULL DEFAULT '',
  type VARCHAR(16) NOT NULL DEFAULT '',
  profile VARCHAR(128) NOT NULL DEFAULT '',
  fcm_id VARCHAR(1024),
  web_fcm_id VARCHAR(1024),
  coins INTEGER NOT NULL DEFAULT 0,
  refer_code VARCHAR(128),
  friends_code VARCHAR(128),
  remove_ads SMALLINT NOT NULL DEFAULT 0,
  daily_ads_counter INTEGER NOT NULL DEFAULT 0,
  daily_ads_date DATE NOT NULL DEFAULT CURRENT_DATE,
  status SMALLINT NOT NULL DEFAULT 0,
  date_registered TIMESTAMP WITHOUT TIME ZONE NOT NULL DEFAULT NOW(),
  api_token TEXT NOT NULL DEFAULT '',
  app_language VARCHAR(512),
  web_language VARCHAR(512),
  password_hash TEXT,
  password_salt TEXT,
  last_login TIMESTAMP WITHOUT TIME ZONE
);
CREATE INDEX IF NOT EXISTS idx_tbl_users_firebase_id ON tbl_users(firebase_id);
CREATE UNIQUE INDEX IF NOT EXISTS ux_tbl_users_email ON tbl_users(email);

-- badges table
CREATE TABLE IF NOT EXISTS tbl_users_badges (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES tbl_users(id) ON DELETE CASCADE,
  dashing_debut INTEGER NOT NULL DEFAULT 0,
  dashing_debut_counter INTEGER NOT NULL DEFAULT 0,
  combat_winner INTEGER NOT NULL DEFAULT 0,
  combat_winner_counter INTEGER NOT NULL DEFAULT 0,
  clash_winner INTEGER NOT NULL DEFAULT 0,
  clash_winner_counter INTEGER NOT NULL DEFAULT 0,
  most_wanted_winner INTEGER NOT NULL DEFAULT 0,
  most_wanted_winner_counter INTEGER NOT NULL DEFAULT 0,
  ultimate_player INTEGER NOT NULL DEFAULT 0,
  quiz_warrior INTEGER NOT NULL DEFAULT 0,
  quiz_warrior_counter INTEGER NOT NULL DEFAULT 0,
  super_sonic INTEGER NOT NULL DEFAULT 0,
  flashback INTEGER NOT NULL DEFAULT 0,
  brainiac INTEGER NOT NULL DEFAULT 0,
  big_thing INTEGER NOT NULL DEFAULT 0,
  elite INTEGER NOT NULL DEFAULT 0,
  thirsty INTEGER NOT NULL DEFAULT 0,
  thirsty_date DATE,
  thirsty_counter INTEGER NOT NULL DEFAULT 0,
  power_elite INTEGER NOT NULL DEFAULT 0,
  power_elite_counter INTEGER NOT NULL DEFAULT 0,
  sharing_caring INTEGER NOT NULL DEFAULT 0,
  streak INTEGER NOT NULL DEFAULT 0,
  streak_date DATE,
  streak_counter INTEGER NOT NULL DEFAULT 0
);
CREATE UNIQUE INDEX IF NOT EXISTS ux_tbl_users_badges_user ON tbl_users_badges(user_id);

-- in-app purchases
CREATE TABLE IF NOT EXISTS tbl_users_in_app (
  id SERIAL PRIMARY KEY,
  pay_from SMALLINT NOT NULL,
  uid TEXT NOT NULL,
  user_id INTEGER NOT NULL REFERENCES tbl_users(id) ON DELETE CASCADE,
  product_id TEXT NOT NULL,
  amount NUMERIC NOT NULL,
  status VARCHAR(50) NOT NULL,
  transaction_id TEXT NOT NULL,
  date TIMESTAMP WITHOUT TIME ZONE NOT NULL DEFAULT NOW(),
  purchase_token TEXT NOT NULL,
  response_data TEXT NOT NULL
);

-- battle rooms (replacing Firestore rooms)
CREATE TABLE IF NOT EXISTS battle_rooms (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  category_id INTEGER NOT NULL,
  owner_id INTEGER NOT NULL REFERENCES tbl_users(id) ON DELETE CASCADE,
  entry_coin INTEGER NOT NULL DEFAULT 0,
  status TEXT NOT NULL DEFAULT 'waiting',
  match_id TEXT,
  room_code TEXT UNIQUE,
  max_players INTEGER NOT NULL DEFAULT 2,
  metadata JSONB,
  created_at TIMESTAMP WITHOUT TIME ZONE NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP WITHOUT TIME ZONE NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_battle_rooms_owner ON battle_rooms(owner_id);

CREATE TABLE IF NOT EXISTS battle_room_participants (
  room_id UUID NOT NULL REFERENCES battle_rooms(id) ON DELETE CASCADE,
  user_id INTEGER NOT NULL REFERENCES tbl_users(id) ON DELETE CASCADE,
  role TEXT NOT NULL DEFAULT 'player',
  joined_at TIMESTAMP WITHOUT TIME ZONE NOT NULL DEFAULT NOW(),
  ready BOOLEAN NOT NULL DEFAULT FALSE,
  PRIMARY KEY(room_id, user_id)
);

CREATE TABLE IF NOT EXISTS battle_room_messages (
  id BIGSERIAL PRIMARY KEY,
  room_id UUID NOT NULL REFERENCES battle_rooms(id) ON DELETE CASCADE,
  sender_id INTEGER NOT NULL REFERENCES tbl_users(id),
  is_text BOOLEAN NOT NULL DEFAULT TRUE,
  payload JSONB NOT NULL,
  created_at TIMESTAMP WITHOUT TIME ZONE NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_battle_room_messages_room ON battle_room_messages(room_id);

CREATE TABLE IF NOT EXISTS battle_room_events (
  id BIGSERIAL PRIMARY KEY,
  room_id UUID NOT NULL REFERENCES battle_rooms(id) ON DELETE CASCADE,
  event_type TEXT NOT NULL,
  payload JSONB,
  created_at TIMESTAMP WITHOUT TIME ZONE NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_battle_room_events_room ON battle_room_events(room_id);
