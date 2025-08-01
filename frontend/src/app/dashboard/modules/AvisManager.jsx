'use client';
import { useEffect, useState } from 'react';
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

    return (
        <div>
            <h1 className="text-2xl font-bold mb-4">Locations AVIS</h1>

            {/* Filtres */}
            <div className="flex gap-4 flex-wrap mb-6">
                <input
                    type="text"
                    name="ville"
                    placeholder="Ville"
                    className="border rounded p-2"
                    value={filters.ville}
                    onChange={handleChange}
                />
                <input
                    type="text"
                    name="agence"
                    placeholder="Agence"
                    className="border rounded p-2"
                    value={filters.agence}
                    onChange={handleChange}
                />
                <input
                    type="text"
                    name="modele"
                    placeholder="Modèle"
                    className="border rounded p-2"
                    value={filters.modele}
                    onChange={handleChange}
                />
            </div>

            {/* Tableau */}
            {loading ? (
                <p>Chargement...</p>
            ) : (
                <div className="overflow-auto">
                    <table className="w-full table-auto text-sm border">
                        <thead>
                        <tr className="bg-gray-100">
                            <th className="border px-2 py-1">Date</th>
                            <th className="border px-2 py-1">Ville</th>
                            <th className="border px-2 py-1">Agence</th>
                            <th className="border px-2 py-1">Modèle</th>
                            <th className="border px-2 py-1">Prix (€)</th>
                            <th className="border px-2 py-1">Période</th>
                            <th className="border px-2 py-1">Durée</th>
                            <th className="border px-2 py-1">IP</th>
                            {/* <th className="border px-2 py-1">Genre</th> */}
                        </tr>
                        </thead>
                        <tbody>
                        {data.map((row, index) => (
                            <tr key={index} className="text-sm text-center">
                                <td className="border px-2 py-1">{row.date_location?.split('T')[0]}</td>
                                <td className="border px-2 py-1">{row.ville}</td>
                                <td className="border px-2 py-1">{row.agence}</td>
                                <td className="border px-2 py-1">{row.modele}</td>
                                <td className="border px-2 py-1">
                                    {!isNaN(parseFloat(row.prix)) ? parseFloat(row.prix).toFixed(2) : '—'}
                                </td>

                                <td className="border px-2 py-1">{row.periode || '—'}</td>
                                <td className="border px-2 py-1">{row.duree || '—'}</td>
                                <td className="border px-2 py-1">{row.ip || '—'}</td>
                                {/* <td className="border px-2 py-1">{row.genre || '—'}</td> */}
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>
            )}

            {/* Pagination */}
            <div className="mt-6 flex justify-between items-center">
                <button
                    className="px-4 py-2 bg-purple-200 rounded disabled:opacity-50"
                    onClick={() => setPage(p => Math.max(1, p - 1))}
                    disabled={page === 1}>
                    Précédent
                </button>
                <span className="text-sm">Page {page} / {Math.ceil(count / limit) || 1}</span>
                <button
                    className="px-4 py-2 bg-purple-200 rounded disabled:opacity-50"
                    onClick={() => setPage(p => p + 1)}
                    disabled={page * limit >= count}>
                    Suivant
                </button>
            </div>
        </div>
    );
}
