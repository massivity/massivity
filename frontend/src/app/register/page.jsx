'use client';
import { useState } from 'react';
import api from '@/utils/api';
import { useRouter } from 'next/navigation';
import Link from "next/link";

export default function RegisterPage() {
    const [form, setForm] = useState({
        nom: '',
        prenom: '',
        email: '',
        adresse: '',
        telephone: '',
        mot_de_passe: '',
    });

    const [erreur, setErreur] = useState('');
    const router = useRouter();

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await api.post('/auth/register', form);
            router.push('/login');
        } catch (err) {
            setErreur("Échec de l'inscription 😢");
            console.error(err);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500">
            <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md">
                <h2 className="text-3xl font-bold mb-6 text-center text-gray-800">📝 Inscription</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <input name="nom" value={form.nom} onChange={handleChange} placeholder="Nom"
                           className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600" required />

                    <input name="prenom" value={form.prenom} onChange={handleChange} placeholder="Prénom"
                           className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600" required />

                    <input type="email" name="email" value={form.email} onChange={handleChange} placeholder="Email"
                           className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600" required />

                    <input name="adresse" value={form.adresse} onChange={handleChange} placeholder="Adresse"
                           className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600" required />

                    <input type="tel" name="telephone" value={form.telephone} onChange={handleChange} placeholder="Téléphone"
                           className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600" required />

                    <input type="password" name="mot_de_passe" value={form.mot_de_passe} onChange={handleChange} placeholder="Mot de passe"
                           className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600" required />

                    {erreur && <p className="text-red-500 text-sm text-center">{erreur}</p>}

                    <button type="submit"
                            className="w-full bg-purple-600 hover:bg-purple-700 text-white py-2 rounded-lg transition duration-200">
                        S’inscrire
                    </button>
                </form>
                <p className="mt-4 text-sm text-center text-gray-500">
                    Déjà un compte ?{' '}
                    <Link href="/login" className="text-purple-600 font-medium hover:underline">
                        Connecte-toi
                    </Link>
                </p>
            </div>
        </div>
    );
}
