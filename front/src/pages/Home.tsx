import { Link } from 'react-router-dom';

import task1 from '../assets/img/task1.png';
import task2 from '../assets/img/task2.png';
import task3 from '../assets/img/task3.png';
import task4 from '../assets/img/task4.png';
import task5 from '../assets/img/task5.png';
import task6 from '../assets/img/task6.png';


const tasks = [
    { id: 1, image: task1, title: 'Modal Box — Event Emitter' },
    { id: 2, image: task2, title: 'postMessage' },
    { id: 3, image: task3, title: 'Broadcast Messages' },
    { id: 4, image: task4, title: 'Синхронізація даних між вікнами браузера — localStorage' },
    { id: 5, image: task5, title: 'YouTube' },
    { id: 6, image: task6, title: 'WebSocket' },
    { id: 7, image: task6, title: 'NestedSet' },
];

export default function Home() {
    return (
        <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-gradient-to-br from-indigo-950 via-purple-900 to-fuchsia-900 p-10">

            <div className="absolute -left-32 -top-32 h-96 w-96 rounded-full bg-fuchsia-500/30 blur-3xl" />

            <div className="absolute -bottom-32 -right-32 h-96 w-96 rounded-full bg-indigo-500/30 blur-3xl" />

            <div className="absolute left-1/2 top-1/2 h-80 w-80 -translate-x-1/2 -translate-y-1/2 rounded-full bg-purple-400/20 blur-3xl" />

            <div className="relative z-10 grid max-w-4xl grid-cols-2 gap-[80px] md:grid-cols-3">
                {tasks.map((task) => (
                    <Link
                        key={task.id}
                        to={`/task${task.id}`}
                        className="relative flex h-40 w-[300px] items-center justify-center overflow-hidden rounded-2xl bg-white shadow-md transition hover:-translate-y-2 hover:shadow-2xl"
                    >
                        <img
                            src={task.image}
                            alt={`Task ${task.id}`}
                            className="absolute inset-0 h-full w-full object-cover transition duration-300 hover:scale-105"
                        />

                        <div className="absolute inset-0 bg-black/30" />

                        <div className="relative z-10 rounded-2xl bg-black/70 px-5 py-3 text-center text-white">
                            <div className="text-3xl font-extrabold">
                                TASK {task.id}
                            </div>

                            <div className="mt-1 text-sm font-semibold">
                                {task.title}
                            </div>
                        </div>
                    </Link>
                ))}
            </div>
        </div>
    );
}