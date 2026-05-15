import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ClockIcon, TruckIcon, CreditCardIcon, StarIcon } from '@heroicons/react/24/outline';

const HomePage = () => {
  const features = [
    { icon: <TruckIcon className="h-12 w-12" />, title: 'Livraison rapide', desc: 'En 30 minutes chrono' },
    { icon: <ClockIcon className="h-12 w-12" />, title: 'Préparation fraîche', desc: 'Ingrédients du jour' },
    { icon: <CreditCardIcon className="h-12 w-12" />, title: 'Paiement sécurisé', desc: 'CB, PayPal, espèces' },
  ];

  return (
    <div>
      {/* Hero Section */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative bg-gradient-to-r from-red-600 to-red-800 rounded-2xl overflow-hidden mb-12"
      >
        <div className="absolute inset-0 bg-black opacity-20"></div>
        <div className="relative p-8 md:p-12 text-center text-white">
          <motion.h1 
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2 }}
            className="text-4xl md:text-6xl font-bold mb-4"
          >
            Le meilleur Shawarma
          </motion.h1>
          <p className="text-lg md:text-xl mb-6 max-w-2xl mx-auto">
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/menu" className="bg-yellow-400 text-red-600 px-8 py-3 rounded-lg font-bold hover:bg-yellow-500 transition-all transform hover:scale-105">
              Commander maintenant
            </Link>
            <Link to="/menu" className="bg-white text-red-600 px-8 py-3 rounded-lg font-bold hover:bg-gray-100 transition-all">
              Voir le menu
            </Link>
          </div>
        </div>
      </motion.div>

      {/* Features */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
        {features.map((feature, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white p-6 rounded-xl shadow-md text-center hover:shadow-xl transition-all"
          >
            <div className="text-red-600 flex justify-center mb-4">{feature.icon}</div>
            <h3 className="font-bold text-lg mb-2">{feature.title}</h3>
            <p className="text-gray-600">{feature.desc}</p>
          </motion.div>
        ))}
      </div>

      {/* Popular Items */}
      <div className="mb-12">
        <h2 className="text-2xl md:text-3xl font-bold text-center mb-8">Nos plats les plus populaires</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            { name: 'Shawarma Poulet', price: '7.99€', icon: '🍗', popular: true },
            { name: 'Shawarma Boeuf', price: '8.99€', icon: '🥩', popular: true },
            { name: 'Shawarma Mixte', price: '11.99€', icon: '🍖', popular: true },
            { name: 'Falafel', price: '6.99€', icon: '🧆', popular: false },
          ].map((item, idx) => (
            <motion.div
              key={idx}
              whileHover={{ scale: 1.05 }}
              className="bg-white rounded-xl shadow-md overflow-hidden"
            >
              <div className="h-40 bg-gradient-to-r from-red-400 to-red-600 flex items-center justify-center">
                <span className="text-6xl">{item.icon}</span>
              </div>
              <div className="p-4 text-center">
                <h3 className="font-bold text-lg">{item.name}</h3>
                <p className="text-red-600 font-bold mt-2">{item.price}</p>
                {item.popular && (
                  <div className="flex items-center justify-center gap-1 mt-2 text-yellow-500">
                    <StarIcon className="h-4 w-4 fill-current" />
                    <StarIcon className="h-4 w-4 fill-current" />
                    <StarIcon className="h-4 w-4 fill-current" />
                    <StarIcon className="h-4 w-4 fill-current" />
                    <StarIcon className="h-4 w-4" />
                  </div>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default HomePage;
