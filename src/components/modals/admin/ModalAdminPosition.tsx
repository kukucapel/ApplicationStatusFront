'use client';

import { useUser } from '@/contexts/UserContext';
import { Position, PositionUpdate } from '@/dtos/AdminDto';
import { useState } from 'react';

interface ModalAdminPositionsProps {
    position: Position | null;
    setModalIsActive: () => void;
    loadPositions: () => Promise<void>;
}

export function ModalAdminPositions({
    position,
    setModalIsActive,
    loadPositions,
}: ModalAdminPositionsProps) {
    const { user } = useUser();

    const [form, setForm] = useState<PositionUpdate>({
        position_title_id: position?.title.id || null,
        unit_id: position?.unit.id || null,
    });
}
