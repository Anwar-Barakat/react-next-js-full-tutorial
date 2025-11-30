'use client';

import dynamic from 'next/dynamic';

const KanbanDemov50 = dynamic(() => import("./KanbanDemo").then((mod) => mod.KanbanDemo), { ssr: false });

export function KanbanClientWrapper() {
  return <KanbanDemov50 />;
}
