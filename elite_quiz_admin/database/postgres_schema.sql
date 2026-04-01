-- PostgreSQL schema for Elite Quiz (complete)
-- Converted from MySQL dump

CREATE EXTENSION IF NOT EXISTS pgcrypto;

CREATE TABLE IF NOT EXISTS tbl_ai_questions (
  id BIGSERIAL PRIMARY KEY,
  language_id INTEGER NOT NULL DEFAULT 0,
  quiz_type INTEGER NOT NULL DEFAULT 0,
  contest_id INTEGER NOT NULL DEFAULT 0,
  exam_id INTEGER NOT NULL DEFAULT 0,
  category INTEGER NOT NULL,
  subcategory INTEGER NOT NULL DEFAULT 0,
  level INTEGER NOT NULL DEFAULT 0,
  question_type INTEGER NOT NULL DEFAULT 0,
  answer_type INTEGER NOT NULL DEFAULT 0,
  question TEXT NOT NULL,
  options TEXT NOT NULL,
  correct_answer varchar(50) NOT NULL,
  marks INTEGER NOT NULL DEFAULT 0,
  status INTEGER NOT NULL DEFAULT 0,
  note varchar(255) DEFAULT NULL,
  date_time TIMESTAMP WITHOUT TIME ZONE NOT NULL
);

CREATE TABLE IF NOT EXISTS tbl_audio_question (
  id SERIAL PRIMARY KEY,
  category INTEGER NOT NULL,
  subcategory INTEGER NOT NULL,
  language_id INTEGER NOT NULL DEFAULT 0,
  audio_type INTEGER NOT NULL,
  audio varchar(255) NOT NULL,
  question TEXT NOT NULL,
  question_type SMALLINT NOT NULL,
  optiona TEXT NOT NULL,
  optionb TEXT NOT NULL,
  optionc TEXT NOT NULL,
  optiond TEXT NOT NULL,
  optione TEXT DEFAULT NULL,
  answer TEXT NOT NULL,
  note TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS tbl_authenticate (
  auth_id SERIAL PRIMARY KEY,
  auth_username varchar(12) NOT NULL,
  auth_pass TEXT NOT NULL,
  role varchar(32) NOT NULL,
  permissions TEXT NOT NULL,
  status INTEGER NOT NULL DEFAULT 0,
  language varchar(255) NOT NULL DEFAULT 'english',
  created TIMESTAMP WITHOUT TIME ZONE NOT NULL
);

CREATE TABLE IF NOT EXISTS tbl_badges (
  id SERIAL PRIMARY KEY,
  language_id INTEGER DEFAULT 14,
  type varchar(100) NOT NULL,
  badge_label varchar(200) NOT NULL,
  badge_note TEXT NOT NULL,
  badge_reward INTEGER NOT NULL,
  badge_icon varchar(100) NOT NULL,
  badge_counter INTEGER NOT NULL
);

CREATE TABLE IF NOT EXISTS tbl_battle_questions (
  id SERIAL PRIMARY KEY,
  match_id varchar(128) NOT NULL,
  entry_coin INTEGER NOT NULL DEFAULT 0,
  questions TEXT NOT NULL,
  date_created TIMESTAMP WITHOUT TIME ZONE NOT NULL,
  set_user1 INTEGER NOT NULL DEFAULT 0,
  set_user2 INTEGER NOT NULL DEFAULT 0
);

CREATE TABLE IF NOT EXISTS tbl_battle_statistics (
  id SERIAL PRIMARY KEY,
  user_id1 INTEGER NOT NULL,
  user_id2 INTEGER NOT NULL,
  is_drawn SMALLINT NOT NULL,
  winner_id INTEGER NOT NULL,
  date_created TIMESTAMP WITHOUT TIME ZONE NOT NULL
);

CREATE TABLE IF NOT EXISTS tbl_bookmark (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL,
  question_id INTEGER NOT NULL,
  status INTEGER NOT NULL,
  type INTEGER NOT NULL
);

CREATE TABLE IF NOT EXISTS tbl_category (
  id SERIAL PRIMARY KEY,
  language_id INTEGER NOT NULL DEFAULT 0,
  category_name varchar(250) NOT NULL,
  slug varchar(250) DEFAULT NULL,
  type INTEGER NOT NULL,
  is_premium SMALLINT NOT NULL DEFAULT 0,
  coins INTEGER NOT NULL DEFAULT 0,
  has_level SMALLINT NOT NULL DEFAULT 1,
  image TEXT DEFAULT NULL,
  row_order INTEGER NOT NULL
);

CREATE TABLE IF NOT EXISTS tbl_coin_store (
  id SERIAL PRIMARY KEY,
  title varchar(50) NOT NULL,
  coins INTEGER NOT NULL,
  type INTEGER NOT NULL DEFAULT 0,
  product_id varchar(150) NOT NULL,
  image TEXT DEFAULT NULL,
  description TEXT NOT NULL,
  status SMALLINT NOT NULL DEFAULT 1
);

CREATE TABLE IF NOT EXISTS tbl_contest (
  id SERIAL PRIMARY KEY,
  language_id INTEGER NOT NULL DEFAULT 0,
  name TEXT NOT NULL,
  start_date TIMESTAMP WITHOUT TIME ZONE NOT NULL,
  end_date TIMESTAMP WITHOUT TIME ZONE NOT NULL,
  description TEXT NOT NULL,
  image varchar(512) NOT NULL,
  entry INTEGER NOT NULL,
  prize_status INTEGER NOT NULL,
  date_created TIMESTAMP WITHOUT TIME ZONE NOT NULL,
  status INTEGER NOT NULL
);

CREATE TABLE IF NOT EXISTS tbl_contest_leaderboard (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL,
  contest_id INTEGER NOT NULL,
  questions_attended INTEGER NOT NULL,
  correct_answers INTEGER NOT NULL,
  score DOUBLE PRECISION NOT NULL,
  last_updated TIMESTAMP WITHOUT TIME ZONE NOT NULL,
  date_created TIMESTAMP WITHOUT TIME ZONE NOT NULL
);

CREATE TABLE IF NOT EXISTS tbl_contest_prize (
  id SERIAL PRIMARY KEY,
  contest_id INTEGER NOT NULL,
  top_winner INTEGER NOT NULL,
  points INTEGER NOT NULL
);

CREATE TABLE IF NOT EXISTS tbl_contest_question (
  id SERIAL PRIMARY KEY,
  langauge_id INTEGER NOT NULL DEFAULT 0,
  contest_id INTEGER NOT NULL,
  image varchar(256) NOT NULL,
  question TEXT NOT NULL,
  question_type INTEGER NOT NULL,
  optiona TEXT NOT NULL,
  optionb TEXT NOT NULL,
  optionc TEXT NOT NULL,
  optiond TEXT NOT NULL,
  optione TEXT NOT NULL,
  answer varchar(12) NOT NULL,
  note TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS tbl_daily_quiz (
  id SERIAL PRIMARY KEY,
  language_id INTEGER NOT NULL,
  questions_id TEXT NOT NULL,
  date_published date NOT NULL
);

CREATE TABLE IF NOT EXISTS tbl_daily_quiz_user (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL,
  date date NOT NULL
);

CREATE TABLE IF NOT EXISTS tbl_exam_module (
  id SERIAL PRIMARY KEY,
  language_id INTEGER NOT NULL DEFAULT 0,
  title TEXT NOT NULL,
  date date NOT NULL,
  exam_key varchar(100) NOT NULL,
  duration INTEGER NOT NULL,
  status INTEGER NOT NULL DEFAULT 0,
  answer_again INTEGER NOT NULL
);

CREATE TABLE IF NOT EXISTS tbl_exam_module_question (
  id SERIAL PRIMARY KEY,
  exam_module_id INTEGER NOT NULL,
  image varchar(512) NOT NULL,
  marks INTEGER NOT NULL,
  question TEXT NOT NULL,
  question_type SMALLINT NOT NULL,
  optiona TEXT NOT NULL,
  optionb TEXT NOT NULL,
  optionc TEXT NOT NULL,
  optiond TEXT NOT NULL,
  optione TEXT DEFAULT NULL,
  answer TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS tbl_exam_module_result (
  id SERIAL PRIMARY KEY,
  exam_module_id INTEGER NOT NULL,
  user_id INTEGER NOT NULL,
  obtained_marks varchar(200) NOT NULL,
  total_duration varchar(20) NOT NULL,
  statistics TEXT NOT NULL,
  status INTEGER NOT NULL,
  rules_violated SMALLINT NOT NULL,
  captured_question_ids TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS tbl_fun_n_learn (
  id SERIAL PRIMARY KEY,
  language_id INTEGER NOT NULL DEFAULT 0,
  category INTEGER NOT NULL,
  subcategory INTEGER NOT NULL,
  title TEXT NOT NULL,
  detail TEXT NOT NULL,
  status INTEGER NOT NULL DEFAULT 0,
  content_type SMALLINT NOT NULL DEFAULT 0,
  content_data varchar(255) NOT NULL
);

CREATE TABLE IF NOT EXISTS tbl_fun_n_learn_question (
  id SERIAL PRIMARY KEY,
  fun_n_learn_id INTEGER NOT NULL,
  question TEXT NOT NULL,
  question_type INTEGER NOT NULL,
  optiona TEXT NOT NULL,
  optionb TEXT NOT NULL,
  optionc TEXT NOT NULL,
  optiond TEXT NOT NULL,
  optione TEXT NOT NULL,
  answer varchar(12) NOT NULL,
  image varchar(250) NOT NULL
);

CREATE TABLE IF NOT EXISTS tbl_guess_the_word (
  id SERIAL PRIMARY KEY,
  language_id INTEGER NOT NULL,
  category INTEGER NOT NULL,
  subcategory INTEGER NOT NULL,
  image TEXT NOT NULL,
  question TEXT NOT NULL,
  answer TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS tbl_languages (
  id SERIAL PRIMARY KEY,
  language varchar(64) NOT NULL,
  code varchar(11) NOT NULL,
  status SMALLINT NOT NULL DEFAULT 0,
  type SMALLINT NOT NULL DEFAULT 0,
  default_active SMALLINT NOT NULL DEFAULT 0
);

CREATE TABLE IF NOT EXISTS tbl_leaderboard_daily (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL,
  score INTEGER NOT NULL,
  date_created TIMESTAMP WITHOUT TIME ZONE NOT NULL
);

CREATE TABLE IF NOT EXISTS tbl_leaderboard_monthly (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL,
  score INTEGER NOT NULL,
  last_updated TIMESTAMP WITHOUT TIME ZONE NOT NULL,
  date_created TIMESTAMP WITHOUT TIME ZONE NOT NULL
);

CREATE TABLE IF NOT EXISTS tbl_level (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL,
  category INTEGER NOT NULL,
  subcategory INTEGER NOT NULL,
  level INTEGER NOT NULL
);

CREATE TABLE IF NOT EXISTS tbl_maths_question (
  id SERIAL PRIMARY KEY,
  category INTEGER NOT NULL,
  subcategory INTEGER NOT NULL,
  language_id INTEGER NOT NULL DEFAULT 0,
  image varchar(512) NOT NULL,
  question TEXT NOT NULL,
  question_type SMALLINT NOT NULL,
  optiona TEXT NOT NULL,
  optionb TEXT NOT NULL,
  optionc TEXT NOT NULL,
  optiond TEXT NOT NULL,
  optione TEXT DEFAULT NULL,
  answer TEXT NOT NULL,
  note TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS tbl_month_week (
  id SERIAL PRIMARY KEY,
  name varchar(100) NOT NULL,
  type INTEGER NOT NULL
);

CREATE TABLE IF NOT EXISTS tbl_multi_match (
  id SERIAL PRIMARY KEY,
  category INTEGER NOT NULL,
  subcategory INTEGER NOT NULL,
  language_id INTEGER NOT NULL DEFAULT 0,
  image varchar(250) NOT NULL,
  question TEXT NOT NULL,
  question_type SMALLINT NOT NULL,
  optiona TEXT NOT NULL,
  optionb TEXT NOT NULL,
  optionc TEXT NOT NULL,
  optiond TEXT NOT NULL,
  optione TEXT DEFAULT NULL,
  answer_type SMALLINT NOT NULL,
  answer TEXT NOT NULL,
  level INTEGER NOT NULL,
  note TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS tbl_multi_match_level (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL,
  category INTEGER NOT NULL,
  subcategory INTEGER NOT NULL,
  level INTEGER NOT NULL
);

CREATE TABLE IF NOT EXISTS tbl_multi_match_question_reports (
  id SERIAL PRIMARY KEY,
  question_id INTEGER NOT NULL,
  user_id INTEGER NOT NULL,
  message varchar(512) NOT NULL,
  date TIMESTAMP WITHOUT TIME ZONE NOT NULL
);

CREATE TABLE IF NOT EXISTS tbl_notifications (
  id SERIAL PRIMARY KEY,
  title varchar(128) NOT NULL,
  message TEXT NOT NULL,
  users varchar(8) NOT NULL DEFAULT 'all',
  user_id TEXT DEFAULT NULL,
  type varchar(250) NOT NULL,
  type_id INTEGER NOT NULL,
  image varchar(128) NOT NULL,
  date_sent TIMESTAMP WITHOUT TIME ZONE NOT NULL
);

CREATE TABLE IF NOT EXISTS tbl_payment_request (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL,
  uid TEXT NOT NULL,
  payment_type varchar(100) NOT NULL,
  payment_address varchar(225) NOT NULL,
  payment_amount varchar(20) NOT NULL,
  coin_used varchar(20) NOT NULL,
  details TEXT NOT NULL,
  status SMALLINT NOT NULL,
  date TIMESTAMP WITHOUT TIME ZONE NOT NULL,
  status_date TIMESTAMP WITHOUT TIME ZONE DEFAULT NULL
);

CREATE TABLE IF NOT EXISTS tbl_question (
  id SERIAL PRIMARY KEY,
  category INTEGER NOT NULL,
  subcategory INTEGER NOT NULL,
  language_id INTEGER NOT NULL DEFAULT 0,
  image varchar(512) NOT NULL,
  question TEXT NOT NULL,
  question_type SMALLINT NOT NULL,
  optiona TEXT NOT NULL,
  optionb TEXT NOT NULL,
  optionc TEXT NOT NULL,
  optiond TEXT NOT NULL,
  optione TEXT DEFAULT NULL,
  answer TEXT NOT NULL,
  level INTEGER NOT NULL,
  note TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS tbl_question_reports (
  id SERIAL PRIMARY KEY,
  question_id INTEGER NOT NULL,
  user_id INTEGER NOT NULL,
  message varchar(512) NOT NULL,
  date TIMESTAMP WITHOUT TIME ZONE NOT NULL
);

CREATE TABLE IF NOT EXISTS tbl_quiz_categories (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL,
  type INTEGER NOT NULL,
  type_id INTEGER NOT NULL,
  category INTEGER NOT NULL,
  subcategory INTEGER NOT NULL
);

CREATE TABLE IF NOT EXISTS tbl_rooms (
  id SERIAL PRIMARY KEY,
  room_id TEXT NOT NULL,
  entry_coin INTEGER NOT NULL DEFAULT 0,
  user_id INTEGER NOT NULL,
  room_type varchar(11) NOT NULL,
  category_id INTEGER NOT NULL,
  no_of_que INTEGER NOT NULL,
  questions TEXT NOT NULL,
  date_created TIMESTAMP WITHOUT TIME ZONE NOT NULL,
  set_user1 INTEGER NOT NULL DEFAULT 0,
  set_user2 INTEGER NOT NULL DEFAULT 0,
  set_user3 INTEGER NOT NULL DEFAULT 0,
  set_user4 INTEGER NOT NULL DEFAULT 0
);

CREATE TABLE IF NOT EXISTS tbl_settings (
  id SERIAL PRIMARY KEY,
  type varchar(512) NOT NULL,
  message TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS tbl_slider (
  id SERIAL PRIMARY KEY,
  language_id INTEGER NOT NULL,
  image varchar(255) NOT NULL,
  title TEXT NOT NULL,
  description TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS tbl_subcategory (
  id SERIAL PRIMARY KEY,
  language_id INTEGER NOT NULL DEFAULT 0,
  maincat_id INTEGER NOT NULL,
  subcategory_name varchar(250) NOT NULL,
  slug varchar(250) DEFAULT NULL,
  image TEXT DEFAULT NULL,
  status SMALLINT NOT NULL DEFAULT 1,
  is_premium SMALLINT NOT NULL DEFAULT 0,
  coins INTEGER NOT NULL DEFAULT 0,
  has_level SMALLINT NOT NULL DEFAULT 1,
  row_order INTEGER NOT NULL
);

CREATE TABLE IF NOT EXISTS tbl_tracker (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL,
  uid TEXT NOT NULL,
  points varchar(255) NOT NULL,
  type TEXT NOT NULL,
  status SMALLINT NOT NULL,
  date date NOT NULL
);

CREATE TABLE IF NOT EXISTS tbl_upload_languages (
  id SERIAL PRIMARY KEY,
  name varchar(512) NOT NULL,
  title varchar(512) NOT NULL,
  app_version varchar(100) NOT NULL DEFAULT '0',
  web_version varchar(100) NOT NULL DEFAULT '0',
  app_rtl_support SMALLINT NOT NULL DEFAULT 0,
  web_rtl_support SMALLINT NOT NULL DEFAULT 0,
  app_status SMALLINT NOT NULL DEFAULT 0,
  web_status SMALLINT NOT NULL DEFAULT 0,
  app_default SMALLINT NOT NULL DEFAULT 0,
  web_default SMALLINT NOT NULL DEFAULT 0
);

CREATE TABLE IF NOT EXISTS tbl_users (
  id SERIAL PRIMARY KEY,
  firebase_id TEXT NOT NULL,
  name varchar(128) NOT NULL DEFAULT '',
  email varchar(128) NOT NULL,
  mobile varchar(32) NOT NULL,
  type varchar(16) NOT NULL,
  profile varchar(128) NOT NULL,
  fcm_id varchar(1024) DEFAULT NULL,
  web_fcm_id varchar(1024) DEFAULT NULL,
  coins INTEGER NOT NULL DEFAULT 0,
  refer_code varchar(128) DEFAULT NULL,
  friends_code varchar(128) DEFAULT NULL,
  remove_ads SMALLINT NOT NULL DEFAULT 0,
  daily_ads_counter INTEGER NOT NULL DEFAULT 0,
  daily_ads_date date NOT NULL DEFAULT CURRENT_DATE,
  status INTEGER DEFAULT 0,
  date_registered TIMESTAMP WITHOUT TIME ZONE NOT NULL DEFAULT NOW(),
  api_token TEXT NOT NULL DEFAULT '',
  app_language varchar(512) DEFAULT NULL,
  web_language varchar(512) DEFAULT NULL,
  password_hash TEXT,
  password_salt TEXT,
  last_login TIMESTAMP WITHOUT TIME ZONE
);

CREATE TABLE IF NOT EXISTS tbl_users_badges (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL,
  dashing_debut INTEGER NOT NULL,
  dashing_debut_counter INTEGER NOT NULL,
  combat_winner INTEGER NOT NULL,
  combat_winner_counter INTEGER NOT NULL,
  clash_winner INTEGER NOT NULL,
  clash_winner_counter INTEGER NOT NULL,
  most_wanted_winner INTEGER NOT NULL,
  most_wanted_winner_counter INTEGER NOT NULL,
  ultimate_player INTEGER NOT NULL,
  quiz_warrior INTEGER NOT NULL,
  quiz_warrior_counter INTEGER NOT NULL,
  super_sonic INTEGER NOT NULL,
  flashback INTEGER NOT NULL,
  brainiac INTEGER NOT NULL,
  big_thing INTEGER NOT NULL,
  elite INTEGER NOT NULL,
  thirsty INTEGER NOT NULL,
  thirsty_date date DEFAULT NULL,
  thirsty_counter INTEGER NOT NULL,
  power_elite INTEGER NOT NULL,
  power_elite_counter INTEGER NOT NULL,
  sharing_caring INTEGER NOT NULL,
  streak INTEGER NOT NULL,
  streak_date date DEFAULT NULL,
  streak_counter INTEGER NOT NULL
);

CREATE TABLE IF NOT EXISTS tbl_users_in_app (
  id SERIAL PRIMARY KEY,
  pay_from SMALLINT NOT NULL,
  uid TEXT NOT NULL,
  user_id INTEGER NOT NULL,
  product_id TEXT NOT NULL,
  amount INTEGER NOT NULL,
  status varchar(50) NOT NULL,
  transaction_id TEXT NOT NULL,
  date TIMESTAMP WITHOUT TIME ZONE NOT NULL,
  purchase_token TEXT NOT NULL,
  responseData TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS tbl_users_statistics (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL,
  questions_answered INTEGER NOT NULL,
  correct_answers INTEGER NOT NULL,
  strong_category INTEGER NOT NULL,
  ratio1 DOUBLE PRECISION NOT NULL,
  weak_category INTEGER NOT NULL,
  ratio2 DOUBLE PRECISION NOT NULL,
  best_position INTEGER NOT NULL,
  date_created TIMESTAMP WITHOUT TIME ZONE NOT NULL
);

CREATE TABLE IF NOT EXISTS tbl_user_audio_quiz_session (
  id BIGSERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL,
  questions TEXT NOT NULL,
  date date DEFAULT NULL
);

CREATE TABLE IF NOT EXISTS tbl_user_category (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL,
  category_id INTEGER NOT NULL
);

CREATE TABLE IF NOT EXISTS tbl_user_contest_session (
  id BIGSERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL,
  questions TEXT NOT NULL,
  date date DEFAULT NULL
);

CREATE TABLE IF NOT EXISTS tbl_user_daily_quiz_session (
  id BIGSERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL,
  questions TEXT NOT NULL,
  date date DEFAULT NULL
);

CREATE TABLE IF NOT EXISTS tbl_user_fun_n_learn_session (
  id BIGSERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL,
  questions TEXT NOT NULL,
  date date DEFAULT NULL
);

CREATE TABLE IF NOT EXISTS tbl_user_guess_the_word_session (
  id BIGSERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL,
  questions TEXT NOT NULL,
  date date DEFAULT NULL
);

CREATE TABLE IF NOT EXISTS tbl_user_maths_quiz_session (
  id BIGSERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL,
  questions TEXT NOT NULL,
  date date DEFAULT NULL
);

CREATE TABLE IF NOT EXISTS tbl_user_multi_match_session (
  id BIGSERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL,
  questions TEXT NOT NULL,
  date date DEFAULT NULL
);

CREATE TABLE IF NOT EXISTS tbl_user_quiz_zone_session (
  id BIGSERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL,
  questions TEXT NOT NULL,
  date date DEFAULT NULL
);

CREATE TABLE IF NOT EXISTS tbl_user_true_false_session (
  id BIGSERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL,
  questions TEXT NOT NULL,
  date date DEFAULT NULL
);

CREATE TABLE IF NOT EXISTS tbl_web_settings (
  id SERIAL PRIMARY KEY,
  language_id INTEGER DEFAULT 14,
  type varchar(32) NOT NULL,
  message TEXT DEFAULT NULL
);

-- Indexes

CREATE INDEX IF NOT EXISTS idx_tbl_audio_question_category ON tbl_audio_question(category);
CREATE INDEX IF NOT EXISTS idx_tbl_audio_question_subcategory ON tbl_audio_question(subcategory);
CREATE INDEX IF NOT EXISTS idx_tbl_audio_question_language_id ON tbl_audio_question(language_id);
CREATE UNIQUE INDEX IF NOT EXISTS ux_tbl_authenticate_auth_username ON tbl_authenticate(auth_username);
CREATE UNIQUE INDEX IF NOT EXISTS ux_tbl_battle_questions_match_id ON tbl_battle_questions(match_id);
CREATE INDEX IF NOT EXISTS idx_tbl_battle_statistics_user_id1 ON tbl_battle_statistics(user_id1);
CREATE INDEX IF NOT EXISTS idx_tbl_battle_statistics_user_id2 ON tbl_battle_statistics(user_id2);
CREATE INDEX IF NOT EXISTS idx_tbl_bookmark_user_id ON tbl_bookmark(user_id);
CREATE INDEX IF NOT EXISTS idx_tbl_bookmark_question_id ON tbl_bookmark(question_id);
CREATE INDEX IF NOT EXISTS idx_tbl_category_language_id ON tbl_category(language_id);
CREATE INDEX IF NOT EXISTS idx_tbl_category_has_level ON tbl_category(has_level);
CREATE UNIQUE INDEX IF NOT EXISTS ux_tbl_coin_store_product_id ON tbl_coin_store(product_id);
CREATE INDEX IF NOT EXISTS idx_tbl_contest_language_id ON tbl_contest(language_id);
CREATE INDEX IF NOT EXISTS idx_tbl_contest_leaderboard_score ON tbl_contest_leaderboard(score);
CREATE INDEX IF NOT EXISTS idx_tbl_contest_leaderboard_user_id ON tbl_contest_leaderboard(user_id);
CREATE INDEX IF NOT EXISTS idx_tbl_contest_leaderboard_contest_id ON tbl_contest_leaderboard(contest_id);
CREATE INDEX IF NOT EXISTS idx_tbl_contest_prize_contest_id ON tbl_contest_prize(contest_id);
CREATE INDEX IF NOT EXISTS idx_tbl_contest_question_contest_id ON tbl_contest_question(contest_id);
CREATE INDEX IF NOT EXISTS idx_tbl_daily_quiz_language_id ON tbl_daily_quiz(language_id);
CREATE INDEX IF NOT EXISTS idx_tbl_exam_module_language_id ON tbl_exam_module(language_id);
CREATE INDEX IF NOT EXISTS idx_tbl_exam_module_question_category ON tbl_exam_module_question(exam_module_id);
CREATE INDEX IF NOT EXISTS idx_tbl_exam_module_result_exam_module_id ON tbl_exam_module_result(exam_module_id);
CREATE INDEX IF NOT EXISTS idx_tbl_exam_module_result_user_id ON tbl_exam_module_result(user_id);
CREATE INDEX IF NOT EXISTS idx_tbl_fun_n_learn_category ON tbl_fun_n_learn(category);
CREATE INDEX IF NOT EXISTS idx_tbl_fun_n_learn_subcategory ON tbl_fun_n_learn(subcategory);
CREATE INDEX IF NOT EXISTS idx_tbl_fun_n_learn_question_contest_id ON tbl_fun_n_learn_question(fun_n_learn_id);
CREATE INDEX IF NOT EXISTS idx_tbl_guess_the_word_category ON tbl_guess_the_word(category);
CREATE INDEX IF NOT EXISTS idx_tbl_guess_the_word_subcategory ON tbl_guess_the_word(subcategory);
CREATE INDEX IF NOT EXISTS idx_tbl_leaderboard_daily_user_id ON tbl_leaderboard_daily(user_id, date_created);
CREATE INDEX IF NOT EXISTS idx_tbl_leaderboard_monthly_user_id ON tbl_leaderboard_monthly(user_id, date_created);
CREATE INDEX IF NOT EXISTS idx_tbl_level_user_id ON tbl_level(user_id);
CREATE INDEX IF NOT EXISTS idx_tbl_level_category ON tbl_level(category);
CREATE INDEX IF NOT EXISTS idx_tbl_level_subcategory ON tbl_level(subcategory);
CREATE INDEX IF NOT EXISTS idx_tbl_maths_question_category ON tbl_maths_question(category);
CREATE INDEX IF NOT EXISTS idx_tbl_maths_question_subcategory ON tbl_maths_question(subcategory);
CREATE INDEX IF NOT EXISTS idx_tbl_maths_question_language_id ON tbl_maths_question(language_id);
CREATE INDEX IF NOT EXISTS idx_tbl_multi_match_category ON tbl_multi_match(category);
CREATE INDEX IF NOT EXISTS idx_tbl_multi_match_subcategory ON tbl_multi_match(subcategory);
CREATE INDEX IF NOT EXISTS idx_tbl_multi_match_language_id ON tbl_multi_match(language_id);
CREATE INDEX IF NOT EXISTS idx_tbl_multi_match_level_user_id ON tbl_multi_match_level(user_id);
CREATE INDEX IF NOT EXISTS idx_tbl_multi_match_level_category ON tbl_multi_match_level(category);
CREATE INDEX IF NOT EXISTS idx_tbl_multi_match_level_subcategory ON tbl_multi_match_level(subcategory);
CREATE INDEX IF NOT EXISTS idx_tbl_multi_match_question_reports_question_id ON tbl_multi_match_question_reports(question_id);
CREATE INDEX IF NOT EXISTS idx_tbl_multi_match_question_reports_user_id ON tbl_multi_match_question_reports(user_id);
CREATE INDEX IF NOT EXISTS idx_tbl_payment_request_user_id ON tbl_payment_request(user_id);
CREATE INDEX IF NOT EXISTS idx_tbl_question_category ON tbl_question(category);
CREATE INDEX IF NOT EXISTS idx_tbl_question_subcategory ON tbl_question(subcategory);
CREATE INDEX IF NOT EXISTS idx_tbl_question_language_id ON tbl_question(language_id);
CREATE INDEX IF NOT EXISTS idx_tbl_question_reports_question_id ON tbl_question_reports(question_id);
CREATE INDEX IF NOT EXISTS idx_tbl_question_reports_user_id ON tbl_question_reports(user_id);
CREATE INDEX IF NOT EXISTS idx_tbl_quiz_categories_user_id ON tbl_quiz_categories(user_id);
CREATE INDEX IF NOT EXISTS idx_tbl_quiz_categories_type ON tbl_quiz_categories(type);
CREATE INDEX IF NOT EXISTS idx_tbl_rooms_user_id ON tbl_rooms(user_id);
CREATE INDEX IF NOT EXISTS idx_tbl_rooms_category_id ON tbl_rooms(category_id);
CREATE INDEX IF NOT EXISTS idx_tbl_slider_language_id ON tbl_slider(language_id);
CREATE INDEX IF NOT EXISTS idx_tbl_subcategory_language_id ON tbl_subcategory(language_id);
CREATE INDEX IF NOT EXISTS idx_tbl_subcategory_maincat_id ON tbl_subcategory(maincat_id);
CREATE INDEX IF NOT EXISTS idx_tbl_subcategory_has_level ON tbl_subcategory(has_level);
CREATE INDEX IF NOT EXISTS idx_tbl_tracker_user_id ON tbl_tracker(user_id);
CREATE INDEX IF NOT EXISTS idx_tbl_users_email ON tbl_users(email, mobile);
CREATE INDEX IF NOT EXISTS idx_tbl_users_in_app_user_id ON tbl_users_in_app(user_id);
CREATE INDEX IF NOT EXISTS idx_tbl_users_statistics_user_id ON tbl_users_statistics(user_id);
CREATE INDEX IF NOT EXISTS idx_tbl_user_audio_quiz_session_user_id ON tbl_user_audio_quiz_session(user_id);
CREATE UNIQUE INDEX IF NOT EXISTS ux_tbl_user_category_user_id ON tbl_user_category(user_id, category_id);
CREATE INDEX IF NOT EXISTS idx_tbl_user_contest_session_user_id ON tbl_user_contest_session(user_id);
CREATE INDEX IF NOT EXISTS idx_tbl_user_daily_quiz_session_user_id ON tbl_user_daily_quiz_session(user_id);
CREATE INDEX IF NOT EXISTS idx_tbl_user_fun_n_learn_session_user_id ON tbl_user_fun_n_learn_session(user_id);
CREATE INDEX IF NOT EXISTS idx_tbl_user_guess_the_word_session_user_id ON tbl_user_guess_the_word_session(user_id);
CREATE INDEX IF NOT EXISTS idx_tbl_user_maths_quiz_session_user_id ON tbl_user_maths_quiz_session(user_id);
CREATE INDEX IF NOT EXISTS idx_tbl_user_multi_match_session_user_id ON tbl_user_multi_match_session(user_id);
CREATE INDEX IF NOT EXISTS idx_tbl_user_quiz_zone_session_user_id ON tbl_user_quiz_zone_session(user_id);
CREATE INDEX IF NOT EXISTS idx_tbl_user_true_false_session_user_id ON tbl_user_true_false_session(user_id);

-- Seed data

INSERT INTO tbl_authenticate (auth_id, auth_username, auth_pass, role, permissions, status, language, created) VALUES
(1, 'admin', '$2y$10$BMrcIYxcLaikC2E7JvQ7XepMHZv76w/ZfvRNLxzhWJxNtNORjYVi.', 'admin', '', 1, 'english', '2020-11-02 10:23:24');

INSERT INTO tbl_badges (id, language_id, type, badge_label, badge_note, badge_reward, badge_icon, badge_counter) VALUES
(1, 14, 'dashing_debut', 'Dashing Debut', 'Play first quiz zone game', 2, '1636692664.png', 1),
(2, 14, 'combat_winner', 'Combat Winner', 'Won random battle. If both users have completed the battle then the badge will unlock.', 5, '16366926641.png', 1),
(3, 14, 'clash_winner', 'Clash Winner', 'Won group battle. If a minimum of one opponent user has completed the battle then the badge will unlock.', 2, '16366926642.png', 1),
(4, 14, 'most_wanted_winner', 'Most Wanted Winner', 'Won contest', 10, '16366926643.png', 1),
(5, 14, 'ultimate_player', 'Ultimate Player', 'Highest point Gainer', 1, '16366926644.png', 0),
(6, 14, 'quiz_warrior', 'Quiz Warrior', 'Won back-to-back three random battles. If both users have completed the battle then the badge will unlock.', 1, '16366926645.png', 3),
(7, 14, 'super_sonic', 'Super Sonic', 'Fastest puzzle solver. Need minimum 5 questions to unlock this badge.', 1, '16366926646.png', 25),
(8, 14, 'flashback', 'Flashback', 'Average time to solve fun & learn quiz questions. Need minimum 5 questions to unlock this badge.', 1, '16366926647.png', 8),
(9, 14, 'brainiac', 'Brainiac', 'Completed 100% quiz without using a lifeline. Need minimum 5 questions to unlock this badge.', 1, '16366926648.png', 0),
(10, 14, 'big_thing', 'Big Thing', '5k correct answer', 1, '16366926649.png', 5000),
(11, 14, 'elite', 'Elite', 'Earn coins more than 5k ', 1, '163669266410.png', 200),
(12, 14, 'thirsty', 'Thirty', 'Play daily quiz continuously 30 days', 1, '163669266411.png', 30),
(13, 14, 'power_elite', 'Power Elite', 'Achieved more than 10 badges', 1, '163669266412.png', 10),
(14, 14, 'sharing_caring', 'Sharing is Caring', 'Share application to more than 50 users', 1, '163669266413.png', 50),
(15, 14, 'streak', 'Streak', 'Maintain streak for 30 days', 1, '163669266414.png', 30);

INSERT INTO tbl_languages (id, language, code, status, type, default_active) VALUES
(1, 'Amharic', 'am', 0, 0, 0),
(2, 'Arabic', 'ar', 0, 0, 0),
(3, 'Basque', 'eu', 0, 0, 0),
(4, 'Bengali', 'bn', 0, 0, 0),
(5, 'English (UK)', 'en-GB', 0, 0, 0),
(6, 'Portuguese (Brazil)', 'pt-BR', 0, 0, 0),
(7, 'Bulgarian', 'bg', 0, 0, 0),
(8, 'Catalan', 'ca', 0, 0, 0),
(9, 'Cherokee', 'chr', 0, 0, 0),
(10, 'Croatian', 'hr', 0, 0, 0),
(11, 'Czech', 'cs', 0, 0, 0),
(12, 'Danish', 'da', 0, 0, 0),
(13, 'Dutch', 'nl', 0, 0, 0),
(14, 'English (US)', 'en', 1, 1, 1),
(15, 'Estonian', 'et', 0, 0, 0),
(16, 'Filipino', 'fil', 0, 0, 0),
(17, 'Finnish', 'fi', 0, 0, 0),
(18, 'French', 'fr', 0, 0, 0),
(19, 'Greek', 'el', 0, 0, 0),
(20, 'Gujarati', 'gu', 0, 0, 0),
(21, 'Hebrew', 'iw', 0, 0, 0),
(22, 'Hindi', 'hi', 0, 0, 0),
(23, 'Hungarian', 'hu', 0, 0, 0),
(24, 'Icelandic', 'is', 0, 0, 0),
(25, 'Indonesian', 'id', 0, 0, 0),
(26, 'German', 'de', 0, 0, 0),
(27, 'Italian', 'it', 0, 0, 0),
(28, 'Japanese', 'ja', 0, 0, 0),
(29, 'Kannada', 'kn', 0, 0, 0),
(30, 'Korean', 'ko', 0, 0, 0),
(31, 'Latvian', 'lv', 0, 0, 0),
(32, 'Lithuanian', 'lt', 0, 0, 0),
(33, 'Malay', 'ms', 0, 0, 0),
(34, 'Malayalam', 'ml', 0, 0, 0),
(35, 'Marathi', 'mr', 0, 0, 0),
(36, 'Norwegian', 'no', 0, 0, 0),
(37, 'Polish', 'pl', 0, 0, 0),
(38, 'Portuguese (Portugal)', 'pt-PT', 0, 0, 0),
(39, 'Romanian', 'ro', 0, 0, 0),
(40, 'Russian', 'ru', 0, 0, 0),
(41, 'Serbian', 'sr', 0, 0, 0),
(42, 'Chinese (PRC)', 'zh-CN', 0, 0, 0),
(43, 'Slovak', 'sk', 0, 0, 0),
(44, 'Slovenian', 'sl', 0, 0, 0),
(45, 'Spanish', 'es', 0, 0, 0),
(46, 'Swahili', 'sw', 0, 0, 0),
(47, 'Swedish', 'sv', 0, 0, 0),
(48, 'Tamil', 'ta', 0, 0, 0),
(49, 'Telugu', 'te', 0, 0, 0),
(50, 'Thai', 'th', 0, 0, 0),
(51, 'Chinese (Taiwan)', 'zh-TW', 0, 0, 0),
(52, 'Turkish', 'tr', 0, 0, 0),
(53, 'Urdu', 'ur', 0, 0, 0),
(54, 'Ukrainian', 'uk', 0, 0, 0),
(55, 'Vietnamese', 'vi', 0, 0, 0),
(56, 'Welsh', 'cy', 0, 0, 0);

INSERT INTO tbl_month_week (id, name, type) VALUES
(1, 'January', 1),
(2, 'February', 1),
(3, 'March', 1),
(4, 'April', 1),
(5, 'May', 1),
(6, 'June', 1),
(7, 'July', 1),
(8, 'August', 1),
(9, 'September', 1),
(10, 'October', 1),
(11, 'November', 1),
(12, 'December', 1),
(13, 'Sunday', 2),
(14, 'Monday', 2),
(15, 'Tuesday', 2),
(16, 'Wednesday', 2),
(17, 'Thursday', 2),
(18, 'Friday', 2),
(19, 'Saturday', 2);

INSERT INTO tbl_settings (id, type, message) VALUES
(1, 'about_us', '<p>Welcome to <strong>Elite Quiz</strong></p>\r\n<p>Best Android app for elite quiz is here. We guarantee you the best quizing experience for your dedicated users.</p>\r\n<p>&nbsp;</p>\r\n<p>Made with &lt;3 by <a href="https://wrteam.in"><strong>WRTeam</strong></a></p>'),
(2, 'contact_us', '<p><strong>Lorem Ipsum</strong>&nbsp;is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry''s standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.</p>\r\n<p><strong>Lorem Ipsum</strong>&nbsp;is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry''s standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.</p>\r\n<p><strong>Lorem Ipsum</strong>&nbsp;is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry''s standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.</p>\r\n<p><strong>Lorem Ipsum</strong>&nbsp;is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry''s standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.</p>'),
(3, 'instructions', '<p><strong>Instructions</strong></p>\r\n<p>Elite Quiz game has 4 or 5 options</p>\r\n<p>For each right answer 5 points will be given.</p>\r\n<p>Minus 2 points for each question.</p>\r\n<p>&nbsp;</p>\r\n<p><strong>Use of Lifeline</strong> : You can use only once per level</p>\r\n<p><strong>50 - 50</strong> : For remove two option out of four (deduct 4 coins).</p>\r\n<p><strong>Skip question</strong> : You can pass question without minus points(deduct 4 coins).</p>\r\n<p><strong>Audience poll</strong> : Use audience poll to&nbsp;check other users choose option(deduct 4&nbsp;coins).</p>\r\n<p><strong>Reset timer</strong> : Reset timer again if you needed more time score (deduct 4 coins).</p>\r\n<p>&nbsp;</p>\r\n<p><strong>Leaderboard</strong></p>\r\n<p>You can compare your score with other&nbsp;users of app.</p>\r\n<p>&nbsp;</p>\r\n<p><strong>Contest Rules</strong></p>\r\n<p>To provide fair and equal chance of winning to all Elite Quiz readers, the following are the official rules for all contests on Elite Quiz.</p>\r\n<p><strong>ELIGIBILITY: </strong>All player/users can play contest.</p>\r\n<p><strong>HOW TO ENTER: </strong>User can Play Contest&nbsp;by spending number of coins specified as an entry fees in contest details.</p>\r\n<p><strong>CHOICE OF LAW:&nbsp;</strong>All the Contest and Operations are belongs to WRTeam. and Apple is not involved in any way with the contest.&nbsp;</p>\r\n<p>&nbsp;</p>'),
(4, 'privacy_policy', '<p><strong>Lorem Ipsum</strong>&nbsp;is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry''s standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.</p>\r\n<p><strong>Lorem Ipsum</strong>&nbsp;is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry''s standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.</p>\r\n<p><strong>Lorem Ipsum</strong>&nbsp;is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry''s standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.</p>\r\n<p><strong>Lorem Ipsum</strong>&nbsp;is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry''s standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.</p>'),
(5, 'terms_conditions', '<p><strong>Lorem Ipsum</strong>&nbsp;is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry''s standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.</p>\r\n<p><strong>Lorem Ipsum</strong>&nbsp;is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry''s standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.</p>\r\n<p>&nbsp;</p>\r\n<p><strong>Lorem Ipsum</strong>&nbsp;is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry''s standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.</p>\r\n<p><strong>Lorem Ipsum</strong>&nbsp;is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry''s standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.</p>'),
(6, 'answer_mode', '1'),
(7, 'false_value', 'False'),
(8, 'true_value', 'True'),
(9, 'app_version', '1.0.0+1'),
(10, 'reward_coin', '4'),
(11, 'earn_coin', '100'),
(12, 'refer_coin', '50'),
(13, 'ios_more_apps', ''),
(14, 'ios_app_link', 'https://testflight.apple.com'),
(15, 'more_apps', ''),
(16, 'app_link', 'https://play.google.com/'),
(17, 'system_timezone_gmt', '+05:30'),
(18, 'system_timezone', 'Asia/Kolkata'),
(19, 'language_mode', '1'),
(20, 'option_e_mode', '0'),
(21, 'quiz_zone_total_level_question', '10'),
(22, 'quiz_zone_fix_level_question', '1'),
(23, 'shareapp_text', 'Hello, This is a ''simple'' share "text". User will be happy to read '),
(24, 'contest_mode', '1'),
(25, 'daily_quiz_mode', '1'),
(26, 'force_update', '0'),
(27, 'fcm_server_key', ''),
(28, 'battle_mode_random_category', '1'),
(29, 'battle_group_category_mode', '1'),
(30, 'app_name', 'Elite Quiz'),
(31, 'full_logo', '1705488796.svg'),
(32, 'half_logo', '17054887961.svg'),
(33, 'jwt_key', 'set_your_strong_jwt_secret_key'),
(34, 'system_version', '2.3.9'),
(35, 'system_key', '$2y$10$HzGScX/jWRc0MgE5SIN9Lu7MCpf2D1AV8W1rWbrOkgNRq36n3wjDC'),
(36, 'configuration_key', '$2y$10$Ftv8MRLm5IfAkprJrcnSkelJMoY8uIUcB3RapZW0GopU0SrkkyFR.'),
(38, 'fun_n_learn_question', '1'),
(39, 'guess_the_word_question', '1'),
(40, 'audio_mode_question', '1'),
(41, 'total_audio_time', '10'),
(42, 'app_version_ios', '1.0.0+1'),
(43, 'in_app_ads_mode', '0'),
(44, 'ads_type', '1'),
(45, 'android_banner_id', 'Android Banner Id'),
(46, 'android_interstitial_id', 'Android Interstitial Id'),
(47, 'android_rewarded_id', 'Android Rewarded Id'),
(48, 'ios_banner_id', 'IOS Banner Id'),
(49, 'ios_interstitial_id', 'IOS Interstitial Id'),
(50, 'ios_rewarded_id', 'IOS Rewarded Id'),
(56, 'ios_fb_banner_id', 'YOUR_PLACEMENT_ID'),
(55, 'android_fb_rewarded_id', 'YOUR_PLACEMENT_ID'),
(54, 'android_fb_interstitial_id', 'YOUR_PLACEMENT_ID'),
(53, 'android_fb_banner_id', 'YOUR_PLACEMENT_ID'),
(57, 'ios_fb_interstitial_id', 'YOUR_PLACEMENT_ID'),
(58, 'ios_fb_rewarded_id', 'YOUR_PLACEMENT_ID'),
(59, 'exam_module', '1'),
(60, 'payment_mode', '1'),
(61, 'payment_message', ''),
(62, 'per_coin', '10'),
(63, 'coin_amount', '1'),
(64, 'coin_limit', '100'),
(65, 'self_challenge_mode', '1'),
(66, 'in_app_purchase_mode', '0'),
(67, 'difference_hours', '48'),
(68, 'app_maintenance', '0'),
(69, 'maths_quiz_mode', '1'),
(71, 'android_game_id', 'Android Game Id'),
(72, 'ios_game_id', 'IOS Game Id'),
(73, 'maximum_winning_coins', '4'),
(74, 'minimum_coins_winning_percentage', '70'),
(75, 'score', '4'),
(76, 'quiz_zone_duration', '30'),
(77, 'self_challenge_max_minutes', '30'),
(78, 'guess_the_word_seconds', '60'),
(79, 'maths_quiz_seconds', '30'),
(80, 'fun_and_learn_time_in_seconds', '60'),
(81, 'battle_mode_one', '1'),
(82, 'battle_mode_group', '1'),
(83, 'true_false_mode', '1'),
(84, 'audio_quiz_seconds', '30'),
(85, 'battle_mode_random_in_seconds', '30'),
(86, 'welcome_bonus_coin', '10'),
(87, 'quiz_zone_lifeline_deduct_coin', '10'),
(88, 'battle_mode_random_entry_coin', '5'),
(89, 'guess_the_word_max_winning_coin', '10'),
(90, 'review_answers_deduct_coin', '10'),
(91, 'currency_symbol', '$'),
(92, 'daily_ads_visibility', '0'),
(93, 'daily_ads_coins', '5'),
(94, 'daily_ads_counter', '1'),
(95, 'quiz_zone_mode', '1'),
(96, 'quiz_winning_percentage', '30'),
(97, 'quiz_zone_wrong_answer_deduct_score', '4'),
(98, 'quiz_zone_correct_answer_credit_score', '4'),
(99, 'guess_the_word_fix_question', '0'),
(100, 'guess_the_word_total_question', '10'),
(101, 'guess_the_word_max_hints', '2'),
(102, 'guess_the_word_wrong_answer_deduct_score', '4'),
(103, 'guess_the_word_correct_answer_credit_score', '4'),
(104, 'audio_quiz_fix_question', '1'),
(105, 'audio_quiz_total_question', '10'),
(106, 'audio_quiz_wrong_answer_deduct_score', '4'),
(107, 'audio_quiz_correct_answer_credit_score', '4'),
(108, 'maths_quiz_fix_question', '1'),
(109, 'maths_quiz_total_question', '10'),
(110, 'maths_quiz_wrong_answer_deduct_score', '4'),
(111, 'maths_quiz_correct_answer_credit_score', '4'),
(112, 'fun_n_learn_quiz_fix_question', '1'),
(113, 'fun_n_learn_total_question', '10'),
(114, 'fun_n_learn_quiz_wrong_answer_deduct_score', '4'),
(115, 'fun_n_learn_quiz_correct_answer_credit_score', '4'),
(116, 'true_false_quiz_fix_question', '1'),
(117, 'true_false_total_question', '10'),
(118, 'true_false_quiz_in_seconds', '30'),
(119, 'true_false_quiz_wrong_answer_deduct_score', '4'),
(120, 'fun_n_learn_correct_answer_credit_score', '4'),
(121, 'battle_mode_one_category', '1'),
(122, 'battle_mode_one_fix_question', '1'),
(123, 'battle_mode_one_total_question', '10'),
(124, 'battle_mode_one_in_seconds', '30'),
(125, 'battle_mode_one_wrong_answer_deduct_score', '4'),
(126, 'battle_mode_one_correct_answer_credit_score', '4'),
(127, 'battle_mode_one_quickest_correct_answer_extra_score', '2'),
(128, 'battle_mode_one_second_quickest_correct_answer_extra_score', '1'),
(129, 'battle_mode_one_code_char', '1'),
(130, 'battle_mode_one_entry_coin', '5'),
(131, 'battle_mode_group_category', '1'),
(132, 'battle_mode_group_fix_question', '1'),
(133, 'battle_mode_group_total_question', '10'),
(134, 'battle_mode_group_in_seconds', '30'),
(135, 'battle_mode_group_wrong_answer_deduct_score', '10'),
(136, 'battle_mode_group_correct_answer_credit_score', '10'),
(137, 'battle_mode_group_quickest_correct_answer_extra_score', '10'),
(138, 'battle_mode_group_second_quickest_correct_answer_extra_score', '10'),
(139, 'battle_mode_group_code_char', '1'),
(140, 'battle_mode_group_entry_coin', '5'),
(141, 'battle_mode_random_fix_question', '1'),
(142, 'battle_mode_random_total_question', '10'),
(144, 'battle_mode_random_correct_answer_credit_score', '4'),
(145, 'battle_mode_random_quickest_correct_answer_extra_score', '2'),
(146, 'battle_mode_random_second_quickest_correct_answer_extra_score', '1'),
(147, 'battle_mode_random_search_duration', '30'),
(148, 'self_challenge_max_questions', '30'),
(149, 'exam_module_resume_exam_timeout', '5'),
(150, 'question_shuffle_mode', '1'),
(151, 'option_shuffle_mode', '1'),
(152, 'battle_mode_random', '1'),
(153, 'true_false_quiz_correct_answer_credit_score', '4'),
(154, 'contest_mode_wrong_deduct_score', '4'),
(155, 'contest_mode_correct_credit_score', '4'),
(156, 'app_package_name', ''),
(157, 'shared_secrets', ''),
(158, 'fun_n_learn_quiz_total_question', '10'),
(159, 'true_false_quiz_total_question', '10'),
(160, 'latex_mode', '0'),
(161, 'exam_latex_mode', '0'),
(162, 'gmail_login', '1'),
(163, 'email_login', '1'),
(164, 'phone_login', '1'),
(165, 'apple_login', '1'),
(166, 'multi_match_mode', '1'),
(167, 'multi_match_fix_level_question', '1'),
(168, 'multi_match_total_level_question', '10'),
(169, 'multi_match_duration', '30'),
(170, 'multi_match_wrong_answer_deduct_score', '10'),
(171, 'multi_match_correct_answer_credit_score', '20'),
(172, 'guess_the_word_hint_deduct_coin', '1'),
(173, 'footer_copyrights_text', ''),
(174, 'theme_color', '#F05387FF'),
(175, 'app_key_android_iron_source', 'Android Key'),
(176, 'app_key_ios_iron_source', 'IOS Key'),
(177, 'rewarded_id_android_iron_source', 'Android Rewarded Id'),
(178, 'rewarded_id_ios_iron_source', 'IOS Rewarded Id'),
(179, 'interstitial_id_android_iron_source', 'Android Interstitial Id'),
(180, 'interstitial_id_ios_iron_source', 'IOS Interstitial Id'),
(181, 'banner_id_android_iron_source', 'Android Banner Id'),
(182, 'banner_id_ios_iron_source', 'IOS Banner Id'),
(183, 'ai_provider', 'openai'),
(184, 'gemini_model', ''),
(185, 'gemini_api_key', ''),
(186, 'openai_model', ''),
(187, 'openai_api_key', ''),
(188, 'quiz_zone_total_question', '10'),
(189, 'multi_match_total_question', '10');

INSERT INTO tbl_web_settings (id, language_id, type, message) VALUES
(1, 14, 'favicon', 'favicon-1680233344.png'),
(2, 14, 'header_logo', 'header_logo-1679987557.svg'),
(3, 14, 'footer_logo', 'footer_logo-1679987557.svg'),
(4, 14, 'sticky_header_logo', 'sticky_header_logo-1679987557.svg'),
(5, 14, 'quiz_zone_icon', 'quiz_zone_icon-1680083222.svg'),
(6, 14, 'daily_quiz_icon', 'daily_quiz_icon-1680083222.svg'),
(7, 14, 'true_false_icon', 'true_false_icon-1680263423.svg'),
(8, 14, 'fun_learn_icon', 'fun_learn_icon-1680083222.svg'),
(9, 14, 'self_challange_icon', 'self_challange_icon-1680083222.svg'),
(10, 14, 'contest_play_icon', 'contest_play_icon-1680083222.svg'),
(11, 14, 'one_one_battle_icon', 'one_one_battle_icon-1680083222.svg'),
(12, 14, 'group_battle_icon', 'group_battle_icon-1680083222.svg'),
(13, 14, 'audio_question_icon', 'audio_question_icon-1680083222.svg'),
(14, 14, 'math_mania_icon', 'math_mania_icon-1680083222.svg'),
(15, 14, 'exam_icon', 'exam_icon-1680083222.svg'),
(16, 14, 'guess_the_word_icon', 'guess_the_word_icon-1680083222.svg'),
(17, 14, 'section1_heading', 'Why Choose Us Our Elite Quiz'),
(18, 14, 'section1_heading', 'Why Choose Us Our Elite Quiz'),
(19, 14, 'section1_title1', 'Life Lines'),
(20, 14, 'section1_title2', 'Leaderboard'),
(21, 14, 'section1_title3', 'Money Withdrawal'),
(22, 14, 'section1_image1', 'section1_image1.svg'),
(23, 14, 'section1_image2', 'section1_image2.svg'),
(24, 14, 'section1_image3', 'section1_image3.svg'),
(25, 14, 'section1_desc1', 'These lifelines are your secret weapons to help you secure the correct answers during gameplay. Use them wisely to boost your chances of winning!'),
(26, 14, 'section1_desc2', 'Check out our Leaderboard to discover the top scorers in various quizzes. Join the competition and climb the ranks.'),
(27, 14, 'section1_desc3', 'Unlock Money Withdrawal and transform quiz victories into tangible cash rewards. Earn while you quiz!'),
(28, 14, 'section2_heading', 'Incredible Quiz Features'),
(29, 14, 'section2_title1', 'Quizzes by category'),
(30, 14, 'section2_title2', 'Quizzes by Language'),
(31, 14, 'section2_title3', 'Battle Quiz'),
(32, 14, 'section2_title4', 'Guess the Word'),
(33, 14, 'section2_image1', 'section2_image1.svg'),
(34, 14, 'section2_image2', 'section2_image2.svg'),
(35, 14, 'section2_image3', 'section2_image3.svg'),
(36, 14, 'section2_image4', 'section2_image4.svg'),
(37, 14, 'section2_desc1', 'Dive into category-based quizzes for an engaging and informative challenge.'),
(38, 14, 'section2_desc2', 'Explore quizzes tailored to your language preference for a personalized quiz experience.'),
(39, 14, 'section2_desc3', 'Engage in epic quiz battles and prove your knowledge supremacy.'),
(40, 14, 'section2_desc4', 'Put your vocabulary to the test with our challenging Guess the Word Quiz.'),
(41, 14, 'section3_heading', 'Elite QuizBest Part'),
(42, 14, 'section3_title1', 'Regular Udpates'),
(43, 14, 'section3_title2', 'Competitive Fun'),
(44, 14, 'section3_title3', 'Global Community'),
(45, 14, 'section3_title4', 'All-age Inclusivity'),
(46, 14, 'section3_image1', 'section3_image1.svg'),
(47, 14, 'section3_image2', 'section3_image2.svg'),
(48, 14, 'section3_image3', 'section3_image3.svg'),
(49, 14, 'section3_image4', 'section3_image4.svg'),
(50, 14, 'section3_desc1', 'Regularly Updated Quizzes for a Fresh and Exciting Learning Experience.'),
(51, 14, 'section3_desc2', 'Test Your Knowledge and Challenge Others. Compete, Test, Challenge!'),
(52, 14, 'section3_desc3', 'Join the Elite Quiz Global Community and Expand Your Knowledge Together!'),
(53, 14, 'section3_desc4', 'Elite Quiz for Kids, Teens, & Adults - Fun Learning for Everyone!'),
(54, 14, 'section_1_mode', '1'),
(55, 14, 'section_2_mode', '1'),
(56, 14, 'section_3_mode', '1'),
(57, 14, 'notification_title', 'Congratulations !'),
(58, 14, 'notification_body', 'You have unlocked new badge.'),
(59, 14, 'primary_color', '#EF5388FF'),
(60, 14, 'footer_color', '#090029FF'),
(61, 14, 'firebase_api_key', ''),
(62, 14, 'firebase_auth_domain', ''),
(63, 14, 'firebase_database_url', ''),
(64, 14, 'firebase_project_id', ''),
(65, 14, 'firebase_storage_bucket', ''),
(66, 14, 'firebase_messager_sender_id', ''),
(67, 14, 'firebase_app_id', ''),
(68, 14, 'firebase_measurement_id', ''),
(70, 14, 'company_name_footer', 'elite'),
(71, 14, 'email_footer', 'xyz@gmail.com'),
(72, 14, 'phone_number_footer', '+91 9876543210'),
(73, 14, 'web_link_footer', 'https://xyz.in/'),
(74, 14, 'company_text', 'Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry''s standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.'),
(75, 14, 'address_text', 'Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry''s standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.'),
(76, 14, 'social_media', '[{"link":"https:\\/\\/www.facebook.com\\/","icon":"social_media-1723629667.png"}]'),
(77, 14, 'multi_match_icon', 'multi_match_icon-1746608378.svg');

INSERT INTO tbl_coin_store (id, title, coins, type, product_id, image, description, status) VALUES
(1, '5 Coins', 5, 0, '5_consumable_coin', NULL, 'Small Pack', 1);

INSERT INTO tbl_upload_languages (id, name, title, app_version, web_version, app_rtl_support, web_rtl_support, app_status, web_status, app_default, web_default) VALUES
(1, 'english', 'English', '0.0.1', '0.0.1', 0, 0, 1, 1, 1, 1);

-- Adjust sequences after seed data

SELECT setval('tbl_authenticate_auth_id_seq', 2);
SELECT setval('tbl_badges_id_seq', 16);
SELECT setval('tbl_coin_store_id_seq', 2);
SELECT setval('tbl_languages_id_seq', 57);
SELECT setval('tbl_month_week_id_seq', 20);
SELECT setval('tbl_settings_id_seq', 190);
SELECT setval('tbl_upload_languages_id_seq', 2);
SELECT setval('tbl_web_settings_id_seq', 78);

-- PostgreSQL-specific tables for real-time battle rooms

CREATE TABLE IF NOT EXISTS battle_rooms (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  category_id INTEGER NOT NULL,
  owner_id INTEGER NOT NULL,
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
  user_id INTEGER NOT NULL,
  role TEXT NOT NULL DEFAULT 'player',
  joined_at TIMESTAMP WITHOUT TIME ZONE NOT NULL DEFAULT NOW(),
  ready BOOLEAN NOT NULL DEFAULT FALSE,
  PRIMARY KEY(room_id, user_id)
);

CREATE TABLE IF NOT EXISTS battle_room_messages (
  id BIGSERIAL PRIMARY KEY,
  room_id UUID NOT NULL REFERENCES battle_rooms(id) ON DELETE CASCADE,
  sender_id INTEGER NOT NULL,
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
