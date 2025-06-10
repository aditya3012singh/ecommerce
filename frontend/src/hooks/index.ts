import axios from "axios"
import { useEffect, useState } from "react"
import type { Product } from "../pages/Home"




// export const useProduct=({id}:{id:string})=>{
//     const [loading, setLoading]=useState(true)
//     const [product, setProduct]=useState<Product>()

//     useEffect(()=>{
//         axios.get(`http://localhost:3000/api/v1/product/${id}`,{
//             headers:{
//                 Authorization: localStorage.getItem("token")
//             }   
//             })
//                         .then(response=>{
//                 setProduct(response.data.product)
//                 setLoading(false)
//         })

//     },[id])

//     return{
//         loading,
//         product
//     }
// }

export const useProduct = (id:string) => {
  const [loading, setLoading] = useState(true);
  const [product, setProduct] = useState<Product>();

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await axios.get(`http://localhost:3000/api/v1/product/${id}`, {
          headers: {
            Authorization: localStorage.getItem("token") || "",
          },
        });

        setProduct(response.data.product || []); // or `product`, if that's the actual key
      } catch (error) {
        console.error("Error fetching products:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  return {
    loading,
    product,
  };
};


export const useProducts = () => {
  const [loading, setLoading] = useState(true);
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get("http://localhost:3000/api/v1/probulk", {
          headers: {
            Authorization: localStorage.getItem("token") || "",
          },
        });

        setProducts(response.data.products || []); // or `product`, if that's the actual key
      } catch (error) {
        console.error("Error fetching products:", error);
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  return {
    loading,
    products,
  };
};