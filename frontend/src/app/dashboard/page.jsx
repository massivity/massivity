'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import api from '../../utils/api';
import MinimumScreenSize from '../../components/screenBehavior/minimumScreenSize';
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import {
    HomeIcon,
    UsersIcon,
    Cog6ToothIcon,
    ArrowLeftOnRectangleIcon,
    FolderIcon
} from '@heroicons/react/24/outline';

import DashboardHome from './modules/DashboardHome';
import UsersManager from './modules/UsersManager';
import Settings from './modules/Settings';
import AvisManager from './modules/AvisManager';
import Wip from './modules/wip';

export default function DashboardPage() {
    const [selectedMenu, setSelectedMenu] = useState('home');
    const [selectedSubMenu, setSelectedSubMenu] = useState(null);
    const [user, setUser] = useState(null);
    const [usersList, setUsersList] = useState([]);
    const [loading, setLoading] = useState(true);
    const [loadingUsers, setLoadingUsers] = useState(false);
    const [menuOpen, setMenuOpen] = useState(false);
    const router = useRouter();

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

    return (
        <MinimumScreenSize>
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

                        <div className="mt-4">
                            <div className="text-xs text-gray-400 uppercase mb-2">Scrapping AVIS</div>
                            <button
                                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition w-full
                                    ${selectedSubMenu === 'dashboard_avis' ? 'bg-purple-100 text-purple-800 font-bold' : 'hover:bg-purple-50 text-gray-700'}
                                `}
                                onClick={() => { setSelectedMenu('dashboard_avis'); setSelectedSubMenu('dashboard_avis'); setMenuOpen(false); }}>
                                <MagnifyingGlassIcon className="h-5 w-5" /> Dashboard
                            </button>
                            <button
                                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition w-full
                                    ${selectedSubMenu === 'avis' ? 'bg-purple-100 text-purple-800 font-bold' : 'hover:bg-purple-50 text-gray-700'}
                                `}
                                onClick={() => { setSelectedMenu('avis'); setSelectedSubMenu('avis'); setMenuOpen(false); }}>
                                <MagnifyingGlassIcon className="h-5 w-5" /> Visualisation
                            </button>
                        </div>
                        <div className="text-xs text-gray-400 uppercase mb-2">Espace admin</div>
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
                    {selectedMenu === 'home' && <DashboardHome user={user} />}
                    {selectedMenu === 'users' && <UsersManager users={usersList} loading={loadingUsers} />}
                    {selectedMenu === 'settings' && <Settings />}
                    {selectedMenu === 'avis' && <AvisManager />}
                    {selectedMenu === 'dashboard_avis' && <Wip />}
                </main>
            </div>
        </MinimumScreenSize>
    );
}
