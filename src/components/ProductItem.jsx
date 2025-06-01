import { Edit, X, ChevronUp, ChevronDown, GripVertical } from "lucide-react";
import VariantList from "./VariantList";

const ProductItem = ({
  product,
  index,
  dragOverItem,
  canRemove,
  onEdit,
  onRemove,
  onRemoveVariant,
  onUpdateDiscount,
  onUpdateVariantDiscount,
  onToggleVariantExpansion,
  onToggleDiscountVisibility,
  onDragStart,
  onDragOver,
  onDragLeave,
  onDrop,
  onVariantDragStart,
  onVariantDragOver,
  onVariantDragLeave,
  onVariantDrop,
}) => {
  const isDragOver =
    dragOverItem?.type === "product" && dragOverItem.index === index;

  return (
    <div
      className={`product-card ${isDragOver ? "drag-over" : ""}`}
      draggable
      onDragStart={(e) => onDragStart(e, index)}
      onDragOver={(e) => onDragOver(e, index)}
      onDragLeave={onDragLeave}
      onDrop={(e) => onDrop(e, index)}
    >
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center space-x-3 flex-1">
          <div className="drag-handle">
            <GripVertical className="grip-dots" />
          </div>
          <span className="text-gray-600 text-sm">{index + 1}.</span>
          {product.isNew ? (
            <div className="flex items-center space-x-2 bg-white border border-gray-300 rounded px-3 py-2 flex-1 max-w-md justify-between">
              <span className="text-gray-500">Select Product</span>
              <Edit
                className="w-4 h-4 text-gray-400 cursor-pointer hover:text-gray-600 transition-colors"
                onClick={onEdit}
              />
            </div>
          ) : (
            <div className="flex items-center space-x-3 flex-1">
              {product.image && (
                <img
                  src={product.image.src}
                  alt={product.title}
                  className="w-10 h-10 object-cover rounded border"
                  onError={(e) => {
                    e.target.src = `https://via.placeholder.com/40x40?text=${product.title.charAt(
                      0
                    )}`;
                  }}
                />
              )}
              <span className="font-medium text-gray-800">{product.title}</span>
              <Edit
                className="w-4 h-4 text-gray-400 cursor-pointer hover:text-gray-600 transition-colors"
                onClick={onEdit}
              />
            </div>
          )}
        </div>

        <div className="flex items-center space-x-2">
          {!product.showDiscount && (
            <button
              onClick={onToggleDiscountVisibility}
              className="px-3 py-1 bg-green-600 text-white text-sm rounded hover:bg-green-700 transition-colors"
            >
              Add Discount
            </button>
          )}

          {product.showDiscount && (
            <>
              <input
                type="number"
                placeholder="0"
                className="input-field w-16 text-center"
                value={product.discountValue || ""}
                onChange={(e) =>
                  onUpdateDiscount(index, "discountValue", e.target.value)
                }
              />
              <select
                className="input-field px-3 py-1 bg-white"
                value={product.discountType || "percentage"}
                onChange={(e) =>
                  onUpdateDiscount(index, "discountType", e.target.value)
                }
              >
                <option value="percentage">% Off</option>
                <option value="flat">$ Off</option>
              </select>
            </>
          )}

          {canRemove && (
            <button
              onClick={onRemove}
              className="text-gray-400 hover:text-red-500 transition-colors p-1"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {product.variants && product.variants.length > 0 && (
        <div className="ml-8">
          <button
            onClick={onToggleVariantExpansion}
            className="flex items-center space-x-1 text-blue-600 text-sm mb-2 hover:text-blue-700 transition-colors"
          >
            <span>
              {product.expandedVariants ? "Hide variants" : "Show variants"}
            </span>
            {product.expandedVariants ? (
              <ChevronUp className="w-4 h-4" />
            ) : (
              <ChevronDown className="w-4 h-4" />
            )}
          </button>

          {product.expandedVariants && (
            <VariantList
              variants={product.variants}
              productIndex={index}
              dragOverItem={dragOverItem}
              onUpdateVariantDiscount={onUpdateVariantDiscount}
              onRemoveVariant={onRemoveVariant}
              onVariantDragStart={onVariantDragStart}
              onVariantDragOver={onVariantDragOver}
              onVariantDragLeave={onVariantDragLeave}
              onVariantDrop={onVariantDrop}
            />
          )}
        </div>
      )}
    </div>
  );
};

export default ProductItem;
