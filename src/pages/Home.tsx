import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useEcoFinds } from '@/contexts/EcoFindsContext';
import { Search, Filter, ShoppingCart, Heart } from 'lucide-react';

const Home: React.FC = () => {
  const {
    categories,
    searchTerm,
    selectedCategory,
    setSearchTerm,
    setSelectedCategory,
    getFilteredProducts,
    addToCart,
  } = useEcoFinds();

  const products = getFilteredProducts();

  const handleAddToCart = (product: any) => {
    addToCart(product);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-6 pb-20 md:pb-6">
      {/* Search and Filter Section */}
      <div className="mb-8">
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Search for eco-friendly products..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <div className="flex items-center space-x-2 min-w-fit">
            <Filter className="h-4 w-4 text-muted-foreground" />
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-3 py-2 border border-input rounded-md bg-background text-sm"
            >
              {categories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Category Pills */}
        <div className="flex flex-wrap gap-2">
          {categories.map((category) => (
            <Badge
              key={category}
              variant={selectedCategory === category ? "default" : "outline"}
              className={`cursor-pointer transition-colors ${
                selectedCategory === category
                  ? 'bg-eco-primary hover:bg-eco-primary-light text-white'
                  : 'hover:bg-eco-secondary'
              }`}
              onClick={() => setSelectedCategory(category)}
            >
              {category}
            </Badge>
          ))}
        </div>
      </div>

      {/* Results Summary */}
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-foreground mb-2">
          {selectedCategory === 'All' ? 'All Products' : selectedCategory}
        </h2>
        <p className="text-muted-foreground">
          {products.length} {products.length === 1 ? 'product' : 'products'} found
        </p>
      </div>

      {/* Products Grid */}
      {products.length === 0 ? (
        <div className="text-center py-12">
          <div className="w-24 h-24 bg-eco-secondary rounded-full flex items-center justify-center mx-auto mb-4">
            <Search className="h-12 w-12 text-eco-primary" />
          </div>
          <h3 className="text-xl font-semibold text-foreground mb-2">No products found</h3>
          <p className="text-muted-foreground mb-6">
            {searchTerm || selectedCategory !== 'All'
              ? 'Try adjusting your search or filters'
              : 'Be the first to list a product!'}
          </p>
          <Button asChild className="bg-eco-primary hover:bg-eco-primary-light">
            <Link to="/add-product">Add Your First Product</Link>
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {products.map((product) => (
            <Card key={product.id} className="overflow-hidden hover:shadow-elevated transition-all duration-300 group">
              <div className="relative">
                <div className="aspect-square bg-eco-secondary flex items-center justify-center">
                  <img
                    src={product.image || '/placeholder-image.svg'}
                    alt={product.title}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.style.display = 'none';
                      target.nextElementSibling?.classList.remove('hidden');
                    }}
                  />
                  <div className="hidden text-eco-primary text-4xl font-bold">
                    {product.title.charAt(0).toUpperCase()}
                  </div>
                </div>
                <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Button size="sm" variant="secondary" className="bg-white/90 hover:bg-white">
                    <Heart className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              
              <CardContent className="p-4">
                <div className="mb-3">
                  <Badge variant="outline" className="text-xs mb-2">
                    {product.category}
                  </Badge>
                  <h3 className="font-semibold text-foreground line-clamp-1 mb-1">
                    {product.title}
                  </h3>
                  <p className="text-sm text-muted-foreground line-clamp-2 mb-2">
                    {product.description}
                  </p>
                  <div className="flex items-center justify-between">
                    <span className="text-lg font-bold text-eco-primary">
                      ${product.price}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      by {product.sellerName}
                    </span>
                  </div>
                </div>
                
                <div className="flex gap-2">
                  <Button
                    asChild
                    variant="outline"
                    size="sm"
                    className="flex-1"
                  >
                    <Link to={`/product/${product.id}`}>
                      View Details
                    </Link>
                  </Button>
                  <Button
                    onClick={() => handleAddToCart(product)}
                    size="sm"
                    className="bg-eco-primary hover:bg-eco-primary-light"
                  >
                    <ShoppingCart className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default Home;