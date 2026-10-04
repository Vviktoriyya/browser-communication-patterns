const chips = [
    'Усі', 'Ігри', 'Мікси', 'Пряма трансляція', 'Пригодницький бойовик',
    'Мультфільми', 'Кулінарія', 'Нещодавні завантаження', 'Ви дивилися', 'Новинки для вас',
];

export default function FilterChips() {
    return (
        <div className="flex gap-3 overflow-x-auto border-b border-slate-200 px-6 py-3">
            {chips.map((chip, i) => (
                <button
                    key={chip}
                    type="button"
                    className={
                        'flex-shrink-0 rounded-lg px-3 py-1.5 text-sm font-medium ' +
                        (i === 0 ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-800 hover:bg-slate-200')
                    }
                >
                    {chip}
                </button>
            ))}
        </div>
    );
}