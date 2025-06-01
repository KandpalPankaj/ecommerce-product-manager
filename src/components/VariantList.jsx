import { GripVertical, X } from "lucide-react";

const VariantList = ({
  variants,
  productIndex,
  dragOverItem,
  onUpdateVariantDiscount,
  onRemoveVariant,
  onVariantDragStart,
  onVariantDragOver,
  onVariantDragLeave,
  onVariantDrop,
}) => {
  return (
    <div className="space-y-2 border-l-2 border-gray-200 pl-4">
      {variants.map((variant, variantIndex) => {
        const isDragOver =
          dragOverItem?.type === "variant" &&
          dragOverItem.productIndex === productIndex &&
          dragOverItem.variantIndex === variantIndex;

        return (
          <div
            key={variant.id}
            className={`variant-item ${
              isDragOver ? "border-blue-400 bg-blue-50" : ""
            }`}
            draggable
            onDragStart={(e) =>
              onVariantDragStart(e, productIndex, variantIndex)
            }
            onDragOver={(e) => onVariantDragOver(e, productIndex, variantIndex)}
            onDragLeave={onVariantDragLeave}
            onDrop={(e) => onVariantDrop(e, productIndex, variantIndex)}
          >
            <div className="flex items-center space-x-3">
              <div className="drag-handle">
                <GripVertical className="w-4 h-4 text-gray-400" />
              </div>
              <span className="text-gray-700">{variant.title}</span>
            </div>

            <div className="flex items-center space-x-2">
              {variants.length > 1 && (
                <button
                  onClick={() => onRemoveVariant(productIndex, variantIndex)}
                  className="text-gray-400 hover:text-red-500 transition-colors p-1"
                  title="Remove variant"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default VariantList;
