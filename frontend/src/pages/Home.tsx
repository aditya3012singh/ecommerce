
import React, { useEffect, useState } from "react";
import ProductCard from "../components/ProductCard";

import AppBar from "../components/AppBar";
import axios from "axios";
import { useProducts } from "../hooks";

export interface Product {
  id: string;
  title: string;
  description: string;
  price: number;
  imageUrl:string,
  stock:number,
  Category:string
}

const Home: React.FC = () => {
  const { loading, products } = useProducts();

  return (
    <div className="min-h-screen bg-gradient-to-b from-black  via-emerald-950 to-black">
      <div className="fixed top-0 left-0 right-0 z-50">
        <AppBar type="Login" />
      </div>
      <div className="pt-16">
        <h1 className="text-3xl text-center text-white mb-8">Explore Our Products</h1>
        {loading ? (
            <p className="text-white text-center">Loading products...</p>
              ) : products.length === 0 ? (
            <p className="text-white text-center">No products found.</p>
                ) : (
            <div className="flex flex-wrap justify-center gap-5">
              {products.map((product) => (
                <ProductCard key={product.id} {...product} />
              ))}
            </div>
          )}

        </div>
    </div>
  );
};

export default Home;



 

  // useEffect(() => {
  //   const fetchData = async () => {
  //     try {
  //       const response = await axios.get("http://localhost:3000/api/v1/probulk");
  //       console.log(response)
  //       setProducts(response.data?.products|| []); // Make sure response.data is an array
  //     } catch (error) {
  //       console.error("Error fetching data:", error);
  //     }
  //   };

  //   fetchData();
  // }, []);
