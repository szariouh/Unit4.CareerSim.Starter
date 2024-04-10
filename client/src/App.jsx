import { useState, useEffect } from 'react'
import { Routes, Route, Link } from "react-router-dom";

import Products from './components/Products'
import Login from './components/Login';
import Register from './components/Register';
import Cart from './components/Cart';
import Account from './components/Account';
import SingleProduct from './components/SingleProduct';
import Users from './components/Users';



function App() {
  const [auth, setAuth] = useState({});
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState([]);
  const [count, setCount] = useState(0);
  const [refresh, setRefresh] = useState(false);

  useEffect(()=> {
    const token = window.localStorage.getItem('token');
    if(token){
      attemptLoginWithToken();
    }
  }, []);

  useEffect(()=> {
    const fetchProducts = async()=> {
      const response = await fetch('/api/products');
      const json = await response.json();
      if(response.ok){
        setProducts(json);
      }
      else{
        console.error(response.error);         
      }
    };
    fetchProducts();
  }, []);

  useEffect(()=> {
    const fetchCart = async()=> {
      const response = await fetch(`/api/users/${auth.id}/cart`, {
        headers: {
          authorization: window.localStorage.getItem('token')
        }
      });
      const json = await response.json();
      if(response.ok){
        setCart(json);
      }
      else{
        console.error(json.error)
      }
    };       
    
    if(auth.id){
      fetchCart();
    }
    else {
      setCart([]);
    }
  }, [auth, refresh]);


  const addToCart = async(product_id, qty)=> {
    const response = await fetch(`/api/users/${auth.id}/cart`, {
      method: 'POST',
      body: JSON.stringify({ product_id, qty}),
      headers: {
        'Content-Type': 'application/json',
        authorization: window.localStorage.getItem('token')
      }
    });
    const json = await response.json();
    if(response.ok){
      setCart([...cart, json]);
    }
    else {
      console.error(json.error);
    }
  };

 // update cart
 const updateCart = async(product_id, qty)=> {
  const response = await fetch(`/api/users/${auth.id}/cart`, {
    method: 'PUT',
    body: JSON.stringify({ product_id, qty}),
    headers: {
      'Content-Type': 'application/json',
      authorization: window.localStorage.getItem('token')
    }
  });
  const json = await response.json();                                                 
  if(response.ok){
      for(let el of cart){
        if(el.product_id === product_id ){
          el = json;
        }
      }
      setRefresh(prevRefresh => !prevRefresh);
  }
  
};

  const removeFromCart = async(id)=> {
    const response = await fetch(`/api/users/${auth.id}/cart/${id}`, {
      method: 'DELETE',
      headers: {
        authorization: window.localStorage.getItem('token')
      }
    });
    if(response.ok){
      setCart(cart.filter(item => item.product_id !== id));
    }
   
  };

  useEffect(()=> {
    setCount(
        cart.reduce((accumulator ,item) => {
            return accumulator + item.qty;
      }, 0)
      )
  }, [auth, cart]);
  

  const attemptLoginWithToken = async()=> {
    const token = window.localStorage.getItem('token');
    const response = await fetch('/api/auth/me', {
      headers: {
        authorization: token
      }
    });
    const json = await response.json();
    if(response.ok){
      setAuth(json);
    }
    else {
      window.localStorage.removeItem('token');
    }
  };

  const login = async(credentials)=> {
    const response = await fetch('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
      headers: {
        'Content-Type': 'application/json'
      }
    });
    const json = await response.json();
    if(response.ok){
      window.localStorage.setItem('token', json.token);
      attemptLoginWithToken();
    }
    else{
      console.error(json.error)
    }
  };

  const register = async(info)=> {
    const response = await fetch('/api/auth/register', {
      method: 'POST',
      body: JSON.stringify(info),
      headers: {
        'Content-Type': 'application/json'
      }
    });
    const result = await response.json();    
    if(response.ok){
      login({ email: info.email, password: info.password });  
    }
    else{
      console.error(result.error);
    }
  };

  const createProduct = async(newProductData)=> {
    const response = await fetch(`/api/users/${auth.id}/products`, {
      method: 'POST',
      body: JSON.stringify(newProductData),
      headers: {
        'Content-Type': 'application/json',
        authorization: window.localStorage.getItem('token')
      }
    });
    const json = await response.json();
    if(response.ok){
      console.log("New product added")      
    }
    else{
      console.error(json.error)
    }
  }

  const logout = ()=> {
    window.localStorage.removeItem('token');
    setAuth({});
  }


  return (
    <div className="container">
      <h1>E-Commerce Site</h1>

      <div className='nav'>
            <Link to='/'>Home</Link>
            <Link to='/cart'>Cart (<span style={{color: 'red'}}>{count}</span>)</Link>
            <Link to={'/account'}>Account</Link>
            <Link to={'/users'}>Users</Link>
      </div>

     <div className='auth'>
     {auth.id? 
        <div>
          <button onClick={ logout }>Logout {auth.firstname}</button>
        </div>
        : 
        <div>
           <Login login={login}/>
           <div>Or</div>
           <Register register={register}/>    
        </div>
      }

     </div>

      <div className='main'>
      <Routes>
        <Route path="/" element={<Products auth={auth} cart={cart} 
          addToCart={addToCart} removeFromCart={removeFromCart} products={products} />} 
        />
        <Route path="/:id" element={<SingleProduct auth={auth} cart={cart}  
          addToCart={addToCart} removeFromCart={removeFromCart} />} 
        />
        <Route path="/cart" element={<Cart auth={auth} products={products} cart={cart} 
        updateCart={updateCart} setCart={setCart} removeFromCart={removeFromCart} />} 
        />
        <Route path="/account" element={<Account auth={auth} />} 
        />
        <Route path="/users" element={<Users auth={auth} />}
        />          
        
      </Routes>
      </div>

    </div>
  )
}

export default App