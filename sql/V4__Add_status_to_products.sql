CREATE TYPE product_status AS ENUM ('pending', 'out_of_stock', 'available', 'discontinued');
ALTER TABLE products
ADD COLUMN status product_status NOT NULL DEFAULT 'pending';
