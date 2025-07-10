'use client';
import { useEffect, useState } from 'react';

export default function MinimumScreenSize({ minWidth = 376, children }) {
    const [tooSmall, setTooSmall] = useState(false);

    useEffect(() => {
        const check = () => setTooSmall(window.innerWidth < minWidth);
        check();
        window.addEventListener('resize', check);
        return () => window.removeEventListener('resize', check);
    }, [minWidth]);

    if (tooSmall) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500">
                <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-xs text-center flex flex-col items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-red-500 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 5.636l-1.414 1.414M6.343 17.657l-1.414-1.414M4 12h2M18 12h2M12 4v2M12 18v2m7.071-7.071A9 9 0 115.929 5.929a9 9 0 0112.142 12.142z" />
                    </svg>
                    <div className="text-lg font-bold text-red-500 mb-2">Écran trop petit</div>
                    <p className="text-gray-700 text-sm">
                        L’utilisation de cette page n’est pas possible sur un écran aussi petit.<br />
                        Utilise un appareil avec une largeur supérieure à {minWidth - 1}px.
                    </p>
                </div>
            </div>
        );
    }

    // Affiche le vrai contenu de la page si taille ok
    return children;
}
