import { Link } from 'react-router-dom';
import type { ReactNode } from 'react';
import youtube from "../../assets/img/youtube/youtube.png";
import plus from "../../assets/img/youtube/plus.png";
import bell from "../../assets/img/youtube/bell.png";
interface HeaderProps {
    searchSlot: ReactNode;
}

export default function Header({ searchSlot }: HeaderProps) {
    return (
        <header className="flex h-14 flex-shrink-0 items-center gap-4 border-b border-slate-200 px-4">
            <div className="flex flex-shrink-0 items-center gap-4">
                <button
                    type="button"
                    aria-label="Меню"
                    className="flex h-10 w-10 items-center justify-center rounded-full text-xl hover:bg-slate-100"
                >
                    ☰
                </button>

                <Link to="/" className="flex items-center gap-1">
                    <img src={youtube} alt="Logo" className="h-[] w-[100px] object-contain" />
                    <sup className="ml-0.5 text-[10px] font-semibold text-slate-400">UA</sup>
                </Link>
            </div>

            <div className="flex flex-1 justify-center">
                <div className="w-full max-w-xl">{searchSlot}</div>
            </div>

            <div className="flex flex-shrink-0 items-center gap-3">
                <button
                    type="button"
                    className="flex items-center gap-[3px] rounded-full bg-slate-100 px-[10px] py-[5px] text-sm font-medium text-slate-800 hover:bg-slate-200"
                >
                    <img src={plus} alt="plus" className=" w-[30px] object-contain" />
                    <p className="text-bold text-[15px]">Створити</p>
                </button>

                <button
                    type="button"
                    aria-label="Сповіщення"
                    className="relative flex h-10 w-10 items-center justify-center rounded-full text-xl hover:bg-slate-100"
                >
                    <img src={bell} alt="bell" className=" w-[30px] object-contain" />

                </button>

                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-pink-500 text-sm font-bold text-white">
                    W
                </div>
            </div>
        </header>
    );
}