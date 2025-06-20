import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { ShoppingCart, CheckCircle,Check  } from 'lucide-react';
import { useCart } from '../../../../context-api/productcartSlice';

const ProductDetail = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [showToast, setShowToast] = useState(false);
  const { addItem } = useCart();

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await axios.get('https://mocki.io/v1/7fca606c-abc8-4397-b797-a380fc8be7d7');
        const found = res.data.find((p) => String(p.id) === id);
        setProduct(found);
      } catch (err) {
        console.error('Failed to fetch product', err);
      }
    };

    fetchProduct();
  }, [id]);

  const handleAddToCart = () => {
    addItem(product);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 2000);
  };

  if (!product) return <p className="text-center py-10">Loading product...</p>;

  return (
    <div className="relative max-w-6xl mx-auto px-4 py-10">
      {showToast && (
        <div className="fixed top-6 right-6 bg-green-500 text-white px-4 py-2 rounded-lg shadow-lg flex items-center gap-2 animate-fade-in-down z-50">
          <CheckCircle className="w-5 h-5" />
          <span>Added to cart</span>
        </div>
      )}

      <Link
        to="/dashboard/shopping"
        className="text-[var(--primary-color)] hover:underline text-sm font-medium mb-6 inline-block"
      >
        ← Back to Products
      </Link>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-10 bg-white p-8 rounded-2xl shadow-xl">
        {/* Product Image */}
        <div className="flex flex-col gap-4">
          <img
            src={product.image}
            alt={product.name}
            className="rounded-2xl w-full max-h-[400px] object-contain border border-gray-100"
          />
          {!product.inStock && (
            <span className="text-red-600 text-center font-semibold">
              Out of Stock
            </span>
          )}
        </div>

        {/* Product Info */}
        <div>
          <h1 className="h4-heading">{product.name}</h1>
          <p className="text-sm text-gray-500 mb-4">
            {product.category} • {product.brand}
          </p>

          {/* Price Section */}
          <div className="flex items-center space-x-3 mb-4">
            <span className="font-semibold text-[var(--primary-color)]">
              ₹{product.price.toFixed(2)}
            </span>
            {product.originalPrice && (
              <span className="paragraph  line-through ">
                ₹{product.originalPrice.toFixed(2)}
              </span>
            )}
          </div>

          {/* Description */}
          <p className="paragraph mb-4">
            {product.description || 'No description available.'}
          </p>

          {/* Features List */}
          {product.features && (
           <ul className="pl-5 text-sm text-[var(--primary-color)] space-y-2 mb-4">
  {product.features.map((feature, index) => (
    <li key={index} className="flex items-start gap-2">
      <Check className="w-4 h-4 mt-1 text-green-600" />
      <span>{feature}</span>
    </li>
  ))}
</ul>
          )}

          {/* Stock Alert */}
          {product.inStock && product.stockQuantity <= 10 && (
            <p className="text-orange-600 text-sm mb-4">
              Hurry! Only {product.stockQuantity} left in stock.
            </p>
          )}

          {/* Add to Cart */}
          <button
            onClick={handleAddToCart}
            disabled={!product.inStock}
            className={`flex items-center view-btn ${
              product.inStock
                ? 'view-btn'
                : 'edit-btn'
            }`}
          >
            <ShoppingCart className="w-5 h-5" />
            {product.inStock ? 'Add to Cart' : 'Out of Stock'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;