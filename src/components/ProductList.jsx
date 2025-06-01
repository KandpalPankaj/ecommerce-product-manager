import ProductItem from "./ProductItem";

const ProductList = ({
  selectedProducts,
  dragOverItem,
  onEditProduct,
  onRemoveProduct,
  onRemoveVariant,
  onUpdateProductDiscount,
  onUpdateVariantDiscount,
  onToggleVariantExpansion,
  onToggleDiscountVisibility,
  onProductDragStart,
  onProductDragOver,
  onProductDragLeave,
  onProductDrop,
  onVariantDragStart,
  onVariantDragOver,
  onVariantDragLeave,
  onVariantDrop,
}) => {
  return (
    <div className="space-y-4 mb-6">
      {selectedProducts.map((product, index) => (
        <ProductItem
          key={`${product.id}-${index}`}
          product={product}
          index={index}
          dragOverItem={dragOverItem}
          canRemove={selectedProducts.length > 1}
          onEdit={() => onEditProduct(index)}
          onRemove={() => onRemoveProduct(index)}
          onRemoveVariant={onRemoveVariant}
          onUpdateDiscount={onUpdateProductDiscount}
          onUpdateVariantDiscount={onUpdateVariantDiscount}
          onToggleVariantExpansion={() => onToggleVariantExpansion(index)}
          onToggleDiscountVisibility={() => onToggleDiscountVisibility(index)}
          onDragStart={onProductDragStart}
          onDragOver={onProductDragOver}
          onDragLeave={onProductDragLeave}
          onDrop={onProductDrop}
          onVariantDragStart={onVariantDragStart}
          onVariantDragOver={onVariantDragOver}
          onVariantDragLeave={onVariantDragLeave}
          onVariantDrop={onVariantDrop}
        />
      ))}
    </div>
  );
};

export default ProductList;
