import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { useEcoFinds } from '@/contexts/EcoFindsContext';
import { Leaf, Search, ShoppingCart, User, Package, LogOut, Plus } from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const { user, logout } = useAuth();
  const { cart } = useEcoFinds();
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/auth');
  };

  const cartItemCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <div className="min-h-screen bg-gradient-subtle">
      {/* Header */}
      <header className="bg-card border-b border-border shadow-card">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link to="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-eco rounded-lg flex items-center justify-center">
                <Leaf className="h-5 w-5 text-white" />
              </div>
              <span className="text-xl font-bold text-eco-primary">EcoFinds</span>
            </Link>

            {/* Navigation */}
            {user && (
              <nav className="hidden md:flex items-center space-x-6">
                <Link
                  to="/"
                  className={`text-sm font-medium transition-colors hover:text-eco-primary ${
                    location.pathname === '/' ? 'text-eco-primary' : 'text-muted-foreground'
                  }`}
                >
                  Browse
                </Link>
                <Link
                  to="/my-listings"
                  className={`text-sm font-medium transition-colors hover:text-eco-primary ${
                    location.pathname === '/my-listings' ? 'text-eco-primary' : 'text-muted-foreground'
                  }`}
                >
                  My Listings
                </Link>
                <Link
                  to="/purchases"
                  className={`text-sm font-medium transition-colors hover:text-eco-primary ${
                    location.pathname === '/purchases' ? 'text-eco-primary' : 'text-muted-foreground'
                  }`}
                >
                  Purchases
                </Link>
              </nav>
            )}

            {/* Right side actions */}
            {user ? (
              <div className="flex items-center space-x-3">
                <Button
                  asChild
                  size="sm"
                  className="bg-eco-primary hover:bg-eco-primary-light text-white"
                >
                  <Link to="/add-product">
                    <Plus className="h-4 w-4 mr-2" />
                    Add Product
                  </Link>
                </Button>
                
                <Button asChild variant="outline" size="sm" className="relative">
                  <Link to="/cart">
                    <ShoppingCart className="h-4 w-4" />
                    {cartItemCount > 0 && (
                      <span className="absolute -top-2 -right-2 bg-eco-success text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                        {cartItemCount}
                      </span>
                    )}
                  </Link>
                </Button>

                <Button asChild variant="ghost" size="sm">
                  <Link to="/profile">
                    <User className="h-4 w-4 mr-2" />
                    Profile
                  </Link>
                </Button>

                <Button variant="ghost" size="sm" onClick={handleLogout}>
                  <LogOut className="h-4 w-4" />
                </Button>
              </div>
            ) : (
              <Button asChild className="bg-eco-primary hover:bg-eco-primary-light">
                <Link to="/auth">Sign In</Link>
              </Button>
            )}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1">
        {children}
      </main>

      {/* Mobile Navigation */}
      {user && (
        <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-card border-t border-border shadow-elevated">
          <div className="flex items-center justify-around py-2">
            <Link
              to="/"
              className={`flex flex-col items-center py-2 px-4 text-xs ${
                location.pathname === '/' ? 'text-eco-primary' : 'text-muted-foreground'
              }`}
            >
              <Search className="h-5 w-5 mb-1" />
              Browse
            </Link>
            <Link
              to="/my-listings"
              className={`flex flex-col items-center py-2 px-4 text-xs ${
                location.pathname === '/my-listings' ? 'text-eco-primary' : 'text-muted-foreground'
              }`}
            >
              <Package className="h-5 w-5 mb-1" />
              Listings
            </Link>
            <Link
              to="/add-product"
              className="flex flex-col items-center py-2 px-4 text-xs text-eco-primary"
            >
              <div className="bg-eco-primary text-white rounded-full p-2 mb-1">
                <Plus className="h-4 w-4" />
              </div>
              Add
            </Link>
            <Link
              to="/cart"
              className={`flex flex-col items-center py-2 px-4 text-xs relative ${
                location.pathname === '/cart' ? 'text-eco-primary' : 'text-muted-foreground'
              }`}
            >
              <ShoppingCart className="h-5 w-5 mb-1" />
              Cart
              {cartItemCount > 0 && (
                <span className="absolute top-0 right-2 bg-eco-success text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
                  {cartItemCount}
                </span>
              )}
            </Link>
            <Link
              to="/profile"
              className={`flex flex-col items-center py-2 px-4 text-xs ${
                location.pathname === '/profile' ? 'text-eco-primary' : 'text-muted-foreground'
              }`}
            >
              <User className="h-5 w-5 mb-1" />
              Profile
            </Link>
          </div>
        </nav>
      )}
    </div>
  );
};

export default Layout;