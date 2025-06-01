import { useState, useCallback, useEffect } from "react";

const API_KEY = process.env.REACT_APP_API_KEY;

export const useProductAPI = () => {
  const [availableProducts, setAvailableProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [error, setError] = useState(null);

  const fetchProducts = useCallback(
    async (searchTerm = "", append = false) => {
      try {
        setLoading(true);
        setError(null);
        const currentPage = append ? page + 1 : 1;

        const url = `https://stageapi.monkcommerce.app/task/products/search?search=${encodeURIComponent(
          searchTerm
        )}&page=${currentPage}&limit=10`;

        const response = await fetch(url, {
          method: "GET",
          headers: {
            "x-api-key": API_KEY,
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        const products = Array.isArray(data) ? data : [];

        if (append) {
          setAvailableProducts((prev) => {
            return [...prev, ...products];
          });
          setPage(currentPage);
        } else {
          setAvailableProducts(products);
          setPage(1);
        }

        setHasMore(products.length === 10);
      } catch (error) {
        setError(error.message);

        if (!append) {
          setAvailableProducts([]);
        }
        setHasMore(false);
      } finally {
        setLoading(false);
        setInitialLoading(false);
      }
    },
    [page]
  );

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchProducts(searchQuery, false);
    }, 300);
    return () => clearTimeout(timer);
  }, [searchQuery, fetchProducts]);

  return {
    availableProducts,
    loading,
    initialLoading,
    hasMore,
    searchQuery,
    setSearchQuery,
    fetchProducts,
    error,
  };
};
