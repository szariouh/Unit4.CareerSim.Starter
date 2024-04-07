import { useState, useEffect } from "react";

import { useParams} from "react-router-dom";

export default function SingleProduct(){

    const { id } = useParams();

    const [product, setProduct] = useState(null);
    const [error, setError] = useState(null);
    
    useEffect(()=> {
        const fetchSingleProduct = async()=> {
          const response = await fetch(`/api/products/${id}`);
          const json = await response.json();
          if(response.ok){
            setProduct(json);
          }
          else{
            console.error(response.error); 
            setError(response.error)         
          }
        };
        fetchSingleProduct();
      }, []);

      return(
        <>{ !error &&
            <div className="product-details"> 
                {product &&
                    <>
                        <h3>{product.title}</h3>
                        <div>
                            <img src={product.image} alt="product image" style={{width: '360px' , height:'225px'}}/>
                            <table>
                                <tbody>
                                    <tr>
                                        <th scope="row">Title</th>
                                        <td>{product.title}</td>
                                    </tr>
                                    <tr>
                                        <th scope="row">Category</th>
                                        <td>{product.category}</td>
                                    </tr>
                                    <tr>
                                        <th scope="row">Price</th>
                                        <td>${product.price}</td>
                                    </tr>
                                    <tr>
                                        <th scope="row">Dimensions</th>
                                        <td>{product.dimensions}</td>
                                    </tr>
                                    <tr>
                                        <th scope="row">Description</th>
                                        <td>{product.description}</td>
                                    </tr>
                                    <tr>
                                        <th scope="row">Inventory</th>
                                        <td>{product.inventory}</td>
                                    </tr>
                                </tbody>
                            </table>
                            
                        </div>
                        
                    </>
                }
            </div>

        }            
        </>
      )
}