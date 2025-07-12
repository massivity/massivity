'use client';
import { useEffect, useState } from 'react';
import api from '../../../utils/api';

const CONCURRENT_COLORS = {
    Avis: "bg-blue-100 text-blue-700",
    Europcar: "bg-green-100 text-green-700",
    Sixt: "bg-orange-100 text-orange-700",
    "Rent A Car": "bg-red-100 text-red-700",
    Ada: "bg-purple-100 text-purple-700",
};

export default function DashboardHome({ user }) {
    const [changelogs, setChangelogs] = useState([]);
    const [loading, setLoading] = useState(true);

    // --- AJOUT STATS ---
    const [agencyStats, setAgencyStats] = useState({
        totalActive: 0,
        byConcurrent: {},
    });
    const [statsLoading, setStatsLoading] = useState(true);

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

        // FETCH STATS
        const fetchStats = async () => {
            try {
                setStatsLoading(true);
                const token = typeof window !== "undefined" ? localStorage.getItem('accessToken') : null;
                const res = await api.get('/scrapping/agencies/stats', {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setAgencyStats(res.data);
            } catch {
                setAgencyStats({ totalActive: 0, byConcurrent: {} });
            } finally {
                setStatsLoading(false);
            }
        };
        fetchStats();
    }, []);

    return (
        <section>
            <h1 className="text-3xl font-bold text-gray-800 mb-4">
                Bienvenue sur le dashboard, {user?.prenom} !
            </h1>
            <p className="text-gray-700 mb-8">
                Choisis une section dans le menu de gauche pour commencer.
            </p>

            {/* ---- STATS ---- */}
            <div className="mb-10">
                <h2 className="text-xl font-semibold text-purple-700 mb-4">📊 Statistiques des agences</h2>
                {statsLoading ? (
                    <div className="text-gray-400">Chargement des stats...</div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        <div className="bg-white shadow rounded-xl p-6 flex flex-col items-center">
                            <span className="text-3xl font-bold text-green-700">{agencyStats.totalActive}</span>
                            <span className="mt-2 text-gray-600 text-sm text-center">Agences actives</span>
                        </div>
                        {Object.keys(agencyStats.byConcurrent).map((concurrent) => (
                            <div
                                key={concurrent}
                                className={`shadow rounded-xl p-6 flex flex-col items-center ${CONCURRENT_COLORS[concurrent] || "bg-gray-100 text-gray-700"}`}
                            >
                                <span className="text-2xl font-bold">{agencyStats.byConcurrent[concurrent]}</span>
                                <span className="mt-2 text-sm">{concurrent}</span>
                            </div>
                        ))}
                    </div>
                )}
            </div>

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
