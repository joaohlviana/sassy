/*
  # Create Stripe Products and Prices

  1. New Tables
    - `stripe_products`
      - `id` (bigint, primary key)
      - `product_id` (text, unique)
      - `name` (text)
      - `description` (text)
      - `active` (boolean)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)
      - `deleted_at` (timestamptz)
    
    - `stripe_prices`
      - `id` (bigint, primary key)
      - `price_id` (text, unique)
      - `product_id` (text, references stripe_products)
      - `currency` (text)
      - `unit_amount` (bigint)
      - `interval` (text)
      - `active` (boolean)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)
      - `deleted_at` (timestamptz)

  2. Security
    - Enable RLS on both tables
    - Add policies for authenticated users to read active products/prices
*/

-- Create products table
CREATE TABLE IF NOT EXISTS stripe_products (
    id bigint primary key generated always as identity,
    product_id text unique not null,
    name text not null,
    description text,
    active boolean default true,
    created_at timestamptz default now(),
    updated_at timestamptz default now(),
    deleted_at timestamptz default null
);

-- Create prices table
CREATE TABLE IF NOT EXISTS stripe_prices (
    id bigint primary key generated always as identity,
    price_id text unique not null,
    product_id text not null references stripe_products(product_id),
    currency text not null,
    unit_amount bigint not null,
    interval text check (interval in ('month', 'year')),
    active boolean default true,
    created_at timestamptz default now(),
    updated_at timestamptz default now(),
    deleted_at timestamptz default null
);

-- Enable RLS
ALTER TABLE stripe_products ENABLE ROW LEVEL SECURITY;
ALTER TABLE stripe_prices ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Anyone can read active products" 
    ON stripe_products
    FOR SELECT
    USING (active = true AND deleted_at IS NULL);

CREATE POLICY "Anyone can read active prices" 
    ON stripe_prices
    FOR SELECT
    USING (active = true AND deleted_at IS NULL);

-- Insert test product
INSERT INTO stripe_products (product_id, name, description)
VALUES ('prod_SLwHR3OqcLxOXm', 'teste', 'Test product');

-- Insert test price
INSERT INTO stripe_prices (price_id, product_id, currency, unit_amount, interval)
VALUES ('price_1RREP8Pvl1mw1yRdPkr1rKjd', 'prod_SLwHR3OqcLxOXm', 'brl', 11100, 'month');