import keyboard from '../../assets/img/youtube/keyboard.png';
import search from '../../assets/img/youtube/search.png';
import mic from '../../assets/img/youtube/mic.png';

interface SearchBarProps {
    value: string;
    onChange: (value: string) => void;
    loading: boolean;
}

export default function SearchBar({ value, onChange, loading }: SearchBarProps) {
    return (
        <div className="mx-auto flex w-full max-w-xl items-center gap-3">
            <div className="relative h-11 flex-1 rounded-full border border-slate-300 focus-within:border-indigo-400">
                <input
                    type="text"
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    placeholder="Пошук"
                    autoComplete="off"
                    className="h-full w-full bg-transparent pl-4 pr-24 text-base text-slate-800 placeholder:text-slate-400 outline-none"
                />

                <div className="absolute right-0 top-0 flex h-full items-center gap-3 pr-4">
                    <img src={keyboard} alt="" className="h-6 w-6 flex-shrink-0 object-contain opacity-70" />

                    <span className="h-6 w-px flex-shrink-0 bg-slate-300" />

                    {loading ? (
                        <div className="h-5 w-5 flex-shrink-0 animate-spin rounded-full border-2 border-slate-300 border-t-indigo-600" />
                    ) : (
                        <button type="button" aria-label="Пошук" className="flex h-6 w-6 flex-shrink-0 cursor-pointer pb-[3px] items-center justify-center">
                            <img src={search} alt="" className="min-w-[40px] object-contain" />
                        </button>
                    )}
                </div>
            </div>

            <button
                type="button"
                aria-label="Голосовий пошук"
                className="flex h-11 w-11 flex-shrink-0 cursor-pointer items-center justify-center rounded-full bg-slate-100 hover:bg-slate-200"
            >
                <img src={mic} alt="" className="h-6 w-6 object-contain" />
            </button>
        </div>
    );
}