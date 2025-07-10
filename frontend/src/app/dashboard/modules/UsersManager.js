export default function UsersManager({ users, loading }) {
    return (
        <section>
            <h1 className="text-2xl font-semibold text-purple-700 mb-2">Gestion des utilisateurs</h1>
            {loading ? (
                <div className="mt-6 text-gray-500">Chargement...</div>
            ) : (
                <ul className="mt-6 space-y-2">
                    {users.length === 0 ? (
                        <li className="text-gray-400">Aucun utilisateur trouvé.</li>
                    ) : users.map(u => (
                        <li key={u.id} className="p-3 bg-purple-50 rounded shadow flex justify-between items-center">
                            <span>{u.prenom} {u.nom} <span className="text-xs text-gray-400 ml-2">({u.role})</span></span>
                            <span className="text-sm text-gray-500">{u.email}</span>
                        </li>
                    ))}
                </ul>
            )}
        </section>
    );
}
