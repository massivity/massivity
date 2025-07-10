'use client';
import { useEffect, useState } from 'react';
import api from '@/utils/api';
import { useRouter } from 'next/navigation';

export default function ProfilPage() {
    const [user, setUser] = useState(null);
    const [erreur, setErreur] = useState('');
    const [chargement, setChargement] = useState(true);
    const router = useRouter();

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const token = localStorage.getItem('accessToken');
                if (!token) {
                    router.push('/login');
                    return;
                }

                const res = await api.get('/profile', {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });

                setUser(res.data);
            } catch (err) {
                console.error("Erreur dans /profile :", err);

                // Si c’est une réponse HTTP, affiche les détails
                if (err.response) {
                    console.error("Status:", err.response.status);
                    console.error("Data:", err.response.data);
                    setErreur(`Erreur ${err.response.status} : ${err.response.data.message || 'Erreur inconnue'}`);
                } else {
                    setErreur("Impossible de charger le profil 😢");
                }

        } finally {
                setChargement(false);
            }
        };

        fetchUser();
    }, [router]);

    const SkeletonLine = () => (
        <div className="h-4 bg-gray-200 rounded w-full animate-pulse"></div>
    );

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500">
            <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md">
                <h2 className="text-3xl font-bold mb-6 text-center text-gray-800">👤 Mon profil</h2>

                {erreur && (
                    <p className="text-red-500 text-sm text-center mb-4">{erreur}</p>
                )}

                {chargement ? (
                    <div className="space-y-4">
                        <SkeletonLine />
                        <SkeletonLine />
                        <SkeletonLine />
                        <SkeletonLine />
                        <div className="h-10 bg-gray-300 rounded animate-pulse mt-6"></div>
                    </div>
                ) : user ? (
                    <div className="space-y-4">
                        <div>
                            <span className="font-medium text-gray-700">Nom :</span> {user.name}
                        </div>
                        <div>
                            <span className="font-medium text-gray-700">Email :</span> {user.email}
                        </div>
                        <div>
                            <span className="font-medium text-gray-700">Rôle :</span> {user.role}
                        </div>
                        <div>
                            <span className="font-medium text-gray-700">Inscrit le :</span>{' '}
                            {new Date(user.createdAt).toLocaleDateString()}
                        </div>
                        <button
                            onClick={() => {
                                localStorage.removeItem('accessToken');
                                router.push('/login');
                            }}
                            className="w-full bg-purple-600 hover:bg-purple-700 text-white py-2 rounded-lg transition duration-200 mt-6"
                        >
                            Se déconnecter
                        </button>
                    </div>
                ) : null}
            </div>
        </div>
    );
}
