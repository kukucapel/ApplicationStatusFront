'use client';

import { Position } from '@/dtos/AdminDto';

interface ModalAdminPositionsProps {
    position: Position | null;
    setModalIsActive: () => void;
    loadPositions: () => Promise<void>;
}

export function ModalAdminPositions({
    position,
    setModalIsActive,
    loadPositions,
}: ModalAdminPositionsProps) {}
