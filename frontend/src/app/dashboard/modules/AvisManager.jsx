'use client';
import { useEffect, useState } from 'react';
import { DocumentTextIcon, ArrowDownTrayIcon } from '@heroicons/react/24/outline';
import api from '../../../utils/api';

export default function AvisManager() {
    const [data, setData] = useState([]);
    const [count, setCount] = useState(0);
    const [loading, setLoading] = useState(true);
    const [filters, setFilters] = useState({ ville: '', agence: '', modele: '' });
    const [page, setPage] = useState(1);
    const limit = 20;

    const fetchData = async () => {
        setLoading(true);
        try {
            const token = localStorage.getItem('accessToken');
            const query = new URLSearchParams({
                limit,
                offset: (page - 1) * limit,
                ...Object.fromEntries(Object.entries(filters).filter(([_, v]) => v))
            }).toString();

            const res = await api.get(`/admin/avis?${query}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setData(res.data.data);
            setCount(res.data.count);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, [page, filters]);

    const handleChange = (e) => {
        setPage(1);
        setFilters({ ...filters, [e.target.name]: e.target.value });
    };

    const handleExport = async () => {
        try {
            const token = localStorage.getItem('accessToken');
            const query = new URLSearchParams({
                ...Object.fromEntries(Object.entries(filters).filter(([_, v]) => v))
            }).toString();

            const res = await api.get(`/admin/avis/export?${query}`, {
                headers: { Authorization: `Bearer ${token}` },
                responseType: 'blob'
            });

            const url = window.URL.createObjectURL(new Blob([res.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', 'avis_export.xlsx');
            document.body.appendChild(link);
            link.click();
            link.remove();
        } catch (err) {
            console.error('Erreur export :', err);
        }
    };

    return (
        <section>
            <div className="flex items-center justify-between mb-4">
                <h1 className="text-2xl font-semibold text-purple-700 flex items-center gap-2">
                    <DocumentTextIcon className="w-7 h-7" /> Historique des locations AVIS
                </h1>
                <button
                    onClick={handleExport}
                    className="flex items-center gap-2 bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700"
                >
                    <ArrowDownTrayIcon className="w-5 h-5" /> Exporter
                </button>
            </div>

            <div className="flex flex-wrap gap-4 mb-6">
                <input
                    type="text"
                    name="ville"
                    placeholder="Ville"
                    className="border border-purple-300 rounded px-4 py-2 text-sm w-full sm:w-auto"
                    value={filters.ville}
                    onChange={handleChange}
                />
                <input
                    type="text"
                    name="agence"
                    placeholder="Agence"
                    className="border border-purple-300 rounded px-4 py-2 text-sm w-full sm:w-auto"
                    value={filters.agence}
                    onChange={handleChange}
                />
                <input
                    type="text"
                    name="modele"
                    placeholder="Modèle"
                    className="border border-purple-300 rounded px-4 py-2 text-sm w-full sm:w-auto"
                    value={filters.modele}
                    onChange={handleChange}
                />
            </div>

            {loading ? (
                <div className="mt-6 text-gray-500">Chargement...</div>
            ) : (
                <ul className="space-y-3">
                    {data.length === 0 ? (
                        <li className="text-gray-400">Aucune donnée trouvée.</li>
                    ) : data.map((row, index) => (
                        <li
                            key={index}
                            className="p-4 bg-purple-50 rounded-xl shadow flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 text-sm"
                        >
                            <div className="flex flex-col">
                                <span className="text-purple-800 font-semibold">{row.modele}</span>
                                <span className="text-gray-600 text-xs">{row.ville} - {row.agence}</span>
                                <span className="text-gray-400 text-xs">{row.date_location?.split('T')[0]}</span>
                            </div>
                            <div className="flex flex-wrap gap-2 text-xs text-gray-500">
                                <span><strong>Prix :</strong> {!isNaN(parseFloat(row.prix)) ? parseFloat(row.prix).toFixed(2) + ' €' : '—'}</span>
                                <span><strong>Période :</strong> {row.periode || '—'}</span>
                                <span><strong>Durée :</strong> {row.duree || '—'}</span>
                                <span><strong>IP :</strong> {row.ip || '—'}</span>
                            </div>
                        </li>
                    ))}
                </ul>
            )}

            <div className="mt-6 flex justify-between items-center">
                <button
                    className="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700 disabled:opacity-50"
                    onClick={() => setPage(p => Math.max(1, p - 1))}
                    disabled={page === 1}
                >
                    Précédent
                </button>
                <span className="text-sm text-gray-700">Page {page} / {Math.ceil(count / limit) || 1}</span>
                <button
                    className="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700 disabled:opacity-50"
                    onClick={() => setPage(p => p + 1)}
                    disabled={page * limit >= count}
                >
                    Suivant
                </button>
            </div>
        </section>
    );
}
