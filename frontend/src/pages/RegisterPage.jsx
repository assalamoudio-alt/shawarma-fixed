import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { EnvelopeIcon, LockClosedIcon, UserIcon, PhoneIcon } from '@heroicons/react/24/outline';
import { register } from '../services/api';
import toast from 'react-hot-toast';

const RegisterPage = () => {
  const [formData, setFormData] = useState({ name: '', email: '', phone: '', password: '', confirmPassword: '' });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      toast.error('Les mots de passe ne correspondent pas');
      return;
    }

    setLoading(true);
    try {
      await register({ name: formData.name, email: formData.email, phone: formData.phone, password: formData.password });
      toast.success('Compte créé ! Vous pouvez vous connecter.');
      navigate('/login');
    } catch (err) {
      toast.error(err.response?.data?.error || 'Erreur lors de l\'inscription');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md w-full bg-white rounded-xl shadow-xl p-8"
      >
        <div className="text-center mb-8">
          <div className="text-5xl mb-4">🥙</div>
          <h2 className="text-2xl font-bold">Créer un compte</h2>
          <p className="text-gray-600 mt-2">Rejoignez ShawarmaMaster</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-gray-700 mb-2">Nom complet</label>
            <div className="relative">
              <UserIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input type="text" name="name" value={formData.name} onChange={handleChange} className="input pl-10" placeholder="Jean Dupont" required />
            </div>
          </div>
          <div>
            <label className="block text-gray-700 mb-2">Email</label>
            <div className="relative">
              <EnvelopeIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input type="email" name="email" value={formData.email} onChange={handleChange} className="input pl-10" placeholder="vous@exemple.com" required />
            </div>
          </div>
          <div>
            <label className="block text-gray-700 mb-2">Téléphone</label>
            <div className="relative">
              <PhoneIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input type="tel" name="phone" value={formData.phone} onChange={handleChange} className="input pl-10" placeholder="06 12 34 56 78" />
            </div>
          </div>
          <div>
            <label className="block text-gray-700 mb-2">Mot de passe</label>
            <div className="relative">
              <LockClosedIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input type="password" name="password" value={formData.password} onChange={handleChange} className="input pl-10" placeholder="••••••••" required minLength={6} />
            </div>
          </div>
          <div>
            <label className="block text-gray-700 mb-2">Confirmer le mot de passe</label>
            <div className="relative">
              <LockClosedIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input type="password" name="confirmPassword" value={formData.confirmPassword} onChange={handleChange} className="input pl-10" placeholder="••••••••" required />
            </div>
          </div>

          <button type="submit" disabled={loading} className="w-full btn-primary disabled:opacity-50 mt-2">
            {loading ? 'Création du compte...' : 'Créer mon compte'}
          </button>
        </form>

        <p className="text-center mt-6 text-gray-600">
          Déjà un compte ?{' '}
          <Link to="/login" className="text-red-600 hover:underline font-semibold">Se connecter</Link>
        </p>
      </motion.div>
    </div>
  );
};

export default RegisterPage;
