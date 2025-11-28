'use client';

import dynamic from 'next/dynamic';

const KanbanDemov50 = dynamic(() => import("../components/50-redux-kanban-board").then((mod) => mod.KanbanDemo), { ssr: false });

export function KanbanClientWrapper() {
  return <KanbanDemov50 />;
}
