import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";

export default function Cart({auth, products, cart, removeFromCart, updateCart, count, 
    setCount}){

    const navigate = useNavigate();   


    
    return(
        <>
                    {auth.id? 
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
                                                    updateCart(myProduct.id, item.qty - 1)
                                                }}>-
                                                </button>
                                            }
                                            
                                            {item.qty}

                                            <button onClick={async () => {
                                                 updateCart(myProduct.id, item.qty + 1)
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
                   
                    <button className={" proceed-checkout"} onClick={()=>{navigate('/checkout')}}>Proceed to checkout</button>
                </div>

                    :  
                    <div>Log in to see your cart.</div>
                    }              
                </>
    )
}