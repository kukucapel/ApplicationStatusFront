'use client';

import BodyAdmin from '@/components/admin/BodyAdmin';
import { useUser } from '@/contexts/UserContext';
import { useRouter } from 'next/navigation';
export default function Admin() {
    const { user } = useUser();
    const router = useRouter();
    return (
        <>{user?.role === 'admin' ? <BodyAdmin /> : router.push('dashboard')}</>
    );
}
