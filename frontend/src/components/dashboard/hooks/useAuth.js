import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import api from '../../../utils/api';

export default function useAuth() {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const token = localStorage.getItem('accessToken');
                if (!token) throw new Error("No token");
                const res = await api.get('/auth/profil', {
                    headers: { Authorization: `Bearer ${token}` }
                });
                if (!res.data.user || res.data.user.role !== 'admin') throw new Error("Unauthorized");
                setUser(res.data.user);
            } catch {
                router.replace('/login');
            } finally {
                setLoading(false);
            }
        };
        fetchUser();
    }, [router]);

    return { user, loading };
}
