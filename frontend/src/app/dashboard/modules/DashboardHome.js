'use client';
import { useEffect, useState } from 'react';
import api from '../../../utils/api';

export default function DashboardHome({ user }) {
    const [changelogs, setChangelogs] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchChangelogs = async () => {
            try {
                const res = await api.get('/changelog');
                setChangelogs([...res.data].sort((a, b) => new Date(b.date) - new Date(a.date)));
            } catch {
                setChangelogs([]);
            } finally {
                setLoading(false);
            }
        };
        fetchChangelogs();
    }, []);

    return (
        <section>
            <h1 className="text-3xl font-bold text-gray-800 mb-4">
                Bienvenue sur le dashboard, {user?.prenom} !
            </h1>
            <p className="text-gray-700 mb-8">
                Choisis une section dans le menu de gauche pour commencer.
            </p>

            <div>
                <h2 className="text-xl font-semibold text-purple-700 mb-3">📝 Historique des changements</h2>
                {loading ? (
                    <div className="text-gray-400">Chargement du changelog...</div>
                ) : changelogs.length === 0 ? (
                    <div className="text-gray-400">Aucun changement trouvé.</div>
                ) : (
                    <ul className="space-y-3 max-h-[60vh] overflow-auto pr-2">
                        {changelogs.map((change) => (
                            <li key={change.id} className="p-4 bg-purple-50 rounded-xl shadow">
                                <div className="font-semibold text-gray-800 mb-1">{change.titre}</div>
                                <div className="text-gray-600 text-sm">{change.description}</div>
                                <div className="text-xs text-gray-400 mt-2">
                                    {change.date
                                        ? new Date(change.date).toLocaleString('fr-FR', { dateStyle: 'short', timeStyle: 'short' })
                                        : ''}
                                </div>
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        </section>
    );
}
