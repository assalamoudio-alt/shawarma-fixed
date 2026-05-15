import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { fetchUserOrders } from '../services/api';
import toast from 'react-hot-toast';

const statusLabel = {
  pending: { label: 'En attente', color: 'bg-yellow-100 text-yellow-800' },
  confirmed: { label: 'Confirmée', color: 'bg-blue-100 text-blue-800' },
  delivered: { label: 'Livrée', color: 'bg-green-100 text-green-800' },
  cancelled: { label: 'Annulée', color: 'bg-red-100 text-red-800' },
};

const OrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUserOrders()
      .then(data => { setOrders(data); setLoading(false); })
      .catch(() => { toast.error('Erreur lors du chargement des commandes'); setLoading(false); });
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-4 border-red-600"></div>
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="text-center py-16">
        <div className="text-6xl mb-4">📦</div>
        <h2 className="text-2xl font-bold mb-4">Aucune commande</h2>
        <p className="text-gray-600 mb-8">Vous n'avez pas encore passé de commande</p>
        <Link to="/menu" className="btn-primary inline-block">Commander maintenant</Link>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold mb-8">Mes commandes</h1>
      <div className="space-y-4">
        {orders.map(order => {
          const status = statusLabel[order.status] || statusLabel.pending;
          return (
            <div key={order.id} className="bg-white rounded-xl shadow-md p-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="font-bold text-lg">Commande #{order.id}</h3>
                  <p className="text-sm text-gray-500">{new Date(order.created_at).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' })}</p>
                </div>
                <span className={`px-3 py-1 rounded-full text-sm font-semibold ${status.color}`}>{status.label}</span>
              </div>
              {order.items && order.items[0] !== null && (
                <div className="space-y-1 mb-4">
                  {order.items.map((item, i) => (
                    <div key={i} className="flex justify-between text-sm text-gray-600">
                      <span>{item.name} x{item.quantity}</span>
                      <span>{(item.price * item.quantity).toFixed(2)}€</span>
                    </div>
                  ))}
                </div>
              )}
              <div className="border-t pt-3 flex justify-between font-bold">
                <span>Total</span>
                <span className="text-red-600">{Number(order.total_amount).toFixed(2)}€</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default OrdersPage;
