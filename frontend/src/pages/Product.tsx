import { useParams } from "react-router-dom"
import { useProduct } from "../hooks"
import AppBar from "../components/AppBar"
import ProductCard from "../components/ProductCard"

export const Product=()=>{
    const {id}=useParams()
    const {loading, product}=useProduct(id!)

    if(loading || !product){
        return <div>
            <AppBar type="Profile"/>
        
            <div className="h-screen flex flex-col justify-center">
                
                <div className="flex justify-center">
                    loading..
                </div>
            </div>
        </div>
    }
    return <div>
        <ProductCard key={product.id} id={product.id} title={product.title} description={product.description} price={product.price} imageUrl={product.imageUrl} stock={product.stock} Category={product.Category}/>
    </div>
} 