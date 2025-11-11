'use client';

import BodyAdmin from '@/components/admin/BodyAdmin';
import { useUser } from '@/contexts/UserContext';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
export default function Admin() {
    const { user, loading } = useUser();
    const router = useRouter();
    useEffect(() => {
        if (!loading && user?.role === 'worker') router.push('dashboard');
    }, [user, router, loading]);

    return <>{user?.role !== 'worker' && <BodyAdmin />}</>;
}
