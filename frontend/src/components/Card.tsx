import AppBar from "./AppBar"

interface CardItem{
    title:string,
    imageUrl:string,
    price:Number,
    stock:Number
}

export const Card=({title, imageUrl, price, stock}:CardItem)=>{
    return <div className="min-h-screen bg-gradient-to-b from-black to-gray-600">
        
       {/* <AppBar type={"Profile"} /> */}
       <div className="bottom-2 border-solid text-white border-white">
        <div>
            <img className="h-48 w-96 object-contain ..." src={imageUrl} />
        </div>
        <div>{title}</div>
        <div>price ${price.toString()}</div>
        <div>Stock {stock.toString()}</div>
       </div>   
    </div>
}