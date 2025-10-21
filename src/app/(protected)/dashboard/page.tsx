import BodyDashboard from '@/components/dashboard/BodyDashboard';
import CounterApplication from '@/components/dashboard/CounterApplication';
import Header from '@/components/dashboard/Header';

export default function Dashboard() {
    return (
        <div>
            <Header />
            <CounterApplication />
            <BodyDashboard />
        </div>
    );
}
