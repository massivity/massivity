import DashboardHome from '../../../src/app/dashboard/modules/DashboardHome';
import UsersManager from '../../../src/app/dashboard/modules/UsersManager';
import Settings from '../../../src/app/dashboard/modules/Settings';
import AvisManager from '../../../src/app/dashboard/modules/AvisManager';
import Wip from '../../../src/app/dashboard/modules/wip';

export default function MainContent({ selectedMenu, user, users, loadingUsers }) {
    switch (selectedMenu) {
        case 'home':
            return <DashboardHome user={user} />;
        case 'users':
            return <UsersManager users={users} loading={loadingUsers} />;
        case 'settings':
            return <Wip />;
        case 'avis':
            return <AvisManager />;
        case 'dashboard_avis':
            return <Wip />;
        default:
            return null;
    }
}