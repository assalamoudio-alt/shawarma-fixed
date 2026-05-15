import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShoppingCartIcon, UserIcon, Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline';
import { useCartStore } from '../stores/cartStore';

const Navbar = () => {
  const { getTotalItems } = useCartStore();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();
  const isAuthenticated = localStorage.getItem('token') !== null;

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
    window.location.reload();
  };

  return (
    <nav className="bg-red-600 text-white shadow-lg sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="text-2xl font-bold flex items-center gap-2">
            <span className="text-3xl">🥙</span>
            <span className="hidden sm:inline">ShawarmaMaster</span>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-8">
            <Link to="/" className="hover:text-red-200 transition-colors">Accueil</Link>
            <Link to="/menu" className="hover:text-red-200 transition-colors">Menu</Link>
            {isAuthenticated && (
              <Link to="/orders" className="hover:text-red-200 transition-colors">Mes commandes</Link>
            )}
            
            {/* Cart Icon */}
            <Link to="/cart" className="relative hover:text-red-200 transition-colors">
              <ShoppingCartIcon className="h-6 w-6" />
              {getTotalItems() > 0 && (
                <span className="absolute -top-2 -right-2 bg-yellow-400 text-red-600 rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold animate-bounce">
                  {getTotalItems()}
                </span>
              )}
            </Link>

            {/* Auth buttons */}
            {isAuthenticated ? (
              <button onClick={handleLogout} className="hover:text-red-200 transition-colors">
                Déconnexion
              </button>
            ) : (
              <Link to="/login" className="hover:text-red-200 transition-colors">
                <UserIcon className="h-6 w-6" />
              </Link>
            )}
          </div>

          {/* Mobile menu button */}
          <button
            className="md:hidden p-2 rounded-lg hover:bg-red-700 transition-colors"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <XMarkIcon className="h-6 w-6" /> : <Bars3Icon className="h-6 w-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-red-500">
            <div className="flex flex-col gap-4">
              <Link to="/" className="hover:text-red-200" onClick={() => setIsMenuOpen(false)}>Accueil</Link>
              <Link to="/menu" className="hover:text-red-200" onClick={() => setIsMenuOpen(false)}>Menu</Link>
              {isAuthenticated && (
                <Link to="/orders" className="hover:text-red-200" onClick={() => setIsMenuOpen(false)}>Mes commandes</Link>
              )}
              <Link to="/cart" className="hover:text-red-200 flex items-center gap-2" onClick={() => setIsMenuOpen(false)}>
                Panier <span className="bg-yellow-400 text-red-600 rounded-full px-2 py-0.5 text-xs">{getTotalItems()}</span>
              </Link>
              {isAuthenticated ? (
                <button onClick={() => { handleLogout(); setIsMenuOpen(false); }} className="text-left hover:text-red-200">
                  Déconnexion
                </button>
              ) : (
                <Link to="/login" className="hover:text-red-200" onClick={() => setIsMenuOpen(false)}>Connexion</Link>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
