import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCartStore } from '../stores/cartStore';
import { createOrder } from '../services/api';
import toast from 'react-hot-toast';

const CheckoutPage = () => {
  const { items, getTotalPrice, clearCart } = useCartStore();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    postalCode: '',
    paymentMethod: 'card'
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const subtotal = getTotalPrice();
  const deliveryFee = 2.50;
  const total = subtotal + deliveryFee;

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (items.length === 0) {
      toast.error('Votre panier est vide');
      return;
    }

    setIsSubmitting(true);

    try {
      await createOrder({
        items: items.map(item => ({
          id: item.id,
          quantity: item.quantity,
          price: item.price
        })),
        delivery_address: `${formData.address}, ${formData.postalCode} ${formData.city}`,
        payment_method: formData.paymentMethod
      });

      toast.success('Commande passée avec succès ! 🎉');
      clearCart();
      navigate('/orders');
    } catch (err) {
      toast.error(err.response?.data?.error || 'Erreur lors de la commande');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-6xl mb-4">🛒</div>
        <p className="text-gray-600 mb-4">Votre panier est vide</p>
        <Link to="/menu" className="btn-primary inline-block">Voir le menu</Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-8">Finaliser la commande</h1>

      <form onSubmit={handleSubmit} className="space-y-8">
        <div className="bg-white rounded-xl shadow-md p-6">
          <h2 className="text-xl font-bold mb-4">Informations de livraison</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-gray-700 mb-2">Nom complet *</label>
              <input type="text" name="fullName" required value={formData.fullName} onChange={handleChange} className="input" placeholder="Jean Dupont" />
            </div>
            <div>
              <label className="block text-gray-700 mb-2">Email *</label>
              <input type="email" name="email" required value={formData.email} onChange={handleChange} className="input" placeholder="jean@example.com" />
            </div>
            <div>
              <label className="block text-gray-700 mb-2">Téléphone *</label>
              <input type="tel" name="phone" required value={formData.phone} onChange={handleChange} className="input" placeholder="06 12 34 56 78" />
            </div>
            <div>
              <label className="block text-gray-700 mb-2">Code postal</label>
              <input type="text" name="postalCode" value={formData.postalCode} onChange={handleChange} className="input" placeholder="75001" />
            </div>
            <div className="md:col-span-2">
              <label className="block text-gray-700 mb-2">Adresse *</label>
              <input type="text" name="address" required value={formData.address} onChange={handleChange} className="input" placeholder="123 rue de Paris" />
            </div>
            <div className="md:col-span-2">
              <label className="block text-gray-700 mb-2">Ville *</label>
              <input type="text" name="city" required value={formData.city} onChange={handleChange} className="input" placeholder="Paris" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-md p-6">
          <h2 className="text-xl font-bold mb-4">Récapitulatif</h2>
          <div className="space-y-3">
            {items.map((item) => (
              <div key={item.id} className="flex justify-between py-2">
                <span>{item.name} x{item.quantity}</span>
                <span>{(item.price * item.quantity).toFixed(2)}€</span>
              </div>
            ))}
            <div className="border-t pt-3 space-y-2">
              <div className="flex justify-between"><span>Sous-total</span><span>{subtotal.toFixed(2)}€</span></div>
              <div className="flex justify-between"><span>Livraison</span><span>{deliveryFee.toFixed(2)}€</span></div>
              <div className="flex justify-between font-bold text-lg pt-2 border-t">
                <span>Total</span>
                <span className="text-red-600">{total.toFixed(2)}€</span>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-md p-6">
          <h2 className="text-xl font-bold mb-4">Mode de paiement</h2>
          <div className="space-y-3">
            <label className="flex items-center p-3 border rounded-lg cursor-pointer hover:bg-gray-50">
              <input type="radio" name="paymentMethod" value="card" checked={formData.paymentMethod === 'card'} onChange={handleChange} className="mr-3" />
              <div>
                <span className="font-semibold">💳 Carte bancaire</span>
                <p className="text-sm text-gray-500">Paiement sécurisé en ligne</p>
              </div>
            </label>
            <label className="flex items-center p-3 border rounded-lg cursor-pointer hover:bg-gray-50">
              <input type="radio" name="paymentMethod" value="cash" checked={formData.paymentMethod === 'cash'} onChange={handleChange} className="mr-3" />
              <div>
                <span className="font-semibold">💰 Paiement à la livraison</span>
                <p className="text-sm text-gray-500">Payez en espèces au livreur</p>
              </div>
            </label>
          </div>
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full btn-primary py-4 text-lg disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting ? (
            <span className="flex items-center justify-center gap-2">
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
              Traitement en cours...
            </span>
          ) : (
            `Confirmer la commande (${total.toFixed(2)}€)`
          )}
        </button>
      </form>
    </div>
  );
};

export default CheckoutPage;
