import {
    Home,
    Clapperboard,
    ChevronRight,
    ChevronDown,
    User,
    History,
    ListVideo,
    Clock,
    ThumbsUp,
    Video,
    Download,
    Music2,
} from 'lucide-react';
import { useState } from 'react';

const mainLinks = [
    { icon: Home, label: 'Головна', active: true },
    { icon: Clapperboard, label: 'YouTube Shorts', active: false },
];

const youLinks = [
    { icon: User, label: 'Ваш канал' },
    { icon: History, label: 'Історія' },
    { icon: ListVideo, label: 'Списки відтворення' },
    { icon: Clock, label: 'Переглянути пізніше' },
    { icon: ThumbsUp, label: 'Відео, які сподобались' },
    { icon: Video, label: 'Ваші відео' },
    { icon: Download, label: 'Завантаження' },
];

const subscriptions = [
    { name: 'CheAnD TV - Ан...', color: 'bg-emerald-400', live: false },
    { name: 'CheAnD TV LIFE ...', color: 'bg-blue-500', live: false },
    { name: 'Romanko', color: 'bg-slate-300', live: false },
    { name: 'TPK PAI', color: 'bg-rose-300', live: false },
    { name: 'Davie504', color: 'bg-slate-700', live: false },
    { name: 'VideoFromSpace', color: 'bg-slate-900', live: false },
    { name: 'AdMe', color: 'bg-yellow-400', live: true },
];

function Row({
                 icon: Icon,
                 label,
                 active = false,
             }: {
    icon: typeof Home;
    label: string;
    active?: boolean;
}) {
    return (
        <button
            type="button"
            className={
                'flex w-full cursor-pointer items-center gap-5 rounded-lg px-3 py-2.5 text-left text-sm hover:bg-slate-100 ' +
                (active ? 'bg-slate-100 font-medium' : 'text-slate-800')
            }
        >
            <Icon size={20} strokeWidth={active ? 2.3 : 1.8} className="flex-shrink-0 text-slate-900" />
            <span className="truncate">{label}</span>
        </button>
    );
}

function SectionHeader({ title, open, onToggle }: { title: string; open: boolean; onToggle: () => void }) {
    return (
        <button
            type="button"
            onClick={onToggle}
            className="flex w-full cursor-pointer items-center gap-1 px-3 py-2 text-left text-base font-medium text-slate-900 hover:bg-slate-100 rounded-lg"
        >
            {title}
            {open ? <ChevronDown size={18} /> : <ChevronRight size={18} />}
        </button>
    );
}

export default function Sidebar() {
    const [subsOpen, setSubsOpen] = useState(true);
    const [youOpen, setYouOpen] = useState(true);
    const [showAllSubs, setShowAllSubs] = useState(false);
    const [showAllYou, setShowAllYou] = useState(false);

    const visibleSubs = showAllSubs ? subscriptions : subscriptions.slice(0, 6);
    const visibleYouLinks = showAllYou ? youLinks : youLinks.slice(0, 4);

    return (
        <aside className="hidden w-60 flex-shrink-0 overflow-y-auto bg-white px-2 py-3 md:block">
            {/* Головна / Shorts */}
            <nav className="flex flex-col gap-1 border-b border-slate-200 pb-3">
                {mainLinks.map((l) => (
                    <Row key={l.label} icon={l.icon} label={l.label} active={l.active} />
                ))}
            </nav>

            {/* Підписки */}
            <div className="border-b border-slate-200 py-3">
                <SectionHeader title="Підписки" open={subsOpen} onToggle={() => setSubsOpen((v) => !v)} />
                {subsOpen && (
                    <nav className="mt-1 flex flex-col gap-1">
                        {visibleSubs.map((s) => (
                            <button
                                key={s.name}
                                type="button"
                                className="flex w-full cursor-pointer items-center gap-5 rounded-lg px-3 py-2 text-left text-sm text-slate-800 hover:bg-slate-100"
                            >
                                <span className={`h-6 w-6 flex-shrink-0 rounded-full ${s.color}`} />
                                <span className="flex-1 truncate">{s.name}</span>
                                {s.live ? (
                                    <span className="flex-shrink-0 text-xs text-red-500">(•)</span>
                                ) : (
                                    <span className="h-1.5 w-1.5 flex-shrink-0 rounded-full bg-slate-400" />
                                )}
                            </button>
                        ))}

                        <button
                            type="button"
                            onClick={() => setShowAllSubs((v) => !v)}
                            className="flex w-full cursor-pointer items-center gap-5 rounded-lg px-3 py-2 text-left text-sm text-slate-800 hover:bg-slate-100"
                        >
                            <ChevronDown size={18} className={showAllSubs ? 'rotate-180' : ''} />
                            {showAllSubs ? 'Показати менше' : 'Показати більше'}
                        </button>
                    </nav>
                )}
            </div>

            {/* Ви */}
            <div className="border-b border-slate-200 py-3">
                <SectionHeader title="Ви" open={youOpen} onToggle={() => setYouOpen((v) => !v)} />
                {youOpen && (
                    <nav className="mt-1 flex flex-col gap-1">
                        {visibleYouLinks.map((l) => (
                            <Row key={l.label} icon={l.icon} label={l.label} />
                        ))}

                        <button
                            type="button"
                            onClick={() => setShowAllYou((v) => !v)}
                            className="flex w-full cursor-pointer items-center gap-5 rounded-lg px-3 py-2 text-left text-sm text-slate-800 hover:bg-slate-100"
                        >
                            <ChevronDown size={18} className={showAllYou ? 'rotate-180' : ''} />
                            {showAllYou ? 'Показати менше' : 'Показати більше'}
                        </button>
                    </nav>
                )}
            </div>

            {/* Що нового */}
            <div className="py-3">
                <p className="px-3 pb-1 text-base font-medium text-slate-900">Що нового</p>
                <nav className="mt-1 flex flex-col gap-1">
                    <Row icon={Music2} label="Музика" />
                </nav>
            </div>
        </aside>
    );
}