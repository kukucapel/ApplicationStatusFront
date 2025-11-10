'use client';

import { logoutUser } from '@/lib/auth';
import {
    createContext,
    ReactNode,
    useContext,
    useEffect,
    useState,
} from 'react';

export interface User {
    id: number;
    name: string;
    role?: string;
}

interface UserContextType {
    user: User | null;
    setUser: (user: User) => void;
    logout: () => void;
    loading: boolean;
}

interface UserProviderProps {
    children: ReactNode;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({ children }: UserProviderProps) {
    const [user, setUserState] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            try {
                setUserState(JSON.parse(storedUser));
            } catch {
                localStorage.removeItem('user');
            }
        }
        setLoading(false);
    }, []);

    const setUser = (newUser: User) => {
        setUserState(newUser);
        localStorage.setItem('user', JSON.stringify(newUser));
    };

    const logout = async () => {
        await logoutUser();
        localStorage.removeItem('user');
    };

    return (
        <UserContext.Provider value={{ user, setUser, logout, loading }}>
            {children}
        </UserContext.Provider>
    );
}

export function useUser() {
    const context = useContext(UserContext);
    if (!context) throw new Error('useUser must be used within UserProvider');
    return context;
}
