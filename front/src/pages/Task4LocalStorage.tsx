import { useEffect, useState } from 'react';

type Card = { id: number; text: string; column: string };

const KEY = 'kanban-board';

const COLUMNS = [
    { name: 'Todo', dot: 'bg-[#3fb950]', hint: 'Це ще не розпочато' },
    { name: 'In Progress', dot: 'bg-[#d29922]', hint: 'Це в роботі' },
    { name: 'Done', dot: 'bg-[#a371f7]', hint: 'Це завершено' },
];

const load = (): Card[] => {
    try {
        return JSON.parse(localStorage.getItem(KEY) ?? '[]');
    } catch {
        return [];
    }
};

export default function Task4Kanban() {
    const [cards, setCards] = useState<Card[]>(load);
    const [dragId, setDragId] = useState<number | null>(null);
    const [overCol, setOverCol] = useState<string | null>(null);
    const [adding, setAdding] = useState<string | null>(null);
    const [text, setText] = useState('');

    useEffect(() => {
        // Подія спрацьовує в інших вкладках, коли там змінили localStorage
        const onStorage = (e: StorageEvent) => {
            if (e.key === KEY || e.key === null) setCards(load());
        };

        window.addEventListener('storage', onStorage);
        return () => window.removeEventListener('storage', onStorage);
    }, []);

    const update = (next: Card[]) => {
        setCards(next);
        localStorage.setItem(KEY, JSON.stringify(next));
    };

    const add = (column: string) => {
        if (text.trim()) {
            update([...cards, { id: Date.now(), text, column }]);
        }
        setText('');
        setAdding(null);
    };

    const remove = (id: number) => update(cards.filter((c) => c.id !== id));

    const drop = (column: string) => {
        if (dragId !== null) {
            update(cards.map((c) => (c.id === dragId ? { ...c, column } : c)));
        }
        setDragId(null);
        setOverCol(null);
    };

    return (
        <div className="min-h-screen bg-[#0d1117] p-6 text-[#e6edf3]">
            <div className="mb-1 text-xl font-semibold">Завдання про синхронізацію даних між вкладками. Project board</div>

            <div className="grid grid-cols-3 gap-4">
                {COLUMNS.map((col) => {
                    const colCards = cards.filter((c) => c.column === col.name);

                    return (
                        <div
                            key={col.name}
                            onDragOver={(e) => {
                                e.preventDefault();
                                setOverCol(col.name);
                            }}
                            onDragLeave={() => setOverCol(null)}
                            onDrop={() => drop(col.name)}
                            className={`flex flex-col rounded-md border bg-[#161b22] ${
                                overCol === col.name ? 'border-[#388bfd]' : 'border-[#30363d]'
                            }`}
                        >

                            <div className="p-3">
                                <div className="flex items-center gap-2">
                                    <span className={`h-3 w-3 rounded-full ${col.dot}`} />
                                    <span className="font-semibold">{col.name}</span>
                                    <span className="rounded-full bg-[#30363d] px-2 text-xs">
                                        {colCards.length}
                                    </span>
                                </div>
                                <p className="mt-1 text-xs text-[#8b949e]">{col.hint}</p>
                            </div>

                            <div className="flex-1 space-y-2 px-3 pb-2">
                                {colCards.map((c) => (
                                    <div
                                        key={c.id}
                                        draggable
                                        onDragStart={() => setDragId(c.id)}
                                        className={`group flex cursor-grab items-start gap-2 rounded-md border border-[#30363d] bg-[#0d1117] p-3 text-sm hover:border-[#8b949e] ${
                                            dragId === c.id ? 'opacity-40' : ''
                                        }`}
                                    >
                                        <span
                                            className={`mt-1 h-3 w-3 shrink-0 rounded-full ${col.dot}`}
                                        />
                                        <span className="flex-1">{c.text}</span>
                                        <button
                                            onClick={() => remove(c.id)}
                                            className="text-[#8b949e] opacity-0 hover:text-[#f85149] group-hover:opacity-100"
                                        >
                                            ✕
                                        </button>
                                    </div>
                                ))}
                            </div>

                            <div className="border-t border-[#30363d] p-2">
                                {adding === col.name ? (
                                    <input
                                        autoFocus
                                        value={text}
                                        onChange={(e) => setText(e.target.value)}
                                        onKeyDown={(e) => {
                                            if (e.key === 'Enter') add(col.name);
                                            if (e.key === 'Escape') setAdding(null);
                                        }}
                                        onBlur={() => add(col.name)}
                                        placeholder="Введи назву і натисни Enter"
                                        className="w-full rounded-md border border-[#388bfd] bg-[#0d1117] px-2 py-1 text-sm outline-none"
                                    />
                                ) : (
                                    <button
                                        onClick={() => setAdding(col.name)}
                                        className="w-full rounded-md px-2 py-1 text-left text-sm text-[#8b949e] hover:bg-[#21262d] hover:text-[#e6edf3]"
                                    >
                                        + Add item
                                    </button>
                                )}
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}