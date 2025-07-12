'use client';
import { useEffect, useState, useRef } from 'react';
import api from '@/utils/api';
import toast from 'react-hot-toast';
import ImportModal from '../../../components/importModal';

const CONCURRENT_COLORS = {
    Avis: "bg-blue-100 text-blue-700",
    Europcar: "bg-green-100 text-green-700",
    Sixt: "bg-orange-100 text-orange-700",
    "Rent A Car": "bg-red-100 text-red-700",
    Ada: "bg-purple-100 text-purple-700",
};
const CONCURRENTS = Object.keys(CONCURRENT_COLORS);

function AgenciesManager() {
    const [agencies, setAgencies] = useState([]);
    const [filtered, setFiltered] = useState([]);
    const [loading, setLoading] = useState(false);
    const [importModalOpen, setImportModalOpen] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const [editData, setEditData] = useState({});
    const [search, setSearch] = useState('');
    const [filterConcurrent, setFilterConcurrent] = useState('');
    const [filterActive, setFilterActive] = useState('');
    const token = typeof window !== "undefined" ? localStorage.getItem('accessToken') : null;

    useEffect(() => { fetchAgencies(); }, []);

    useEffect(() => {
        let data = agencies;
        if (search)
            data = data.filter(a =>
                a.ville?.toLowerCase().includes(search.toLowerCase()) ||
                a.agence?.toLowerCase().includes(search.toLowerCase()) ||
                (a.lien_agence || '').toLowerCase().includes(search.toLowerCase())
            );
        if (filterConcurrent)
            data = data.filter(a => a.concurrent === filterConcurrent);
        if (filterActive !== '')
            data = data.filter(a => !!a.active === (filterActive === '1'));
        setFiltered(data);
    }, [search, filterConcurrent, filterActive, agencies]);

    async function fetchAgencies() {
        setLoading(true);
        try {
            const res = await api.get('/scrapping/agencies', {
                headers: { Authorization: `Bearer ${token}` }
            });
            setAgencies(res.data || []);
        } catch (e) {
            toast.error("Erreur lors du chargement des agences");
        } finally {
            setLoading(false);
        }
    }

    async function toggleActive(id) {
        try {
            await api.patch(`/scrapping/agencies/${id}/activate`, {}, {
                headers: { Authorization: `Bearer ${token}` }
            });
            fetchAgencies();
        } catch {
            toast.error("Erreur lors du changement de statut");
        }
    }

    async function deleteAgency(id) {
        if (!confirm("Supprimer cette agence ?")) return;
        try {
            await api.delete(`/scrapping/agencies/${id}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            fetchAgencies();
        } catch {
            toast.error("Erreur lors de la suppression");
        }
    }

    // Handler pour l'import
    async function handleImport({ file, concurrent }) {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('concurrent', concurrent);
        await api.post('/scrapping/agencies/import', formData, {
            headers: { Authorization: `Bearer ${token}` }
        });
        await fetchAgencies();
    }

    function startEdit(agency) {
        setEditingId(agency.id);
        setEditData({
            ville: agency.ville,
            agence: agency.agence,
            lien_agence: agency.lien_agence || '',
        });
    }

    function cancelEdit() {
        setEditingId(null);
        setEditData({});
    }

    async function saveEdit(id) {
        try {
            await api.patch(`/scrapping/agencies/${id}`, editData, {
                headers: { Authorization: `Bearer ${token}` }
            });
            toast.success("Modifications enregistrées");
            setEditingId(null);
            fetchAgencies();
        } catch {
            toast.error("Erreur lors de la modification");
        }
    }

    return (
        <div>
            <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 mb-6">
                <h2 className="text-2xl font-bold text-purple-800">Agences de scrapping</h2>
                <div className="flex gap-2 flex-wrap">
                    <input
                        placeholder="Recherche ville, agence, lien..."
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                        className="border rounded px-3 py-2 text-sm focus:ring-2 focus:ring-purple-300"
                    />
                    <select
                        value={filterConcurrent}
                        onChange={e => setFilterConcurrent(e.target.value)}
                        className="border rounded px-3 py-2 text-sm focus:ring-2 focus:ring-purple-300"
                    >
                        <option value="">Tous concurrents</option>
                        {CONCURRENTS.map(c =>
                            <option key={c} value={c}>{c}</option>
                        )}
                    </select>
                    <select
                        value={filterActive}
                        onChange={e => setFilterActive(e.target.value)}
                        className="border rounded px-3 py-2 text-sm focus:ring-2 focus:ring-purple-300"
                    >
                        <option value="">Tous</option>
                        <option value="1">Actives</option>
                        <option value="0">Inactives</option>
                    </select>
                    <button
                        className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
                        onClick={() => setImportModalOpen(true)}
                    >
                        Importer une liste
                    </button>
                </div>
            </div>
            <ImportModal
                open={importModalOpen}
                onClose={() => setImportModalOpen(false)}
                onImport={handleImport}
            />
            <div className="overflow-x-auto shadow rounded-xl bg-white/90">
                <table className="min-w-full text-sm">
                    <thead>
                    <tr className="bg-purple-100 text-purple-700">
                        <th className="px-4 py-2">Concurrent</th>
                        <th className="px-4 py-2">Ville</th>
                        <th className="px-4 py-2">Agence</th>
                        <th className="px-4 py-2">Lien agence</th>
                        <th className="px-4 py-2">Active</th>
                        <th className="px-4 py-2">Actions</th>
                    </tr>
                    </thead>
                    <tbody>
                    {loading ? (
                        <tr><td colSpan={6} className="py-6 text-center">Chargement...</td></tr>
                    ) : filtered.length === 0 ? (
                        <tr><td colSpan={6} className="py-6 text-center text-gray-500">Aucune agence</td></tr>
                    ) : filtered.map(a => (
                        <tr key={a.id} className="transition hover:bg-purple-50/40">
                            <td className="px-4 py-2">
                                    <span className={`px-2 py-1 rounded-full text-xs font-semibold
                                        ${CONCURRENT_COLORS[a.concurrent] || 'bg-gray-200 text-gray-700'}`}>
                                        {a.concurrent}
                                    </span>
                            </td>
                            {editingId === a.id ? (
                                <>
                                    <td className="px-4 py-2">
                                        <input value={editData.ville} onChange={e => setEditData(d => ({ ...d, ville: e.target.value }))}
                                               className="border rounded px-2 py-1 text-sm w-full" />
                                    </td>
                                    <td className="px-4 py-2">
                                        <input value={editData.agence} onChange={e => setEditData(d => ({ ...d, agence: e.target.value }))}
                                               className="border rounded px-2 py-1 text-sm w-full" />
                                    </td>
                                    <td className="px-4 py-2">
                                        <input value={editData.lien_agence || ''} onChange={e => setEditData(d => ({ ...d, lien_agence: e.target.value }))}
                                               className="border rounded px-2 py-1 text-sm w-full" placeholder="Lien agence" />
                                    </td>
                                </>
                            ) : (
                                <>
                                    <td className="px-4 py-2">{a.ville}</td>
                                    <td className="px-4 py-2">{a.agence}</td>
                                    <td className="px-4 py-2">
                                        {a.lien_agence ? (
                                            <a
                                                href={a.lien_agence}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="text-purple-600 underline hover:text-purple-900 break-all"
                                            >
                                                {a.lien_agence.length > 35
                                                    ? a.lien_agence.substring(0, 35) + '...'
                                                    : a.lien_agence}
                                            </a>
                                        ) : (
                                            <span className="text-gray-400">-</span>
                                        )}
                                    </td>
                                </>
                            )}
                            <td className="px-4 py-2 text-center">
                                <button
                                    onClick={() => toggleActive(a.id)}
                                    className={`px-3 py-1 rounded-full transition
                                            ${a.active ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"} font-bold`}
                                >
                                    {a.active ? "Active" : "Inactive"}
                                </button>
                            </td>
                            <td className="px-4 py-2 flex gap-2">
                                {editingId === a.id ? (
                                    <>
                                        <button onClick={() => saveEdit(a.id)}
                                                className="bg-green-600 hover:bg-green-700 text-white px-2 py-1 rounded">
                                            Sauver
                                        </button>
                                        <button onClick={cancelEdit}
                                                className="bg-gray-200 text-gray-600 px-2 py-1 rounded">
                                            Annuler
                                        </button>
                                    </>
                                ) : (
                                    <>
                                        <button
                                            onClick={() => startEdit(a)}
                                            className="bg-purple-100 hover:bg-purple-200 text-purple-800 px-2 py-1 rounded">
                                            Modifier
                                        </button>
                                        <button
                                            onClick={() => deleteAgency(a.id)}
                                            className="bg-red-600 hover:bg-red-700 text-white px-2 py-1 rounded">
                                            Supprimer
                                        </button>
                                    </>
                                )}
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>
            {/* Mobile info? Si tu veux, tu peux ajouter ici un affichage cards/agence pour mobile */}
        </div>
    );
}

export default AgenciesManager;
