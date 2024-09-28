import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import './App.css';

const App = () => {
  const [products, setProducts] = useState([]);     // Store all products
  const [displayedProducts, setDisplayedProducts] = useState([]); // Filtered products based on search
  const [page, setPage] = useState(1);              // Track the current page
  const [loading, setLoading] = useState(false);    // Loading state
  const [hasMore, setHasMore] = useState(true);     // Check if more data is available
  const [searchTerm, setSearchTerm] = useState(''); // Search term state

  const pageSize = 10;  // Number of items per page

  // Fetch products from the API
  const fetchProducts = useCallback(async () => {
    setLoading(true);
    try {
      const response = await axios.get(`https://dummyjson.com/products`, {
        params: {
          limit: pageSize,
          skip: (page - 1) * pageSize,
        },
      });
      setProducts((prevProducts) => [...prevProducts, ...response.data.products]);
      setDisplayedProducts((prevProducts) => [...prevProducts, ...response.data.products]);
      setHasMore(response.data.total > products.length + response.data.products.length);
    } catch (error) {
      console.error('Error fetching products:', error);
    }
    setLoading(false);
  }, [page, products.length]); // Memoize with page and products length as dependencies

  // Fetch products when the page number changes
  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]); // Add fetchProducts to the dependency array

  // Handle search input change
  const handleSearch = (event) => {
    const value = event.target.value.toLowerCase();
    setSearchTerm(value);

    // Filter products based on the search term
    const filteredProducts = products.filter(product =>
      product.title.toLowerCase().includes(value) || product.description.toLowerCase().includes(value)
    );
    setDisplayedProducts(filteredProducts);
  };

  // Handle loading more products
  const loadMoreProducts = () => {
    setPage((prevPage) => prevPage + 1);
  };

  // Divide products into groups of 10
  const productGroups = [];
  for (let i = 0; i < displayedProducts.length; i += pageSize) {
    productGroups.push(displayedProducts.slice(i, i + pageSize));
  }

  return (
    <div style={{ padding: '20px' }}>
      <h1>Products</h1>

      {/* Search bar */}
      <input
        type="text"
        placeholder="Search products..."
        value={searchTerm}
        onChange={handleSearch}
        className="search-box"
      />

      {/* Display products in groups of 10 */}
      {productGroups.map((group, index) => (
        <div key={index} style={{ margin: '20px 0', border: '1px solid #ccc', padding: '10px' }}>
          <h2>Products {index * 10 + 1} - {index * 10 + group.length}</h2>
          <div className="product-list">
            {group.map((product) => (
              <div key={product.id} style={{ margin: '10px 0', padding: '10px', border: '1px solid #eee' }}>
                <h3>{product.title}</h3>
                <p>{product.description}</p>
                <p><strong>Price:</strong> ${product.price}</p>
              </div>
            ))}
          </div>
        </div>
      ))}

      {/* Load more button */}
      {hasMore && !loading && (
        <button onClick={loadMoreProducts} style={{ marginTop: '20px', padding: '10px 20px' }}>
          Load More
        </button>
      )}

      {/* Loading indicator */}
      {loading && <p>Loading...</p>}
    </div>
  );
};

export default App;
