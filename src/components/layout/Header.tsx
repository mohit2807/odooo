import { motion } from 'motion/react';
import { Search, ShoppingCart, Plus, User, Leaf, Menu, Shield } from 'lucide-react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { Badge } from '../ui/badge';
import { Sheet, SheetContent, SheetTrigger } from '../ui/sheet';
import { useAuthStore, useCartStore, useAppStore } from '../../lib/store';
import { supabase } from '../../utils/supabase/client';
import { toast } from 'sonner@2.0.3';

export function Header() {
  const { user, profile, isAdmin, setAdmin, setUser } = useAuthStore();
  const { items, toggleCart } = useCartStore();
  const { currentPage, setCurrentPage, searchQuery, setSearchQuery } = useAppStore();

  const cartItemCount = items.reduce((sum, item) => sum + item.quantity, 0);

  const handleSignOut = async () => {
    try {
      if (isAdmin) {
        // For admin users, just clear the admin state
        setAdmin(false);
        setUser(null);
        toast.success('Admin signed out successfully');
      } else {
        await supabase.auth.signOut();
        toast.success('Signed out successfully');
      }
    } catch (error) {
      console.error('Sign out error:', error);
      toast.error('Failed to sign out');
    }
  };

  const navItems = isAdmin ? [
    { id: 'admin', label: 'Admin Panel', icon: Shield },
    { id: 'feed', label: 'Browse', icon: Search },
  ] : [
    { id: 'feed', label: 'Browse', icon: Search },
    { id: 'sell', label: 'Sell', icon: Plus },
    { id: 'dashboard', label: 'Profile', icon: User },
  ];

  const NavigationItems = ({ mobile = false }: { mobile?: boolean }) => (
    <div className={`flex ${mobile ? 'flex-col space-y-4' : 'items-center space-x-2'}`}>
      {navItems.map((item) => {
        const Icon = item.icon;
        const isActive = currentPage === item.id;
        
        return (
          <motion.div key={item.id} whileTap={{ scale: 0.95 }}>
            <Button
              variant={isActive ? "default" : "ghost"}
              size={mobile ? "lg" : "sm"}
              onClick={() => setCurrentPage(item.id)}
              className={`${isActive 
                ? (item.id === 'admin' ? 'bg-red-600 hover:bg-red-700 text-white' : 'bg-green-600 hover:bg-green-700 text-white')
                : (item.id === 'admin' ? 'text-red-600 hover:text-red-700 hover:bg-red-50' : 'text-gray-600 hover:text-green-600 hover:bg-green-50')
              } ${mobile ? 'w-full justify-start' : ''}`}
            >
              <Icon className={`w-4 h-4 ${mobile ? 'mr-2' : ''}`} />
              {mobile && item.label}
            </Button>
          </motion.div>
        );
      })}
      
      {!isAdmin && (
        <motion.div whileTap={{ scale: 0.95 }}>
          <Button
            variant="ghost"
            size={mobile ? "lg" : "sm"}
            onClick={toggleCart}
            className={`relative text-gray-600 hover:text-green-600 hover:bg-green-50 ${mobile ? 'w-full justify-start' : ''}`}
          >
            <ShoppingCart className={`w-4 h-4 ${mobile ? 'mr-2' : ''}`} />
            {mobile && 'Cart'}
            {cartItemCount > 0 && (
              <Badge 
                variant="destructive" 
                className={`${mobile ? 'ml-auto' : 'absolute -top-2 -right-2'} bg-green-600 hover:bg-green-700 min-w-[20px] h-5 text-xs`}
              >
                {cartItemCount}
              </Badge>
            )}
          </Button>
        </motion.div>
      )}
    </div>
  );

  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className="sticky top-0 z-50 w-full border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60 shadow-sm"
    >
      <div className="container flex h-16 items-center justify-between px-4">
        {/* Logo */}
        <motion.div
          whileHover={{ scale: 1.05 }}
          className="flex items-center space-x-2 cursor-pointer"
          onClick={() => setCurrentPage('feed')}
        >
          <div className="w-8 h-8 bg-gradient-to-br from-green-500 to-emerald-600 rounded-lg flex items-center justify-center">
            <Leaf className="w-5 h-5 text-white" />
          </div>
          <span className="text-xl font-bold text-gray-800">EcoFinds</span>
        </motion.div>

        {/* Search Bar - Desktop */}
        {currentPage === 'feed' && (
          <div className="hidden md:flex flex-1 max-w-md mx-8">
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Search sustainable products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 h-10 bg-gray-50 border-gray-200 focus:bg-white focus:border-green-500"
              />
            </div>
          </div>
        )}

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center space-x-4">
          <NavigationItems />
          
          {/* User Avatar */}
          <div className="flex items-center space-x-2">
            <Avatar className="w-8 h-8">
              <AvatarImage src={profile?.avatar_url} />
              <AvatarFallback className="bg-green-100 text-green-700">
                {profile?.username?.[0]?.toUpperCase() || user?.email?.[0]?.toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={handleSignOut}
              className="text-gray-600 hover:text-red-600"
            >
              Sign Out
            </Button>
          </div>
        </div>

        {/* Mobile Menu */}
        <div className="md:hidden">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="sm">
                <Menu className="w-5 h-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-80">
              <div className="flex flex-col h-full">
                <div className="flex items-center space-x-3 pb-6 border-b">
                  <Avatar className="w-12 h-12">
                    <AvatarImage src={profile?.avatar_url} />
                    <AvatarFallback className="bg-green-100 text-green-700 text-lg">
                      {profile?.username?.[0]?.toUpperCase() || user?.email?.[0]?.toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium">{isAdmin ? 'Administrator' : profile?.username}</p>
                    <p className="text-sm text-gray-500">{user?.email}</p>
                  </div>
                </div>
                
                <div className="flex-1 py-6">
                  <NavigationItems mobile />
                </div>
                
                <div className="pt-6 border-t">
                  <Button 
                    variant="outline" 
                    className="w-full text-red-600 border-red-200 hover:bg-red-50"
                    onClick={handleSignOut}
                  >
                    Sign Out
                  </Button>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>

      {/* Mobile Search Bar */}
      {currentPage === 'feed' && (
        <div className="md:hidden px-4 pb-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 h-10 bg-gray-50 border-gray-200"
            />
          </div>
        </div>
      )}
    </motion.header>
  );
}