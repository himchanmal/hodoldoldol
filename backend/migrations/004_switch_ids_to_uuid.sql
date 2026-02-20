-- categories.id: BIGSERIAL → 8자리 랜덤
ALTER TABLE categories ADD COLUMN id_new VARCHAR(8) DEFAULT encode(gen_random_bytes(4), 'hex');
ALTER TABLE categories DROP CONSTRAINT categories_pkey;
ALTER TABLE categories DROP COLUMN id;
ALTER TABLE categories RENAME COLUMN id_new TO id;
ALTER TABLE categories ADD PRIMARY KEY (id);

-- expenses.id: BIGSERIAL → 8자리 랜덤
ALTER TABLE expenses ADD COLUMN id_new VARCHAR(8) DEFAULT encode(gen_random_bytes(4), 'hex');
ALTER TABLE expenses DROP CONSTRAINT expenses_pkey;
ALTER TABLE expenses DROP COLUMN id;
ALTER TABLE expenses RENAME COLUMN id_new TO id;
ALTER TABLE expenses ADD PRIMARY KEY (id);
