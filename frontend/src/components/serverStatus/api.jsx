'use client';
import { useEffect } from 'react';

/**
 * Ce composant ne rend rien. Il sert juste à détecter si l’API backend est en ligne
 * et à notifier le parent via la prop onStatusChange(online: boolean).
 * Par défaut, il checke http://localhost:3000/api.
 */
export default function ServerStatus({ apiUrl = 'http://localhost:3000/api', onStatusChange }) {
    useEffect(() => {
        const checkStatus = async () => {
            try {
                const res = await fetch(apiUrl, { method: 'HEAD' });
                if (onStatusChange) onStatusChange(res.ok);
            } catch {
                if (onStatusChange) onStatusChange(false);
            }
        };

        checkStatus();
        const interval = setInterval(checkStatus, 10000);
        return () => clearInterval(interval);
    }, [apiUrl, onStatusChange]);

    // Ce composant n’affiche plus rien
    return null;
}
