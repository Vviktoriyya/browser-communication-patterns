import { useEffect, useState } from 'react';
import { modalEmitter } from '../helpers/EventEmitter';

export default function Modal() {
    const [src, setSrc] = useState<string | null>(null);

    useEffect(() => {
        const offOpen = modalEmitter.on('modal:open', ({ src }) => setSrc(src));
        const offClose = modalEmitter.on('modal:close', () => setSrc(null));
        return () => {
            offOpen();
            offClose();
        };
    }, []);

    if (!src) return null;

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/60"
            onClick={() => modalEmitter.emit('modal:close')}
        >
            <img
                src={src}
                alt=""
                className="max-h-[80vh] max-w-[90vw] rounded-xl shadow-2xl"
                onClick={(e) => e.stopPropagation()}
            />
        </div>
    );
}