'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import api from '@/utils/api';

export default function ChangelogPage() {
    const [logs, setLogs] = useState([]);

    useEffect(() => {
        const fetchLogs = async () => {
            try {
                const res = await api.get('/changelogs');
                setLogs(res.data);
            } catch (err) {
                console.error('Erreur lors du chargement des changelogs', err);
            }
        };
        fetchLogs();
    }, []);

    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 p-6">
            <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-3xl">
                <h1 className="text-3xl font-bold text-center text-gray-800 mb-6">📘 Changelog</h1>
                <ul className="space-y-6">
                    {logs.map((log, index) => (
                        <li key={index} className="border-l-4 border-purple-600 pl-4">
                            <p className="text-sm text-gray-500">{new Date(log.date).toLocaleDateString()}</p>
                            <h2 className="text-lg font-semibold text-gray-800">{log.titre}</h2>
                            <p className="text-gray-600">{log.description}</p>
                        </li>
                    ))}
                </ul>
                <div className="mt-8 text-center">
                    <Link
                        href="/"
                        className="text-purple-600 hover:underline text-sm font-medium"
                    >
                        ⬅ Retour à l’accueil
                    </Link>
                </div>
            </div>
        </div>
    );
}
