DROP TABLE IF EXISTS market;
CREATE TABLE IF NOT EXISTS market (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  chain_id ENUM('1', '56'),
  total_supply_cents BIGINT NOT NULL,
  total_borrow_cents BIGINT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO market (id, name, chain_id, total_supply_cents, total_borrow_cents) 
VALUES 
  (1, 'Token A', '1', 1000, 400),
  (2, 'Token B', '56', 5000, 1000),
  (3, 'Token Whale', '56', 10000000000000000, 5000000000000000);