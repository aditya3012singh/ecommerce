import {Link} from "react-router-dom"

interface ProductProps{
    id:string,
    title :string,
    description:string,
    price: number,
    imageUrl: string,
    stock: number,
    Category: string
}

export const SeparateCard=({
    id,
    title,
    description,
    price,
    imageUrl,
    stock,
    Category,
}:ProductProps)=>{
    return <Link to={`/product/${id}`}>
    <div
      className="bg-black text-white rounded-lg shadow-lg p-5 m-4 max-w-xs font-sans transition-transform duration-200 transform hover:scale-105 cursor-pointer"
      title={title}
    >
      <img
        src={imageUrl}
        alt={title}
        className="w-full h-44 object-cover rounded-md mb-4"
      />
      <h3 className="text-xl font-bold mb-2">{title}</h3>
      <p className="text-sm opacity-75 mb-3 leading-snug">{description}</p>
      <p className="italic mb-2">Category: {Category}</p>
      <p className="text-lg font-bold mb-3">₹{price.toFixed(2)}</p>
      <p className="text-xs text-gray-300">
        {stock > 0 ? `In stock: ${stock}` : "Out of stock"}
      </p>
    </div>
    </Link>
}