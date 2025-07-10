'use client';
import { useEffect, useState } from 'react';

export default function Api({ apiUrl = 'http://localhost:3000/api' }) {
    const [isOnline, setIsOnline] = useState(null);

    useEffect(() => {
        const checkStatus = async () => {
            try {
                const res = await fetch(apiUrl, { method: 'HEAD' });
                setIsOnline(res.ok);
            } catch {
                setIsOnline(false);
            }
        };

        checkStatus(); // check on load
        const interval = setInterval(checkStatus, 10000); // check every 10 sec
        return () => clearInterval(interval);
    }, [apiUrl]);

    return (
        <div className="flex items-center space-x-2 text-sm text-gray-700">
            <span
                className={`w-3 h-3 rounded-full ${
                    isOnline === null
                        ? 'bg-gray-400'
                        : isOnline
                            ? 'bg-green-500'
                            : 'bg-red-500'
                }`}
            />
            <span>
                {isOnline === null
                    ? 'Chargement...'
                    : isOnline
                        ? 'Serveur en ligne'
                        : 'Serveur hors ligne'}
            </span>
        </div>
    );
}
