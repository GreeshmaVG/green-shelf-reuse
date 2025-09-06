import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useEcoFinds } from '@/contexts/EcoFindsContext';
import { useToast } from '@/hooks/use-toast';
import { ShoppingCart, Minus, Plus, Trash2, ArrowRight } from 'lucide-react';

const Cart: React.FC = () => {
  const { cart, removeFromCart, clearCart, completePurchase, addToCart } = useEcoFinds();
  const { toast } = useToast();
  const navigate = useNavigate();

  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const handleQuantityChange = (item: any, newQuantity: number) => {
    if (newQuantity === 0) {
      removeFromCart(item.id);
    } else if (newQuantity > item.quantity) {
      addToCart(item);
    } else {
      // For simplicity, we'll just remove one by removing and re-adding
      removeFromCart(item.id);
      if (newQuantity > 1) {
        for (let i = 0; i < newQuantity - 1; i++) {
          addToCart(item);
        }
      }
    }
  };

  const handleCompletePurchase = () => {
    completePurchase();
    toast({
      title: "Purchase Completed!",
      description: "Your items have been purchased successfully",
    });
    navigate('/purchases');
  };

  const handleClearCart = () => {
    if (window.confirm('Are you sure you want to clear your cart?')) {
      clearCart();
      toast({
        title: "Cart Cleared",
        description: "All items have been removed from your cart",
      });
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-6 pb-20 md:pb-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-foreground mb-2">Shopping Cart</h1>
          <p className="text-muted-foreground">
            {cart.length === 0 
              ? 'Your cart is empty' 
              : `${cart.length} ${cart.length === 1 ? 'item' : 'items'} in your cart`
            }
          </p>
        </div>
        {cart.length > 0 && (
          <Button 
            variant="outline" 
            onClick={handleClearCart}
            className="text-destructive hover:bg-destructive hover:text-destructive-foreground"
          >
            <Trash2 className="h-4 w-4 mr-2" />
            Clear Cart
          </Button>
        )}
      </div>

      {/* Empty Cart */}
      {cart.length === 0 ? (
        <div className="text-center py-12">
          <div className="w-24 h-24 bg-eco-secondary rounded-full flex items-center justify-center mx-auto mb-4">
            <ShoppingCart className="h-12 w-12 text-eco-primary" />
          </div>
          <h2 className="text-xl font-semibold text-foreground mb-2">Your cart is empty</h2>
          <p className="text-muted-foreground mb-6">
            Discover amazing second-hand products on EcoFinds
          </p>
          <Button asChild className="bg-eco-primary hover:bg-eco-primary-light">
            <Link to="/">
              Start Shopping
            </Link>
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {cart.map((item) => (
              <Card key={item.id}>
                <CardContent className="p-4">
                  <div className="flex gap-4">
                    {/* Product Image */}
                    <div className="w-20 h-20 bg-eco-secondary rounded-lg flex items-center justify-center flex-shrink-0">
                      <img
                        src={item.image || '/placeholder-image.svg'}
                        alt={item.title}
                        className="w-full h-full object-cover rounded-lg"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.style.display = 'none';
                          target.nextElementSibling?.classList.remove('hidden');
                        }}
                      />
                      <div className="hidden text-eco-primary text-lg font-bold">
                        {item.title.charAt(0).toUpperCase()}
                      </div>
                    </div>

                    {/* Product Details */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <Badge variant="outline" className="text-xs mb-1">
                            {item.category}
                          </Badge>
                          <h3 className="font-semibold text-foreground line-clamp-1">
                            {item.title}
                          </h3>
                          <p className="text-sm text-muted-foreground">
                            by {item.sellerName}
                          </p>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeFromCart(item.id)}
                          className="text-destructive hover:bg-destructive/10"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>

                      <div className="flex items-center justify-between">
                        {/* Quantity Controls */}
                        <div className="flex items-center space-x-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleQuantityChange(item, item.quantity - 1)}
                            className="h-8 w-8 p-0"
                          >
                            <Minus className="h-3 w-3" />
                          </Button>
                          <span className="w-8 text-center text-sm font-medium">
                            {item.quantity}
                          </span>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleQuantityChange(item, item.quantity + 1)}
                            className="h-8 w-8 p-0"
                          >
                            <Plus className="h-3 w-3" />
                          </Button>
                        </div>

                        {/* Price */}
                        <div className="text-right">
                          <div className="font-semibold text-eco-primary">
                            ${(item.price * item.quantity).toFixed(2)}
                          </div>
                          <div className="text-xs text-muted-foreground">
                            ${item.price} each
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <Card className="sticky top-6">
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold text-foreground mb-4">Order Summary</h3>
                
                <div className="space-y-3 mb-6">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">
                      Subtotal ({cart.reduce((sum, item) => sum + item.quantity, 0)} items)
                    </span>
                    <span className="font-medium">${total.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Shipping</span>
                    <span className="font-medium text-eco-success">Free</span>
                  </div>
                  <div className="border-t pt-3">
                    <div className="flex justify-between">
                      <span className="font-semibold text-foreground">Total</span>
                      <span className="font-bold text-lg text-eco-primary">${total.toFixed(2)}</span>
                    </div>
                  </div>
                </div>

                <Button
                  onClick={handleCompletePurchase}
                  className="w-full bg-eco-primary hover:bg-eco-primary-light mb-3"
                  size="lg"
                >
                  Complete Purchase
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>

                <Button asChild variant="outline" className="w-full">
                  <Link to="/">
                    Continue Shopping
                  </Link>
                </Button>

                <div className="mt-6 p-4 bg-eco-secondary/30 rounded-lg">
                  <h4 className="font-semibold text-foreground text-sm mb-2">
                    EcoFinds Promise
                  </h4>
                  <ul className="text-xs text-muted-foreground space-y-1">
                    <li>• Sustainable marketplace</li>
                    <li>• Quality second-hand goods</li>
                    <li>• Support circular economy</li>
                    <li>• Free shipping on all orders</li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      )}
    </div>
  );
};

export default Cart;