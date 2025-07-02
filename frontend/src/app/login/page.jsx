'use client';
import { useState } from 'react';
import api from '@/utils/api';
import { useRouter } from 'next/navigation';
import Link from "next/link";

export default function LoginPage() {
    const [email, setEmail] = useState('');
    const [mot_de_passe, setMotDePasse] = useState('');
    const [erreur, setErreur] = useState('');
    const router = useRouter();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await api.post('/auth/login', {
                email,
                mot_de_passe,
            });

            localStorage.setItem('accessToken', res.data.accessToken);
            router.push('/profil');
        } catch (err) {
            setErreur("Échec de la connexion 😢");
            console.error(err);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500">
            <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md">
                <h2 className="text-3xl font-bold mb-6 text-center text-gray-800">🔐 Connexion</h2>
                <form onSubmit={handleSubmit} className="space-y-5">
                    <div>
                        <label className="block mb-1 text-sm font-medium text-gray-700">Adresse e-mail</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600"
                            placeholder="exemple@email.com"
                            required
                        />
                    </div>
                    <div>
                        <label className="block mb-1 text-sm font-medium text-gray-700">Mot de passe</label>
                        <input
                            type="password"
                            value={mot_de_passe}
                            onChange={(e) => setMotDePasse(e.target.value)}
                            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600"
                            placeholder="••••••••"
                            required
                        />
                    </div>
                    {erreur && (
                        <p className="text-red-500 text-sm text-center">{erreur}</p>
                    )}
                    <button
                        type="submit"
                        className="w-full bg-purple-600 hover:bg-purple-700 text-white py-2 rounded-lg transition duration-200"
                    >
                        Se connecter
                    </button>
                </form>
                <p className="mt-4 text-sm text-center text-gray-500">
                    Pas encore de compte ?{' '}
                    <Link href="/register" className="text-purple-600 font-medium hover:underline">
                        Inscris-toi
                    </Link>
                </p>
            </div>
        </div>
    );
}
