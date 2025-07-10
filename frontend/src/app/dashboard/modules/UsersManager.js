'use client';
import { useEffect, useState } from 'react';
import { UserIcon, ShieldCheckIcon, ArrowUpTrayIcon } from '@heroicons/react/24/outline';
import api from '@/utils/api';

export default function UsersManager() {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [promoting, setPromoting] = useState({});
    const [error, setError] = useState(null);

    // Fetch users à chaque affichage du module
    useEffect(() => {
        const fetchUsers = async () => {
            setLoading(true);
            setError(null);
            try {
                const token = localStorage.getItem('accessToken');
                const res = await api.get('/admin/users', {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setUsers(res.data.users || []);
            } catch (err) {
                setError("Erreur lors du chargement des utilisateurs.");
                setUsers([]);
            } finally {
                setLoading(false);
            }
        };
        fetchUsers();
    }, []);

    // Promote/demote user (PATCH /api/admin/promote/:userId)
    const promoteUser = async (userId, toRole) => {
        setPromoting(prev => ({ ...prev, [userId]: true }));
        setError(null);
        try {
            const token = localStorage.getItem('accessToken');
            await api.patch(`/admin/promote/${userId}`, { role: toRole }, {
                headers: { Authorization: `Bearer ${token}` }
            });
            // MAJ locale après succès
            setUsers(users =>
                users.map(u =>
                    u.id === userId ? { ...u, role: toRole } : u
                )
            );
        } catch (err) {
            setError("Impossible de modifier ce rôle.");
        } finally {
            setPromoting(prev => ({ ...prev, [userId]: false }));
        }
    };

    return (
        <section>
            <h1 className="text-2xl font-semibold text-purple-700 mb-4 flex items-center gap-2">
                <UserIcon className="w-7 h-7" /> Gestion des utilisateurs
            </h1>
            {error && (
                <div className="text-red-500 text-sm mb-4">{error}</div>
            )}
            {loading ? (
                <div className="mt-6 text-gray-500">Chargement...</div>
            ) : (
                <ul className="mt-6 space-y-2">
                    {users.length === 0 ? (
                        <li className="text-gray-400">Aucun utilisateur trouvé.</li>
                    ) : users.map(u => (
                        <li
                            key={u.id}
                            className="p-4 bg-purple-50 rounded-xl shadow flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2"
                        >
                            <div>
                                <span className="font-medium">{u.prenom} {u.nom}</span>
                                <span className={`ml-2 px-2 py-1 rounded text-xs font-bold ${
                                    u.role === 'admin'
                                        ? 'bg-purple-200 text-purple-700'
                                        : 'bg-gray-200 text-gray-600'
                                }`}>
                                    {u.role}
                                </span>
                                <span className="ml-2 text-gray-400 text-xs">ID: {u.id}</span>
                            </div>
                            <div className="flex items-center gap-4">
                                <span className="text-sm text-gray-500">{u.email}</span>
                                {u.role === 'user' ? (
                                    <button
                                        onClick={() => promoteUser(u.id, 'admin')}
                                        disabled={promoting[u.id]}
                                        className="ml-3 flex items-center gap-1 px-3 py-1 bg-purple-600 hover:bg-purple-700 text-white rounded transition disabled:opacity-60 disabled:cursor-not-allowed"
                                        title="Promouvoir admin"
                                    >
                                        <ShieldCheckIcon className="w-5 h-5" />
                                        Promouvoir
                                    </button>
                                ) : (
                                    <button
                                        onClick={() => promoteUser(u.id, 'user')}
                                        disabled={promoting[u.id]}
                                        className="ml-3 flex items-center gap-1 px-3 py-1 bg-gray-300 hover:bg-gray-400 text-gray-700 rounded transition disabled:opacity-60 disabled:cursor-not-allowed"
                                        title="Rétrograder utilisateur"
                                    >
                                        <ArrowUpTrayIcon className="w-5 h-5 rotate-180" />
                                        Rétrograder
                                    </button>
                                )}
                            </div>
                        </li>
                    ))}
                </ul>
            )}
        </section>
    );
}
