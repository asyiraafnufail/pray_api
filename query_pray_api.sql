CREATE TABLE cities (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL
);

CREATE TABLE prayer_times (
    id SERIAL PRIMARY KEY,
    city_id INTEGER REFERENCES cities(id),
    date DATE NOT NULL,
    subuh VARCHAR(10),
    dzuhur VARCHAR(10),
    ashar VARCHAR(10),
    maghrib VARCHAR(10),
    isya VARCHAR(10)
);

CREATE TABLE api_keys (
    id SERIAL PRIMARY KEY,
    key_string VARCHAR(255) UNIQUE NOT NULL,
    request_count INTEGER DEFAULT 0,
    last_request_timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE generation_logs (
    id SERIAL PRIMARY KEY,
    ip_address VARCHAR(50),
    created_at DATE DEFAULT CURRENT_DATE
);

INSERT INTO cities (name) VALUES ('Jakarta'), ('Bandung'), ('Surabaya');

INSERT INTO prayer_times (city_id, date, subuh, dzuhur, ashar, maghrib, isya) 
VALUES 
(1, CURRENT_DATE, '04:30', '11:50', '15:15', '18:00', '19:15'),
(2, CURRENT_DATE, '04:25', '11:45', '15:10', '17:55', '19:10'),
(3, CURRENT_DATE, '04:15', '11:30', '15:00', '17:40', '19:00');

TRUNCATE TABLE prayer_times, cities, api_keys, generation_logs RESTART IDENTITY CASCADE;

INSERT INTO cities (name) VALUES 
('Jakarta'),
('Bandung'),
('Bogor'),
('Depok'),
('Tangerang'),
('Bekasi'),
('Semarang'),
('Yogyakarta'),
('Surakarta'),
('Magelang'),
('Tegal'),
('Surabaya'),
('Malang'),
('Sidoarjo'),
('Kediri'),
('Banyuwangi');

INSERT INTO prayer_times (city_id, date, subuh, dzuhur, ashar, maghrib, isya) VALUES 
(1, CURRENT_DATE, '04:36', '12:03', '15:27', '18:15', '19:28'),
(2, CURRENT_DATE, '04:32', '12:00', '15:23', '18:15', '19:26'),
(3, CURRENT_DATE, '04:36', '12:04', '15:27', '18:19', '19:29'),
(4, CURRENT_DATE, '04:36', '12:03', '15:27', '18:15', '19:28'),
(5, CURRENT_DATE, '04:37', '12:04', '15:28', '18:16', '19:29'),
(6, CURRENT_DATE, '04:35', '12:02', '15:26', '18:14', '19:27'),
(7, CURRENT_DATE, '04:22', '11:49', '15:10', '18:00', '19:13'),
(8, CURRENT_DATE, '04:23', '11:49', '15:11', '18:01', '19:14'),
(9, CURRENT_DATE, '04:21', '11:48', '15:09', '17:59', '19:12'),
(10, CURRENT_DATE, '04:23', '11:50', '15:11', '18:01', '19:14'),
(11, CURRENT_DATE, '04:25', '11:52', '15:14', '18:03', '19:16'),
(12, CURRENT_DATE, '04:13', '11:40', '15:01', '17:51', '19:05'),
(13, CURRENT_DATE, '04:14', '11:41', '15:02', '17:52', '19:06'),
(14, CURRENT_DATE, '04:13', '11:40', '15:01', '17:51', '19:05'),
(15, CURRENT_DATE, '04:16', '11:43', '15:04', '17:54', '19:08'),
(16, CURRENT_DATE, '04:08', '11:35', '14:56', '17:46', '19:00');