import { Link } from 'react-router-dom';
import Modal from '../components/Modal';
import { modalEmitter } from '../helpers/EventEmitter';
import gubka from '../assets/img/gubka.png';
import bgB from '../assets/img/bgB.jfif';

export default function Task1Modal() {
    return (
        <div
            className="relative flex-col flex min-h-screen items-center justify-center bg-cover gap-[50px] bg-center bg-no-repeat"
            style={{ backgroundImage: `url(${bgB})` }}
        >
            <p className='text-2xl font-bold text-[30px]'>Завдання про event emitter Modal box</p>
            <Link
                to="/"
                className="absolute left-4 top-4 rounded bg-white/80 px-3 py-1 text-sm hover:bg-white"
            >
                ←
            </Link>


            <button
                className="rounded-lg  border-[2px] bg-yellow-500 px-6 py-3 text-[40px] font-bold text-black hover:bg-yellow-700"
                onClick={() => modalEmitter.emit('modal:open', { src: gubka })}
            >
                open
            </button>

            <Modal />
        </div>
    );
}