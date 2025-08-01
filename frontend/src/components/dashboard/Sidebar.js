// ✅ backend/src/components/dashboard/Sidebar.js
import {
    HomeIcon,
    UsersIcon,
    Cog6ToothIcon,
    ArrowLeftOnRectangleIcon,
    MagnifyingGlassIcon
} from '@heroicons/react/24/outline';
import { DocumentChartBarIcon } from '@heroicons/react/16/solid';

export default function Sidebar({ user, selectedMenu, selectedSubMenu, onMenuChange, onLogout }) {
    return (
        <aside className={`md:w-64 w-full bg-white/90 backdrop-blur-xl shadow-xl flex flex-col py-6 px-4 md:px-6 transition-all hidden md:flex`}>
            <div className="flex flex-col items-center mb-8">
                <div className="w-16 h-16 bg-purple-200 rounded-full flex items-center justify-center text-2xl font-bold text-purple-700 mb-2">
                    {user?.prenom?.[0] || 'A'}
                </div>
                <div className="font-semibold text-purple-700">{user?.prenom} {user?.nom}</div>
                <div className="text-xs text-gray-400">{user?.role}</div>
            </div>
            <nav className="flex flex-col gap-1 flex-1">
                <button
                    className={`flex items-center gap-3 px-4 py-3 rounded-lg transition w-full ${selectedMenu === 'home' ? 'bg-purple-100 text-purple-800 font-bold' : 'hover:bg-purple-50 text-gray-700'}`}
                    onClick={() => onMenuChange('home')}
                >
                    <HomeIcon className="h-5 w-5" /> Accueil
                </button>

                <div className="mt-4">
                    <div className="text-xs text-gray-400 uppercase mb-2">Scrapping AVIS</div>
                    <button
                        className={`flex items-center gap-3 px-4 py-3 rounded-lg transition w-full ${selectedSubMenu === 'dashboard_avis' ? 'bg-purple-100 text-purple-800 font-bold' : 'hover:bg-purple-50 text-gray-700'}`}
                        onClick={() => onMenuChange('dashboard_avis', 'dashboard_avis')}
                    >
                        <DocumentChartBarIcon className="h-5 w-5" /> Dashboard
                    </button>
                    <button
                        className={`flex items-center gap-3 px-4 py-3 rounded-lg transition w-full ${selectedSubMenu === 'avis' ? 'bg-purple-100 text-purple-800 font-bold' : 'hover:bg-purple-50 text-gray-700'}`}
                        onClick={() => onMenuChange('avis', 'avis')}
                    >
                        <MagnifyingGlassIcon className="h-5 w-5" /> Visualisation
                    </button>
                </div>

                <div className="text-xs text-gray-400 uppercase mb-2">Espace admin</div>
                <button
                    className={`flex items-center gap-3 px-4 py-3 rounded-lg transition w-full ${selectedMenu === 'users' ? 'bg-purple-100 text-purple-800 font-bold' : 'hover:bg-purple-50 text-gray-700'}`}
                    onClick={() => onMenuChange('users')}
                >
                    <UsersIcon className="h-5 w-5" /> Utilisateurs
                </button>
                <button
                    className={`flex items-center gap-3 px-4 py-3 rounded-lg transition w-full ${selectedMenu === 'settings' ? 'bg-purple-100 text-purple-800 font-bold' : 'hover:bg-purple-50 text-gray-700'}`}
                    onClick={() => onMenuChange('settings')}
                >
                    <Cog6ToothIcon className="h-5 w-5" /> Paramètres
                </button>
            </nav>
            <button
                className="mt-8 bg-purple-600 hover:bg-purple-700 text-white py-2 rounded-lg transition flex items-center justify-center gap-2"
                onClick={onLogout}
            >
                <ArrowLeftOnRectangleIcon className="h-5 w-5" /> Déconnexion
            </button>
        </aside>
    );
}