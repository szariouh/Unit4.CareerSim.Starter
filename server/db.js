const pg = require('pg');
const client = new pg.Client(process.env.DATABASE_URL || 'postgres://localhost/e_comm_db');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const JWT = process.env.JWT || 'shhh';
const uuid = require('uuid');

const createTables = async()=> {
  const SQL = `
    -- Create tables:
    DROP TABLE IF EXISTS users cascade;
    DROP TABLE IF EXISTS products cascade;
    DROP TABLE IF EXISTS cart cascade;

    CREATE TABLE users(
      id UUID PRIMARY KEY,
      firstname VARCHAR(40) NOT NULL,
      lastname VARCHAR(40) NOT NULL,
      email VARCHAR(155) UNIQUE NOT NULL,
      password VARCHAR(155) NOT NULL,
      phone VARCHAR(25),
      is_admin BOOLEAN DEFAULT false
    );
    CREATE TABLE products(
      id UUID PRIMARY KEY,
      title VARCHAR(35) NOT NULL,
      category VARCHAR(35) NOT NULL,
      price NUMERIC NOT NULL,
      description VARCHAR(255) NOT NULL,
      inventory INTEGER NOT NULL,
      image VARCHAR(500)
    );
    CREATE TABLE cart(
      id UUID PRIMARY KEY,
      user_id UUID REFERENCES users(id) NOT NULL,
      product_id UUID REFERENCES products(id) NOT NULL,
      qty INTEGER,
      CONSTRAINT unique_user_id_and_product_id_un UNIQUE (user_id, product_id) 
    );
   

    -- check constraint function to validate data before insert or update the cart quantity
    CREATE OR REPLACE FUNCTION check_cart_quantity_less_than_inventory()
    RETURNS TRIGGER AS $$
    BEGIN
        IF (SELECT inventory FROM products WHERE id = NEW.product_id) < NEW.qty THEN
            RAISE EXCEPTION 'Oops! It seems you have added more items to your cart than we have in stock.';
        END IF;
        RETURN NEW;
    END;
    $$ LANGUAGE plpgsql;

    -- Create trigger to execute check constraint function
    CREATE TRIGGER check_cart_quantity_trigger
    BEFORE INSERT OR UPDATE ON cart
    FOR EACH ROW
    EXECUTE FUNCTION check_cart_quantity_less_than_inventory();
  `;
  
  await client.query(SQL);
};

const createUser = async({ firstname, lastname, email, phone, password, is_admin})=> {
  const SQL = `
    INSERT INTO users(id, firstname, lastname, email, phone, password, is_admin) VALUES($1, $2, $3, $4, $5, $6, $7) RETURNING *
  `;
  const response = await client.query(SQL, [uuid.v4(), firstname, lastname, email, phone, await bcrypt.hash(password, 5), is_admin]);
  return response.rows[0];
};

const createProduct = async({ title, category, price, description, inventory, image })=> {
  const SQL = `
    INSERT INTO products(id, title, category, price, description, inventory, image) VALUES($1, $2, $3, $4, $5, $6, $7) RETURNING *
  `;
  const response = await client.query(SQL, [uuid.v4(), title, category, price, description, inventory, image]);
  return response.rows[0];
};

// Add new item to cart 
const addToCart = async({ user_id, product_id, qty })=> {
  const SQL = `
    INSERT INTO cart (id, user_id, product_id, qty)
    VALUES ($1, $2, $3, $4)
    RETURNING *;
  `;
  const response = await client.query(SQL, [uuid.v4(), user_id, product_id, qty]);
 
  return response.rows[0];
};

// 
const updateCart = async({ user_id, product_id, qty })=> {
  const SQL = `
    UPDATE cart 
    SET qty = $3
    WHERE user_id = $1 AND product_id = $2
    RETURNING *
  `;
  const response = await client.query(SQL, [user_id, product_id, qty]);
  return response.rows[0];
};

// Remove product from the cart
const deleteCartProduct = async({ user_id, id })=> {
  const SQL = `
    DELETE FROM cart 
    WHERE user_id = $1 AND product_id = $2
    RETURNING *;
    `;
  await client.query(SQL, [user_id, id]);
 
};

const authenticate = async({ email, password })=> {
  const SQL = `
    SELECT id, password
    FROM users
    WHERE email = $1
  `;
  const response = await client.query(SQL, [ email ]);
  if(!response.rows.length || (await bcrypt.compare(password, response.rows[0].password))=== false){
    const error = Error('not authorized');
    error.status = 401;
    throw error;
  }
  const token = await jwt.sign({ id: response.rows[0].id}, JWT);
  return { token }; 
};


const findUserWithToken = async(token) => {
  let id;
  try {
    const payload = await jwt.verify(token, JWT);
    id = payload.id;
  }
  catch(ex){
    const error = Error('not authorized');
    error.status = 401;
    throw error;
  }
  const SQL = `
    SELECT id, firstname, lastname, email, phone, is_admin
    FROM users
    WHERE id = $1
  `;
  const response = await client.query(SQL, [id]);
  if(!response.rows.length){
    const error = Error('not authorized');
    error.status = 401;
    throw error;
  }
  return response.rows[0];
}

// 
const fetchUsers = async()=> {
  const SQL = `
    SELECT * FROM users;
  `;
  const response = await client.query(SQL);
  return response.rows;
};

//
const fetchProducts = async()=> {
  const SQL = `
    SELECT * FROM products;
  `;
  const response = await client.query(SQL);
  return response.rows;
};

//
const fetchCart = async(user_id)=> {
  const SQL = `
    SELECT * FROM cart where user_id = $1 ORDER BY id ASC
  `;
  const response = await client.query(SQL, [user_id]);
  return response.rows;
};

//
const fetchSingleProduct = async(id) =>{
  const SQL = `
    SELECT * FROM products where id = $1
  `;
  const response = await client.query(SQL, [id]);
  return response.rows[0];
};

module.exports = {
  client,
  createTables,
  createUser, 
  createProduct,
  fetchUsers, 
  fetchProducts,
  fetchCart,
  addToCart,
  updateCart,
  deleteCartProduct,
  authenticate,
  findUserWithToken,
  fetchSingleProduct,
};

