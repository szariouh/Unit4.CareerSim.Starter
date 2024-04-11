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
                                <div>
                                    <h4>{myProduct.title}</h4>
                                    <img src={myProduct.image} alt="product image" style={{width: '175px' , height:'120px'}}/>
                                                
                                </div>
                                <div>
                                    <div>${myProduct.price}/ea</div>
                                    <p>{myProduct.description}.</p>
                                    <div>{myProduct.dimensions}</div>
                                    <div>{myProduct.inventory > 0 ?
                                        myProduct.inventory <= 5 ?
                                            <div style={{ color: "red" }}>Only {myProduct.inventory} left</div>
                                            : <div>In Stock</div>
                                        : <p>Out of Stock</p>}
                                    </div>
                                    <div className="cart-item-control">
                                        <div className="update-qty">
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
                                            
                                           <div className="qty"> {item.qty}</div>

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
                   
                </div>

                    :  
                    <div>Log in to see your cart.</div>
                    }              
                </>
    )
}