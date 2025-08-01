// ✅ backend/pages/dashboard/page.js
'use client';
import { useState } from 'react';
import useAuth from '../../components/dashboard/hooks/useAuth';
import useUsers from '../../components/dashboard/hooks/useUsers';
import Sidebar from '../../components/dashboard/Sidebar';
import Header from '../../components/dashboard/Header';
import MainContent from '../../components/dashboard/MainContent';
import LoadingScreen from '../../components/dashboard/LoadingScreen';
import MinimumScreenSize from '../../components/screenBehavior/minimumScreenSize';

export default function DashboardPage() {
    const [selectedMenu, setSelectedMenu] = useState('home');
    const [selectedSubMenu, setSelectedSubMenu] = useState(null);
    const [menuOpen, setMenuOpen] = useState(false);

    const { user, loading } = useAuth();
    const { usersList, loadingUsers } = useUsers(selectedMenu);

    const handleMenuChange = (menu, subMenu = null) => {
        setSelectedMenu(menu);
        setSelectedSubMenu(subMenu);
        setMenuOpen(false);
    };

    if (loading) return <LoadingScreen />;

    return (
        <MinimumScreenSize>
            <div className="min-h-screen flex flex-col md:flex-row bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500">
                <Sidebar
                    user={user}
                    selectedMenu={selectedMenu}
                    selectedSubMenu={selectedSubMenu}
                    onMenuChange={handleMenuChange}
                    onLogout={() => {
                        localStorage.removeItem('accessToken');
                        window.location.replace('/login');
                    }}
                />

                <Header onToggleMenu={() => setMenuOpen(!menuOpen)} />
                <main className="flex-1 p-6 md:p-12 bg-white/90 rounded-tl-3xl md:rounded-none mt-8 md:mt-0">
                    <MainContent
                        selectedMenu={selectedMenu}
                        user={user}
                        users={usersList}
                        loadingUsers={loadingUsers}
                    />
                </main>
            </div>
        </MinimumScreenSize>
    );
}