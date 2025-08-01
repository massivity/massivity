import { useEffect, useState } from 'react';
import api from '../../../utils/api';

export default function useUsers(selectedMenu) {
    const [usersList, setUsersList] = useState([]);
    const [loadingUsers, setLoadingUsers] = useState(false);

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

    return { usersList, loadingUsers };
}