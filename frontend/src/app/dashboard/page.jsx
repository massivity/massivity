'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import api from '@/utils/api';
import { HomeIcon, UsersIcon, Cog6ToothIcon, ArrowLeftOnRectangleIcon } from '@heroicons/react/24/outline';

export default function DashboardPage() {
    const [selectedMenu, setSelectedMenu] = useState('home');
    const [user, setUser] = useState(null);
    const [usersList, setUsersList] = useState([]);
    const [loading, setLoading] = useState(true);
    const [loadingUsers, setLoadingUsers] = useState(false);
    const [menuOpen, setMenuOpen] = useState(false);
    const [tooSmall, setTooSmall] = useState(false);
    const router = useRouter();

    // Check screen size on mount and resize
    useEffect(() => {
        const checkSize = () => {
            if (window.innerWidth <= 375) { // iPhone SE or smaller
                setTooSmall(true);
            } else {
                setTooSmall(false);
            }
        };
        checkSize();
        window.addEventListener('resize', checkSize);
        return () => window.removeEventListener('resize', checkSize);
    }, []);

    // Sécurité : Vérifie accessToken + role admin
    useEffect(() => {
        const fetchUser = async () => {
            try {
                const token = localStorage.getItem('accessToken');
                if (!token) throw new Error("Pas de token");
                const res = await api.get('/auth/profil', {
                    headers: { Authorization: `Bearer ${token}` }
                });
                if (!res.data.user || res.data.user.role !== 'admin') throw new Error("Pas admin");
                setUser(res.data.user);
                setLoading(false);
            } catch {
                router.replace('/login');
            }
        };
        fetchUser();
    }, [router]);

    // Fetch utilisateurs (section "Utilisateurs")
    useEffect(() => {
        const fetchUsers = async () => {
            if (selectedMenu !== 'users') return;
            setLoadingUsers(true);
            try {
                const token = localStorage.getItem('accessToken');
                const res = await api.get('/admin/users', {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setUsersList(res.data.users || []);
            } catch {
                setUsersList([]);
            } finally {
                setLoadingUsers(false);
            }
        };
        fetchUsers();
    }, [selectedMenu]);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500">
                <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-purple-600" />
            </div>
        );
    }

    if (tooSmall) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500">
                <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-xs text-center flex flex-col items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-red-500 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 5.636l-1.414 1.414M6.343 17.657l-1.414-1.414M4 12h2M18 12h2M12 4v2M12 18v2m7.071-7.071A9 9 0 115.929 5.929a9 9 0 0112.142 12.142z" />
                    </svg>
                    <div className="text-lg font-bold text-red-500 mb-2">Écran trop petit</div>
                    <p className="text-gray-700 text-sm">
                        L’utilisation du dashboard n’est pas possible sur un écran aussi petit.<br />
                        Utilise un appareil avec une largeur d’écran supérieure à celle d’un iPhone SE (376px).
                    </p>
                </div>
            </div>
        );
    }

    // Menu responsive mobile + desktop
    return (
        <div className="min-h-screen flex flex-col md:flex-row bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500">
            {/* MENU LATÉRAL */}
            <aside className={`md:w-64 w-full bg-white/90 backdrop-blur-xl shadow-xl flex flex-col py-6 px-4 md:px-6 transition-all
                ${menuOpen ? 'fixed z-20 left-0 top-0 h-full' : 'hidden md:flex'}
            `}>
                {/* PROFIL */}
                <div className="flex flex-col items-center mb-8">
                    <div className="w-16 h-16 bg-purple-200 rounded-full flex items-center justify-center text-2xl font-bold text-purple-700 mb-2">
                        {user && user.prenom ? user.prenom[0] : 'A'}
                    </div>
                    <div className="font-semibold text-purple-700">{user?.prenom} {user?.nom}</div>
                    <div className="text-xs text-gray-400">{user?.role}</div>
                </div>
                {/* MENU */}
                <nav className="flex flex-col gap-1 flex-1">
                    <button
                        className={`flex items-center gap-3 px-4 py-3 rounded-lg transition w-full
                            ${selectedMenu === 'home' ? 'bg-purple-100 text-purple-800 font-bold' : 'hover:bg-purple-50 text-gray-700'}
                        `}
                        onClick={() => { setSelectedMenu('home'); setMenuOpen(false); }}>
                        <HomeIcon className="h-5 w-5" /> Accueil
                    </button>
                    <button
                        className={`flex items-center gap-3 px-4 py-3 rounded-lg transition w-full
                            ${selectedMenu === 'users' ? 'bg-purple-100 text-purple-800 font-bold' : 'hover:bg-purple-50 text-gray-700'}
                        `}
                        onClick={() => { setSelectedMenu('users'); setMenuOpen(false); }}>
                        <UsersIcon className="h-5 w-5" /> Utilisateurs
                    </button>
                    <button
                        className={`flex items-center gap-3 px-4 py-3 rounded-lg transition w-full
                            ${selectedMenu === 'settings' ? 'bg-purple-100 text-purple-800 font-bold' : 'hover:bg-purple-50 text-gray-700'}
                        `}
                        onClick={() => { setSelectedMenu('settings'); setMenuOpen(false); }}>
                        <Cog6ToothIcon className="h-5 w-5" /> Paramètres
                    </button>
                </nav>
                <button
                    className="mt-8 bg-purple-600 hover:bg-purple-700 text-white py-2 rounded-lg transition flex items-center justify-center gap-2"
                    onClick={() => {
                        localStorage.removeItem('accessToken');
                        router.replace('/login');
                    }}
                >
                    <ArrowLeftOnRectangleIcon className="h-5 w-5" />
                    Déconnexion
                </button>
            </aside>

            {/* BOUTON MENU MOBILE */}
            <button
                className="md:hidden fixed z-30 left-4 top-4 bg-white shadow-xl p-2 rounded-xl"
                onClick={() => setMenuOpen(!menuOpen)}>
                <svg className="h-6 w-6 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
            </button>

            {/* CONTENU */}
            <main className="flex-1 p-6 md:p-12 bg-white/90 rounded-tl-3xl md:rounded-none mt-8 md:mt-0">
                {selectedMenu === 'home' && (
                    <section>
                        <h1 className="text-3xl font-bold text-gray-800 mb-4">Bienvenue sur le dashboard, {user?.prenom} !</h1>
                        <p className="text-gray-700">Choisis une section dans le menu de gauche pour commencer.</p>
                    </section>
                )}
                {selectedMenu === 'users' && (
                    <section>
                        <h1 className="text-2xl font-semibold text-purple-700 mb-2">Gestion des utilisateurs</h1>
                        {loadingUsers ? (
                            <div className="mt-6 text-gray-500">Chargement...</div>
                        ) : (
                            <ul className="mt-6 space-y-2">
                                {usersList.length === 0 ? (
                                    <li className="text-gray-400">Aucun utilisateur trouvé.</li>
                                ) : usersList.map(u => (
                                    <li key={u.id} className="p-3 bg-purple-50 rounded shadow flex justify-between items-center">
                                        <span>{u.prenom} {u.nom} <span className="text-xs text-gray-400 ml-2">({u.role})</span></span>
                                        <span className="text-sm text-gray-500">{u.email}</span>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </section>
                )}
                {selectedMenu === 'settings' && (
                    <section>
                        <h1 className="text-2xl font-semibold text-purple-700 mb-2">Paramètres</h1>
                        <p className="text-gray-700">Fonctionnalités de réglage à venir.</p>
                    </section>
                )}
            </main>
        </div>
    );
}
