import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { ShoppingCart, Star, Heart, Filter, Grid, List, SlidersHorizontal, Search, Menu, X } from 'lucide-react';
import axios from 'axios';

import { useCart } from '../../../../context-api/productcartSlice';

const ProductCard = ({ product, updateCartCount }) => {
  const { addItem } = useCart();
 
    const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    addItem(product);
    updateCartCount(); // Update the cart count
  };

  const renderStars = (rating) => {
    return Array.from({ length: 5 }, (_, index) => (
      <Star
        key={index}
        className={`h-4 w-4 ${
          index < Math.floor(rating)
            ? 'text-yellow-400 fill-current '
            : 'text-gray-300'
        }`}
      />
    ));
  };

  return (
    <Link to={`/dashboard/product/${product.id}`} className="group">
      <div className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden ">
        {/* Image Container */}
        <div className="relative overflow-hidden">
          <div className="relative flex items-center justify-center h-48 overflow-hidden">
  <img
    src={product.image}
    alt={product.name}
    className="object-contain h-full transition-transform duration-300 group-hover:scale-110"
  />

  {product.originalPrice && (
    <div className="absolute top-2 left-2 bg-red-500 text-white px-2 py-1 rounded-md text-xs font-semibold">
      SAVE ₹{(product.originalPrice - product.price).toFixed(2)}
    </div>
  )}
</div>

          <button className="absolute top-2 right-2 p-2 bg-white rounded-full shadow-md opacity-0 group-hover:opacity-100 transition-opacity duration-200 hover:bg-gray-50">
            <Heart className="h-4 w-4 text-gray-600" />
          </button>
          {!product.inStock && (
            <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
              <span className="text-white font-semibold text-lg">Out of Stock</span>
            </div>
          )}
        </div>

        {/* Content */}
        <div className="p-4">
          {/* Brand & Category */}
          <div className="flex items-center justify-between text-xs text-gray-500 mb-2">
            <span className="font-medium">{product.brand}</span>
            <span>{product.category}</span>
          </div>

          {/* Product Name */}
          <h3 className="font-semibold text-sm text-gray-900 mb-2">
            {product.name}
          </h3>

          {/* Rating */}
          <div className="flex items-center space-x-1 mb-3">
            <div className="flex ">
              {renderStars(product.rating)}
            </div>
            <span className="text-xs text-gray-600">
              ({product.reviews})
            </span>
          </div>

          {/* Price */}
          <div className="flex items-center space-x-2 mb-4">
            <span className=" font-semibold ">
              ₹{product.price.toFixed(2)}
            </span>
            {product.originalPrice && (
              <span className="text-sm text-gray-500 line-through">
                ₹{product.originalPrice.toFixed(2)}
              </span>
            )}
          </div>

          {/* Add to Cart Button */}
         <button
            onClick={handleAddToCart}
            disabled={!product.inStock}
            className={`view-btn flex items-center justify-center space-x-2 py-2 px-4 rounded-lg font-medium transition-colors ${
              product.inStock
                ? 'view-btn'
                : 'edit-btn'
            }`}
          >
            <ShoppingCart className="h-4 w-4" />
            <span>{product.inStock ? 'Add to Cart' : 'Out of Stock'}</span>
          </button>

          {/* Stock Info */}
          {product.inStock && product.stockQuantity <= 10 && (
            <p className="text-xs text-orange-600 mt-2 text-center">
              Only {product.stockQuantity} left in stock!
            </p>
          )}
        </div>
      </div>
    </Link>
  );
};

const ProductsPage = () => {
  const [products, setProducts] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('All Categories');
  const [sortBy, setSortBy] = useState('name');
  const [priceRange, setPriceRange] = useState([0, 500]);
  const [showFilters, setShowFilters] = useState(false);
  const [viewMode, setViewMode] = useState('grid');
  const [searchQuery, setSearchQuery] = useState('');
  const [itemCount, setItemCount] = useState(0); // State for cart items
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    // Fetch products data from API
    const fetchProducts = async () => {
      try {
        const response = await axios.get('https://mocki.io/v1/7fca606c-abc8-4397-b797-a380fc8be7d7'); // Replace with your API endpoint
        setProducts(response.data);
      } catch (error) {
        console.error('Error fetching products:', error);
      }
    };

    fetchProducts();
  }, []);
const categories = useMemo(() => {
  const allCategories = products.map(p => p.category);
  const uniqueCategories = ['All Categories', ...new Set(allCategories)];
  return uniqueCategories;
}, [products]);
  const updateCartCount = () => {
    setItemCount((prevCount) => prevCount + 1); // Increment cart count
  };

  const handleSearch = (e) => {
    e.preventDefault();
    console.log('Search query:', searchQuery);
    // Implement search functionality here
  };

  const filteredAndSortedProducts = useMemo(() => {
    let filtered = products.filter((product) => {
      const categoryMatch =
        selectedCategory === 'All Categories' || product.category === selectedCategory;
      const priceMatch = product.price >= priceRange[0] && product.price <= priceRange[1];
      const searchMatch = product.name.toLowerCase().includes(searchQuery.toLowerCase());
      return categoryMatch && priceMatch && searchMatch;
    });

    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'price-low':
          return a.price - b.price;
        case 'price-high':
          return b.price - a.price;
        case 'rating':
          return b.rating - a.rating;
        case 'name':
        default:
          return a.name.localeCompare(b.name);
      }
    });

    return filtered;
  }, [products, selectedCategory, sortBy, priceRange, searchQuery]);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <header className="  top-0 z-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
              <div className="hidden md:flex flex-1 max-w-lg mx-8">
                <form onSubmit={handleSearch} className="w-full">
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="Search medical supplies..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--primary-color)] focus:border-transparent"
                    />
                    <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                  </div>
                </form>
              </div>

              {/* Navigation - Desktop */}
              <nav className="hidden md:flex items-center space-x-6">
                <Link to="/dashboard/orders" className="text-gray-700 hover:text-[var(--primary-color)] font-medium">
                  Orders
                </Link>
                

                {/* Cart */}
                <Link to="/dashboard/cartproduct" className="relative p-2 text-gray-700 hover:text-[var(--primary-color)]">
                  <ShoppingCart className="h-6 w-6" />
                  {itemCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                      {itemCount}
                    </span>
                  )}
                </Link>
              </nav>

              {/* Mobile Menu Button */}
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="md:hidden p-2 text-gray-700"
              >
                {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </button>
            </div>
          </div>
        </header>
        <div className="mb-8">
          {/* <h1 className="text-3xl font-bold text-gray-900 mb-4">Medical Products</h1> */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <p className="text-gray-600">Showing {filteredAndSortedProducts.length} products</p>

            <div className="flex items-center space-x-4">
              {/* View Mode Toggle */}
              <div className="flex bg-white rounded-lg border">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 rounded-l-lg ${
                    viewMode === 'grid' ? 'bg-[var(--primary-color)] text-white' : 'text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  <Grid className="h-4 w-4" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 rounded-r-lg ${
                    viewMode === 'list' ? 'bg-[var(--primary-color)] text-white' : 'text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  <List className="h-4 w-4" />
                </button>
              </div>

              {/* Sort Dropdown */}
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--primary-color)] focus:border-transparent bg-white"
              >
                <option value="name">Sort by Name</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="rating">Highest Rated</option>
              </select>

              {/* Filter Toggle */}
              {/* <button
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center space-x-2 px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                <SlidersHorizontal className="h-4 w-4" />
                <span>Filters</span>
              </button> */}
            </div>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Filters Sidebar */}
          <div className={`lg:w-64 ${showFilters ? 'block' : 'hidden lg:block'}`}>
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-lg font-semibold mb-4 flex items-center">
                <Filter className="h-5 w-5 mr-2" />
                Filters
              </h3>
<div className="mb-6">
  <h4 className="font-medium text-gray-900 mb-3">Category</h4>
  <div className="space-y-2">
    {categories.map((category) => (
      <label key={category} className="flex items-center">
        <input
          type="radio"
          name="category"
          value={category}
          checked={selectedCategory === category}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="h-4 w-4 text-[var(--primary-color)] focus:[var(--primary-color)] border-gray-300"
        />
        <span className="ml-2 text-sm text-gray-700">{category}</span>
      </label>
    ))}
  </div>
</div>


              {/* Price Range Filter */}
              <div className="mb-6">
                <h4 className="font-medium text-gray-900 mb-3">Price Range</h4>
                <div className="space-y-4">
                  <div>
                    <input
                      type="range"
                      min="0"
                      max="500"
                      value={priceRange[1]}
                      onChange={(e) =>
                        setPriceRange([priceRange[0], parseInt(e.target.value)])
                      }
                      className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                    />
                  </div>
                  <div className="flex justify-between text-sm text-gray-600">
                    <span>₹{priceRange[0]}</span>
                    <span>₹{priceRange[1]}</span>
                  </div>
                </div>
              </div>

              {/* In Stock Filter */}
              <div className="mb-6">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    className="h-4 w-4 text-[var(--primary-color)] focus:ring-[var(--primary-color)] border-gray-300 rounded"
                  />
                  <span className="ml-2 text-sm text-gray-700">In Stock Only</span>
                </label>
              </div>
            </div>
          </div>

          {/* Products Grid */}
        <div className="flex-1">
          {filteredAndSortedProducts.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg">
                No products found matching your criteria.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredAndSortedProducts.map((product) => (
                <ProductCard key={product.id} product={product} updateCartCount={updateCartCount} />
              ))}
            </div>
          )}
        </div>
        </div>
      </div>
    </div>
  );
};

export default ProductsPage;