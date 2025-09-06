import React from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useEcoFinds } from '@/contexts/EcoFindsContext';
import { useAuth } from '@/contexts/AuthContext';
import { ArrowLeft, ShoppingCart, User, Calendar } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const ProductDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { products, addToCart } = useEcoFinds();
  const { toast } = useToast();

  const product = products.find(p => p.id === id);

  if (!product) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-12 text-center">
        <h1 className="text-2xl font-bold text-foreground mb-4">Product Not Found</h1>
        <p className="text-muted-foreground mb-6">The product you're looking for doesn't exist.</p>
        <Button onClick={() => navigate('/')} className="bg-eco-primary hover:bg-eco-primary-light">
          Back to Browse
        </Button>
      </div>
    );
  }

  const handleAddToCart = () => {
    if (user?.id === product.sellerId) {
      toast({
        title: "Cannot add own product",
        description: "You cannot add your own product to cart",
        variant: "destructive",
      });
      return;
    }

    addToCart(product);
    toast({
      title: "Added to cart!",
      description: `${product.title} has been added to your cart`,
    });
  };

  const isOwner = user?.id === product.sellerId;

  return (
    <div className="max-w-4xl mx-auto px-4 py-6 pb-20 md:pb-6">
      {/* Back Button */}
      <Button
        variant="ghost"
        onClick={() => navigate(-1)}
        className="mb-6 -ml-2"
      >
        <ArrowLeft className="h-4 w-4 mr-2" />
        Back
      </Button>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Product Image */}
        <div className="space-y-4">
          <Card className="overflow-hidden">
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
              <div className="hidden text-eco-primary text-6xl font-bold">
                {product.title.charAt(0).toUpperCase()}
              </div>
            </div>
          </Card>
        </div>

        {/* Product Details */}
        <div className="space-y-6">
          <div>
            <Badge variant="outline" className="mb-3">
              {product.category}
            </Badge>
            <h1 className="text-3xl font-bold text-foreground mb-4">
              {product.title}
            </h1>
            <div className="text-3xl font-bold text-eco-primary mb-4">
              ${product.price}
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <h3 className="font-semibold text-foreground mb-2">Description</h3>
              <p className="text-muted-foreground leading-relaxed">
                {product.description}
              </p>
            </div>

            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-eco-primary rounded-full flex items-center justify-center">
                    <User className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <p className="font-medium text-foreground">
                      {product.sellerName}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Seller
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="flex items-center text-sm text-muted-foreground">
              <Calendar className="h-4 w-4 mr-2" />
              Listed on {new Date(product.createdAt).toLocaleDateString()}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="space-y-3 pt-4">
            {isOwner ? (
              <div className="space-y-3">
                <Button
                  asChild
                  className="w-full bg-eco-primary hover:bg-eco-primary-light"
                >
                  <Link to={`/edit-product/${product.id}`}>
                    Edit Listing
                  </Link>
                </Button>
                <p className="text-sm text-muted-foreground text-center">
                  This is your listing
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                <Button
                  onClick={handleAddToCart}
                  className="w-full bg-eco-primary hover:bg-eco-primary-light"
                  size="lg"
                >
                  <ShoppingCart className="h-5 w-5 mr-2" />
                  Add to Cart
                </Button>
                <Button
                  asChild
                  variant="outline"
                  className="w-full"
                  size="lg"
                >
                  <Link to="/cart">
                    View Cart
                  </Link>
                </Button>
              </div>
            )}
          </div>

          {/* Product Stats */}
          <Card className="bg-eco-secondary/50">
            <CardContent className="pt-6">
              <h4 className="font-semibold text-foreground mb-3">Why Choose EcoFinds?</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>• Sustainable second-hand marketplace</li>
                <li>• Verified sellers and quality products</li>
                <li>• Reduce waste, save money</li>
                <li>• Support circular economy</li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;