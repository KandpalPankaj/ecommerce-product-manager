import { useState, useEffect, useCallback } from "react";
import ProductList from "./ProductList";
import ProductPicker from "./ProductPicker";

const API_KEY = process.env.REACT_APP_API_KEY;

const ProductManager = () => {
  const [selectedProducts, setSelectedProducts] = useState([
    {
      id: "temp-1",
      title: "",
      variants: [],
      isNew: true,
      discountType: "percentage",
      discountValue: "",
      expandedVariants: false,
      showDiscount: false,
    },
  ]);
  const [showProductPicker, setShowProductPicker] = useState(false);
  const [editingIndex, setEditingIndex] = useState(-1);
  const [searchQuery, setSearchQuery] = useState("");
  const [availableProducts, setAvailableProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedInPicker, setSelectedInPicker] = useState(new Set());
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [draggedItem, setDraggedItem] = useState(null);
  const [dragOverItem, setDragOverItem] = useState(null);

  const fetchProducts = useCallback(
    async (searchTerm = "", pageNum = 1, append = false) => {
      try {
        setLoading(true);
        const response = await fetch(
          `https://stageapi.monkcommerce.app/task/products/search?search=${encodeURIComponent(
            searchTerm
          )}&page=${pageNum}&limit=10`,
          {
            method: "GET",
            headers: {
              "x-api-key": API_KEY,
              "Content-Type": "application/json",
            },
          }
        );

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        const products = Array.isArray(data) ? data : [];

        if (append) {
          setAvailableProducts((prev) => [...prev, ...products]);
        } else {
          setAvailableProducts(products);
        }

        setHasMore(products.length === 10);
      } catch (error) {
        console.error("Error fetching products:", error);
        if (!append) {
          setAvailableProducts([]);
        }
      } finally {
        setLoading(false);
      }
    },
    []
  );

  const handleScrollPagination = useCallback(() => {
    const nextPage = page + 1;
    setPage(nextPage);
    fetchProducts(searchQuery, nextPage, true);
  }, [page, searchQuery, fetchProducts]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setPage(1);
      fetchProducts(searchQuery, 1, false);
    }, 300);
    return () => clearTimeout(timer);
  }, [searchQuery, fetchProducts]);

  const handleEditProduct = (index) => {
    setEditingIndex(index);
    setShowProductPicker(true);
    setSelectedInPicker(new Set());
    setSearchQuery("");
  };

  const handleSearchChange = (query) => {
    setSearchQuery(query);
  };

  const handleProductSelection = (product, variantId = null) => {
    const key = variantId ? `${product.id}-${variantId}` : `${product.id}`;
    const newSelected = new Set(selectedInPicker);

    if (variantId) {
      if (newSelected.has(key)) {
        newSelected.delete(key);
        newSelected.delete(product.id.toString());
      } else {
        newSelected.add(key);
      }
    } else {
      if (newSelected.has(key)) {
        newSelected.delete(key);
        if (product.variants) {
          product.variants.forEach((variant) => {
            newSelected.delete(`${product.id}-${variant.id}`);
          });
        }
      } else {
        newSelected.add(key);
        if (product.variants) {
          product.variants.forEach((variant) => {
            newSelected.add(`${product.id}-${variant.id}`);
          });
        }
      }
    }

    setSelectedInPicker(newSelected);
  };

  const confirmSelection = () => {
    const newProducts = [];
    const productVariantMap = new Map();

    selectedInPicker.forEach((key) => {
      const [productId, variantId] = key.split("-");
      const product = availableProducts.find(
        (p) => p.id.toString() === productId
      );

      if (product) {
        if (!productVariantMap.has(productId)) {
          productVariantMap.set(productId, {
            product,
            selectedVariants: new Set(),
            wholeProductSelected: false,
          });
        }

        const productData = productVariantMap.get(productId);

        if (variantId && variantId !== "undefined") {
          const variant = product.variants.find(
            (v) => v.id.toString() === variantId
          );
          if (variant) {
            productData.selectedVariants.add(variant.id.toString());
          }
        } else {
          productData.wholeProductSelected = true;
        }
      }
    });

    productVariantMap.forEach(
      ({ product, selectedVariants, wholeProductSelected }) => {
        let variants;

        if (wholeProductSelected) {
          variants = product.variants || [];
        } else {
          variants = (product.variants || []).filter((variant) =>
            selectedVariants.has(variant.id.toString())
          );
        }

        newProducts.push({
          id: product.id,
          title: product.title,
          variants: variants,
          image: product.image,
          discountType: "percentage",
          discountValue: "",
          expandedVariants: false,
          showDiscount: false,
        });
      }
    );

    const updatedProducts = [...selectedProducts];
    updatedProducts.splice(editingIndex, 1, ...newProducts);
    setSelectedProducts(updatedProducts);
    setShowProductPicker(false);
    setEditingIndex(-1);
  };

  const addProduct = () => {
    setSelectedProducts([
      ...selectedProducts,
      {
        id: `temp-${Date.now()}`,
        title: "",
        variants: [],
        isNew: true,
        discountType: "percentage",
        discountValue: "",
        expandedVariants: false,
        showDiscount: false,
      },
    ]);
  };

  const removeProduct = (index) => {
    if (selectedProducts.length > 1) {
      const updated = selectedProducts.filter((_, i) => i !== index);
      setSelectedProducts(updated);
    }
  };

  const updateProductDiscount = (index, field, value) => {
    const updated = [...selectedProducts];
    updated[index] = { ...updated[index], [field]: value };
    setSelectedProducts(updated);
  };

  const updateVariantDiscount = (productIndex, variantIndex, field, value) => {
    const updated = [...selectedProducts];
    const product = { ...updated[productIndex] };
    const variants = [...product.variants];
    variants[variantIndex] = { ...variants[variantIndex], [field]: value };
    product.variants = variants;
    updated[productIndex] = product;
    setSelectedProducts(updated);
  };

  const removeVariant = (productIndex, variantIndex) => {
    const updated = [...selectedProducts];
    const product = { ...updated[productIndex] };
    const variants = [...product.variants];

    if (variants.length > 1) {
      variants.splice(variantIndex, 1);
      product.variants = variants;
      updated[productIndex] = product;
      setSelectedProducts(updated);
    }
  };

  const toggleDiscountVisibility = (index) => {
    const updated = [...selectedProducts];
    updated[index] = {
      ...updated[index],
      showDiscount: !updated[index].showDiscount,
    };
    setSelectedProducts(updated);
  };

  const toggleVariantExpansion = (index) => {
    const updated = [...selectedProducts];
    updated[index] = {
      ...updated[index],
      expandedVariants: !updated[index].expandedVariants,
    };
    setSelectedProducts(updated);
  };

  const handleProductDragStart = (e, index) => {
    setDraggedItem({ type: "product", index });
    e.dataTransfer.effectAllowed = "move";
  };

  const handleProductDragOver = (e, index) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
    setDragOverItem({ type: "product", index });
  };

  const handleProductDragLeave = (e) => {
    if (!e.currentTarget.contains(e.relatedTarget)) {
      setDragOverItem(null);
    }
  };

  const handleProductDrop = (e, dropIndex) => {
    e.preventDefault();

    if (!draggedItem || draggedItem.type !== "product") return;

    const dragIndex = draggedItem.index;
    if (dragIndex === dropIndex) return;

    const updatedProducts = [...selectedProducts];
    const [draggedProduct] = updatedProducts.splice(dragIndex, 1);
    updatedProducts.splice(dropIndex, 0, draggedProduct);

    setSelectedProducts(updatedProducts);
    setDraggedItem(null);
    setDragOverItem(null);
  };

  const handleVariantDragStart = (e, productIndex, variantIndex) => {
    setDraggedItem({ type: "variant", productIndex, variantIndex });
    e.dataTransfer.effectAllowed = "move";
    e.stopPropagation();
  };

  const handleVariantDragOver = (e, productIndex, variantIndex) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
    setDragOverItem({ type: "variant", productIndex, variantIndex });
    e.stopPropagation();
  };

  const handleVariantDragLeave = (e) => {
    e.stopPropagation();
    if (!e.currentTarget.contains(e.relatedTarget)) {
      setDragOverItem(null);
    }
  };

  const handleVariantDrop = (e, productIndex, dropVariantIndex) => {
    e.preventDefault();
    e.stopPropagation();

    if (
      !draggedItem ||
      draggedItem.type !== "variant" ||
      draggedItem.productIndex !== productIndex
    )
      return;

    const dragVariantIndex = draggedItem.variantIndex;
    if (dragVariantIndex === dropVariantIndex) return;

    const updatedProducts = [...selectedProducts];
    const product = { ...updatedProducts[productIndex] };
    const variants = [...product.variants];

    const [draggedVariant] = variants.splice(dragVariantIndex, 1);
    variants.splice(dropVariantIndex, 0, draggedVariant);

    product.variants = variants;
    updatedProducts[productIndex] = product;

    setSelectedProducts(updatedProducts);
    setDraggedItem(null);
    setDragOverItem(null);
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-gray-50 min-h-screen">
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h1 className="text-2xl font-semibold mb-6 text-gray-800">
          Add Products
        </h1>

        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-medium text-gray-700">Product</h2>
          <h2 className="text-lg font-medium text-gray-700">Discount</h2>
        </div>

        <ProductList
          selectedProducts={selectedProducts}
          dragOverItem={dragOverItem}
          onEditProduct={handleEditProduct}
          onRemoveProduct={removeProduct}
          onRemoveVariant={removeVariant}
          onUpdateProductDiscount={updateProductDiscount}
          onUpdateVariantDiscount={updateVariantDiscount}
          onToggleVariantExpansion={toggleVariantExpansion}
          onToggleDiscountVisibility={toggleDiscountVisibility}
          onProductDragStart={handleProductDragStart}
          onProductDragOver={handleProductDragOver}
          onProductDragLeave={handleProductDragLeave}
          onProductDrop={handleProductDrop}
          onVariantDragStart={handleVariantDragStart}
          onVariantDragOver={handleVariantDragOver}
          onVariantDragLeave={handleVariantDragLeave}
          onVariantDrop={handleVariantDrop}
        />

        <button onClick={addProduct} className="btn-outline">
          Add Product
        </button>
      </div>

      {showProductPicker && (
        <ProductPicker
          availableProducts={availableProducts}
          loading={loading}
          hasMore={hasMore}
          searchQuery={searchQuery}
          selectedInPicker={selectedInPicker}
          onSearchChange={handleSearchChange}
          onProductSelection={handleProductSelection}
          onConfirmSelection={confirmSelection}
          onClose={() => setShowProductPicker(false)}
          onScrollPagination={handleScrollPagination}
        />
      )}
    </div>
  );
};

export default ProductManager;
