import { useState, useRef, useEffect } from 'react';
import toast from 'react-hot-toast';

const CONCURRENTS = ["Avis", "Europcar", "Sixt", "Rent A Car", "Ada"];

export default function ImportModal({ open, onClose, onImport }) {
    const [concurrent, setConcurrent] = useState(CONCURRENTS[0]);
    const [file, setFile] = useState(null);
    const [loading, setLoading] = useState(false);
    const fileInputRef = useRef();

    // Reset state à chaque ouverture de la modal
    useEffect(() => {
        if (open) {
            setConcurrent(CONCURRENTS[0]);
            setFile(null);
            if (fileInputRef.current) fileInputRef.current.value = '';
        }
    }, [open]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!file) {
            toast.error("Merci de sélectionner un fichier .xlsx !");
            return;
        }
        setLoading(true);
        try {
            await onImport({ file, concurrent });
            toast.success("Import réussi !");
            onClose();
        } catch (err) {
            toast.error("Erreur lors de l'import !");
        } finally {
            setLoading(false);
        }
    };

    if (!open) return null;

    return (
        <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/40">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-md p-6 relative">
                <button
                    className="absolute top-3 right-4 text-xl font-bold text-gray-400 hover:text-purple-700"
                    onClick={onClose}
                    disabled={loading}
                >
                    &times;
                </button>
                <h3 className="text-lg font-bold text-purple-800 mb-4">Importer une liste d'agences</h3>
                <form onSubmit={handleSubmit} className="flex flex-col gap-5">
                    <div>
                        <label className="block mb-1 text-sm font-semibold text-purple-700">Concurrent</label>
                        <select
                            value={concurrent}
                            onChange={e => setConcurrent(e.target.value)}
                            className="w-full border rounded-lg px-3 py-2 text-gray-800 focus:ring-2 focus:ring-purple-500"
                            disabled={loading}
                        >
                            {CONCURRENTS.map(c =>
                                <option key={c} value={c}>{c}</option>
                            )}
                        </select>
                    </div>
                    <div>
                        <label className="block mb-1 text-sm font-semibold text-purple-700">Fichier Excel (.xlsx)</label>
                        <div className="flex items-center gap-2">
                            <button
                                type="button"
                                className="px-3 py-2 bg-purple-100 border border-purple-300 rounded-md text-purple-700 hover:bg-purple-200"
                                onClick={() => fileInputRef.current?.click()}
                                disabled={loading}
                            >
                                Choisir un fichier
                            </button>
                            <span className="text-xs text-gray-500">
                                {file ? file.name : "Aucun fichier choisi"}
                            </span>
                        </div>
                        <input
                            type="file"
                            accept=".xlsx"
                            ref={fileInputRef}
                            className="hidden"
                            disabled={loading}
                            onChange={e => setFile(e.target.files[0])}
                        />
                    </div>
                    <button
                        type="submit"
                        disabled={loading}
                        className="bg-purple-600 text-white rounded-lg px-4 py-2 mt-2 hover:bg-purple-700 font-bold transition"
                    >
                        {loading ? "Chargement..." : "Importer"}
                    </button>
                </form>
            </div>
        </div>
    );
}
