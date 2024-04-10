
import { useNavigate } from "react-router-dom";

export default function Products({ products, auth, addToCart}){
    
    const navigate = useNavigate();
    

    return (
        <ul className='products'>
        {
          products.map( product => {
            
            return (
              <li key={ product.id }>
                <div >
                  <h4>{ product.title }</h4>
                  <div className="product-card">
                    <img src={product.image} alt="product image" style={{width: '165px' , height:'115px'}}/>
                    <div>
                        <button onClick={() => {
                            navigate(`/${product.id}`);
                            }}>Details
                        </button>
                        {
                          auth.id && <button onClick={()=>{addToCart(product.id,1)}}>Add

                          </button>
                        }
                       
                    </div>
                  </div>
                </div>
              </li>
            );
          })
        }
      </ul>        
    )
}