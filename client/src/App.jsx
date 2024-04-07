import { useState, useEffect } from 'react'
import { Routes, Route, Link } from "react-router-dom";

import Products from './components/Products'
import SingleProduct from './components/SingleProduct'



function App() {
 
  const [products, setProducts] = useState([]);
  
 

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

  return (
    <>
      <h1>E-Commerce Site</h1>

      <Routes>
        <Route path="/" element={<Products  products={products} />} 
        />
        <Route path="/:id" element={<SingleProduct />} 
        />
        
      </Routes>

    </>
  )
}

export default App