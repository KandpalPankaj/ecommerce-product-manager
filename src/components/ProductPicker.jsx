import { useEffect, useRef } from "react";
import { X, Search } from "lucide-react";

const ProductPicker = ({
  availableProducts,
  loading,
  hasMore,
  searchQuery,
  selectedInPicker,
  onSearchChange,
  onProductSelection,
  onConfirmSelection,
  onClose,
  onScrollPagination,
}) => {
  const scrollRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => {
      if (!scrollRef.current || loading || !hasMore) return;

      const { scrollTop, scrollHeight, clientHeight } = scrollRef.current;
      if (scrollTop + clientHeight >= scrollHeight - 5) {
        onScrollPagination();
      }
    };

    const scrollElement = scrollRef.current;
    if (scrollElement) {
      scrollElement.addEventListener("scroll", handleScroll);
      return () => {
        scrollElement.removeEventListener("scroll", handleScroll);
      };
    }
  }, [loading, hasMore, onScrollPagination]);

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="flex items-center justify-between p-4 border-b">
          <h3 className="text-lg font-semibold">Select Products</h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors p-1"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-4 border-b">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search product"
              className="input-field w-full pl-10 pr-4 py-2"
              value={searchQuery}
              onChange={(e) => {
                onSearchChange(e.target.value);
              }}
            />
          </div>
        </div>

        <div
          className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-thin"
          ref={scrollRef}
        >
          {availableProducts.length === 0 && !loading ? (
            <div className="text-center py-8">
              <p className="text-gray-500">No products found</p>
              {searchQuery && (
                <p className="text-sm text-gray-400 mt-2">
                  Try adjusting your search terms
                </p>
              )}
            </div>
          ) : (
            <>
              {availableProducts.map((product) => {
                if (!product || !product.id) {
                  return null;
                }

                return (
                  <div
                    key={product.id}
                    className="border border-gray-200 rounded-lg p-4"
                  >
                    <div className="flex items-center space-x-3 mb-3">
                      <input
                        type="checkbox"
                        className="w-4 h-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
                        checked={
                          selectedInPicker.has(product.id.toString()) ||
                          (product.variants &&
                            product.variants.every((variant) =>
                              selectedInPicker.has(
                                `${product.id}-${variant.id}`
                              )
                            ))
                        }
                        onChange={() => onProductSelection(product)}
                      />
                      {product.image && (
                        <img
                          src={product.image.src}
                          alt={product.title || "Product"}
                          className="w-10 h-10 object-cover rounded border"
                          onError={(e) => {
                            const title = product.title || "Product";
                            e.target.src = `https://via.placeholder.com/40x40?text=${title.charAt(
                              0
                            )}`;
                          }}
                        />
                      )}
                      <span className="font-medium text-gray-800">
                        {product.title || "Untitled Product"}
                      </span>
                    </div>

                    {product.variants &&
                      Array.isArray(product.variants) &&
                      product.variants.map((variant) => {
                        if (!variant || !variant.id) {
                          return null;
                        }

                        return (
                          <div
                            key={variant.id}
                            className="flex items-center justify-between ml-7 py-1"
                          >
                            <div className="flex items-center space-x-3">
                              <input
                                type="checkbox"
                                className="w-4 h-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
                                checked={selectedInPicker.has(
                                  `${product.id}-${variant.id}`
                                )}
                                onChange={() =>
                                  onProductSelection(product, variant.id)
                                }
                              />
                              <span className="text-gray-700">
                                {variant.title || "Untitled Variant"}
                              </span>
                            </div>
                            <div className="text-sm text-gray-500 flex items-center space-x-4">
                              <span className="font-medium">
                                ${variant.price || "0.00"}
                              </span>
                            </div>
                          </div>
                        );
                      })}
                  </div>
                );
              })}

              {loading && (
                <div className="text-center py-4">
                  <div className="inline-block animate-spin rounded-full h-6 w-6 border-b-2 border-green-600"></div>
                </div>
              )}

              {!hasMore && availableProducts.length > 0 && (
                <div className="text-center py-4">
                  <p className="text-sm text-gray-500">
                    No more products to load
                  </p>
                </div>
              )}
            </>
          )}
        </div>
        <div className="flex items-center justify-between p-4 border-t bg-gray-50">
          <span className="text-sm text-gray-600">
            {selectedInPicker.size} product
            {selectedInPicker.size !== 1 ? "s" : ""} selected
          </span>
          <div className="flex space-x-3">
            <button onClick={onClose} className="btn-secondary">
              Cancel
            </button>
            <button
              onClick={onConfirmSelection}
              className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
              disabled={selectedInPicker.size === 0}
            >
              <span>Add</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductPicker;
