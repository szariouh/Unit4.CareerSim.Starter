import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";

export default function Cart({auth, products, cart, setCart, removeFromCart,count, 
    setCount, subtotal, setSubtotal}){

    const navigate = useNavigate(); 

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
        return response
      };

       


    
    return(
        <>
            {auth.id && cart &&
                <div>
                    <ul className="cart-list">
                        {cart.map(item => {
                            const myProduct = products.find(product => product.id === item.product_id);

                            return <li key={item.id} className="cart-item">
                                <div className="cart-item-top">
                                    <h4>{myProduct.title}</h4> 
                                    <div>${item.price}/ea</div>
                                </div>
                                <div>
                                    <p>{myProduct.description}.</p>
                                    <div>{myProduct.dimensions}</div>
                                    <div>{myProduct.inventory > 0 ?
                                        myProduct.inventory <= 5 ?
                                            <div style={{ color: "red" }}>Only {myProduct.inventory} left</div>
                                            : <div>In Stock</div>
                                        : <p>Out of Stock</p>}
                                    </div>
                                    <div className="cart-item-edit">
                                        <div className="edit-qty">
                                            {
                                                item.qty === 1? 
                                                <button onClick={() => { removeFromCart(item.product_id) }} className="delete-btn">Remove
                                                </button>
                                                :
                                                <button onClick={async () => {
                                                    const response = await updateCart(myProduct.id, item.qty - 1)
                                                    const json = await response.json();                                                 
                                                    if(response.ok){
                                                        item.qty = json.qty;
                                                        setCount((n)=>--n)                                                       
                                                    }
                                                }}>-
                                                </button>
                                            }
                                            
                                            {item.qty}

                                            <button onClick={async () => {
                                                const response = await updateCart(myProduct.id, item.qty + 1)
                                                const json = await response.json();
                                                if(response.ok){
                                                    item.qty = json.qty;
                                                    setCount((n)=>++n)
                                                }
                                            }}>+</button>
                                        </div>
                                        <button onClick={() => { removeFromCart(item.product_id) }} className="delete-btn">Delete
                                        </button>
                                    </div>
                                </div>
                            </li>
                        })
                        }
                    </ul>
                    <div>Subtotal ({count} items): ${subtotal}</div>
                    <button className={" proceed-checkout"} onClick={()=>{navigate('/checkout')}}>Proceed to checkout</button>
                </div>
            }
        </>
    )
}