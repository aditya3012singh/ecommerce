import React from "react";

type ProductCardProps = {
  id: string;
  title: string;
  description: string;
  price: number;
  imageUrl: string;
  stock: number;
  category: string;
};

const ProductCard: React.FC<ProductCardProps> = ({
  title,
  description,
  price,
  imageUrl,
  stock,
  category,
}) => {
  return (
    <div
      style={cardStyle}
      onMouseEnter={e => (e.currentTarget.style.transform = "scale(1.03)")}
      onMouseLeave={e => (e.currentTarget.style.transform = "scale(1)")}
      title={title}
    >
      <img src={imageUrl} alt={title} style={imageStyle} />
      <h3 style={titleStyle}>{title}</h3>
      <p style={descStyle}>{description}</p>
      <p style={{ fontStyle: "italic", marginBottom: "8px" }}>Category: {category}</p>
      <p style={priceStyle}>₹{price.toFixed(2)}</p>
      <p style={stockStyle}>{stock > 0 ? `In stock: ${stock}` : "Out of stock"}</p>
    </div>
  );
};

export default ProductCard;


const cardStyle: React.CSSProperties = {
  backgroundColor: "#000", // black background
  color: "#fff",           // white text
  borderRadius: "8px",
  boxShadow: "0 4px 8px rgba(255, 255, 255, 0.1)", // subtle white shadow
  padding: "20px",
  margin: "15px",
  maxWidth: "280px",
  fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
  transition: "transform 0.2s ease",
  cursor: "pointer",
};

const imageStyle: React.CSSProperties = {
  width: "100%",
  height: "180px",
  objectFit: "cover",
  borderRadius: "6px",
  marginBottom: "15px",
};

const titleStyle: React.CSSProperties = {
  fontSize: "1.25rem",
  fontWeight: "700",
  marginBottom: "8px",
};

const descStyle: React.CSSProperties = {
  fontSize: "0.9rem",
  opacity: 0.75,
  marginBottom: "12px",
  lineHeight: "1.3",
};

const priceStyle: React.CSSProperties = {
  fontWeight: "bold",
  fontSize: "1.1rem",
  marginBottom: "12px",
};

const stockStyle: React.CSSProperties = {
  fontSize: "0.85rem",
  color: "#ccc",
};
