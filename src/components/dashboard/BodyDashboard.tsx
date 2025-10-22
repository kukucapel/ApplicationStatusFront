import ApplicationsList from './ApplicationsList';
import FilterSideBar from './FilterSideBar';

export default function BodyDashboard() {
    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-8">
            <div className="flex flex-col lg:flex-row gap-6">
                <FilterSideBar />
                <ApplicationsList />
            </div>
        </div>
    );
}
