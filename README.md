# E-commerce Product Manager

A comprehensive React application for managing e-commerce products with advanced features including drag-and-drop functionality, discount management, and product variant handling. Built with **Tailwind CSS** for modern, responsive styling.

## 🚀 Features

### Core Functionality

- **Product Management**: Add, edit, and remove products from your inventory
- **Variant Support**: Handle products with single or multiple variants
- **Discount System**: Apply percentage or flat rate discounts to products and variants
- **Drag & Drop**: Reorder products and variants with intuitive drag-and-drop interface
- **Search & Filter**: Real-time product search with API integration
- **Infinite Scroll**: Seamless pagination for large product catalogs

### Advanced Features

- **Product Picker Modal**: Interactive dialog for selecting products from your store
- **API Integration**: Connects to external product APIs with fallback support
- **Responsive Design**: Works seamlessly across different screen sizes with Tailwind CSS
- **Visual Feedback**: Smooth animations and clear interaction states
- **Error Handling**: Robust error handling with graceful fallbacks

### 🎨 Design & Styling

- **Tailwind CSS**: Utility-first CSS framework for rapid UI development
- **Custom Components**: Reusable component classes with Tailwind's @layer directive
- **Responsive Design**: Mobile-first approach with responsive breakpoints
- **Dark Mode Ready**: Built with Tailwind's design system for easy theme switching
- **Accessible**: Proper focus states and semantic HTML structure

## 🛠️ Installation

### Prerequisites

- Node.js (version 14 or higher)
- npm or yarn package manager

### Setup Instructions

1. **Clone the repository**

   ```bash
   git clone https://github.com/yourusername/ecommerce-product-manager.git
   cd ecommerce-product-manager
   ```

2. **Install dependencies**

   ```bash
   npm install
   # or
   yarn install
   ```

3. **Install Tailwind CSS** (if not already installed)

   ```bash
   npm install -D tailwindcss postcss autoprefixer
   npx tailwindcss init -p
   ```

4. **Start the development server**

   ```bash
   npm start
   # or
   yarn start
   ```

5. **Open your browser**
   Navigate to `http://localhost:3000` to view the application

## 🎨 Tailwind CSS Features

### Custom Components

The application uses Tailwind's `@layer` directive to create reusable component classes:

```css
@layer components {
  .drag-handle {
    @apply cursor-grab active:cursor-grabbing;
  }

  .product-card {
    @apply border border-gray-200 rounded-lg p-4 transition-all duration-200;
  }

  .btn-primary {
    @apply bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors duration-200;
  }
}
```

### Responsive Design

- Mobile-first approach with responsive breakpoints
- Flexible layouts using Tailwind's flexbox and grid utilities
- Responsive spacing and typography

### Custom Utilities

- Custom scrollbar styling for better UX
- Extended color palette for brand consistency
- Custom animations and transitions

## 🎯 Usage

### Adding Products

1. Click the "Add Product" button to create a new product slot
2. Click the edit icon to open the product picker
3. Search and select products from the available inventory
4. Apply discounts as needed

### Managing Variants

- Products with multiple variants show a "Show variants" button
- Expand variants to apply individual discounts
- Drag and drop variants to reorder them within a product

### Drag and Drop

- **Products**: Drag the grip handle to reorder products in the list
- **Variants**: When expanded, drag variants to reorder within their product
- Visual feedback shows valid drop zones during drag operations

### Discount System

- Choose between percentage (%) or flat rate ($) discounts
- Apply discounts at the product level or individual variant level
- Discounts can be different for each product and variant

## 🔧 API Integration

The application integrates with the Monk Commerce API:

**Endpoint**: `https://stageapi.monkcommerce.app/task/products/search`

**Parameters**:

- `search`: Search term for filtering products
- `page`: Page number for pagination
- `limit`: Number of products per page

**Features**:

- Real-time search with 300ms debouncing
- Scroll-based pagination for smooth user experience

### Building for Production

Tailwind automatically purges unused styles in production:

```bash
npm run build
```

This creates an optimized bundle with only the CSS classes actually used in your components.

## 🧪 Testing

Run the test suite:

```bash
npm test
# or
yarn test
```

## 📦 Building for Production

Create a production build:

```bash
npm run build
# or
yarn build
```

**Made with ❤️ for e-commerce store owners**
