import { useEffect, useRef, useState } from 'react';

type Msg = { tabId: string; text: string; ts: number };

// унікальний id поточної вкладки
const TAB_ID = Math.random().toString(36).slice(2, 7);

// Хук: відкриває канал, слухає повідомлення, повертає функцію send
function useBroadcast<T>(name: string, onMessage: (data: T) => void) {
    const channelRef = useRef<BroadcastChannel | null>(null);
    const handlerRef = useRef(onMessage);
    handlerRef.current = onMessage;

    useEffect(() => {
        const channel = new BroadcastChannel(name);
        channelRef.current = channel;

        channel.onmessage = (e: MessageEvent<T>) => handlerRef.current(e.data);

        return () => {
            channel.close();
            channelRef.current = null;
        };
    }, [name]);

    return (data: T) => channelRef.current?.postMessage(data);
}

export default function Task3Broadcast() {
    const [text, setText] = useState('');
    const [messages, setMessages] = useState<Msg[]>([]);
    const bottomRef = useRef<HTMLDivElement>(null);

    const send = useBroadcast<Msg>('tabs-demo-channel', (msg) => {
        setMessages((prev) => [...prev, msg]);
    });

    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const handleSend = () => {
        if (!text.trim()) return;

        const msg: Msg = {
            tabId: TAB_ID,
            text,
            ts: Date.now(),
        };

        send(msg);
        setMessages((prev) => [...prev, msg]);
        setText('');
    };

    return (
        <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-emerald-950 via-green-900 to-teal-950 p-6">
            <div className="w-full max-w-xl rounded-3xl border border-emerald-400/20 bg-black/20 p-6 shadow-2xl backdrop-blur-md">

                <h2 className="mb-2 text-2xl font-bold text-white">
                    Завдання про Broadcast Channel
                </h2>

                <p className="mb-5 text-emerald-200">
                    Це вкладка: <b className="text-white">{TAB_ID}</b>
                </p>

                <div className="mb-4 h-80 space-y-2 overflow-y-auto rounded-2xl border border-emerald-400/20 bg-black/20 p-4">
                    {messages.length === 0 && (
                        <p className="text-center text-emerald-300/60">
                            Повідомлень немає
                        </p>
                    )}

                    {messages.map((m, i) => {
                        const mine = m.tabId === TAB_ID;

                        return (
                            <div
                                key={i}
                                className={`flex ${mine ? 'justify-end' : 'justify-start'}`}
                            >
                                <div
                                    className={`max-w-[75%] rounded-2xl px-4 py-3 ${
                                        mine
                                            ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-900/30'
                                            : 'border border-emerald-400/10 bg-white/10 text-white backdrop-blur-sm'
                                    }`}
                                >
                                    <div
                                        className={`mb-1 text-xs ${
                                            mine
                                                ? 'text-emerald-100'
                                                : 'text-emerald-300'
                                        }`}
                                    >
                                        {mine ? 'Ви' : `Вкладка ${m.tabId}`} ·{' '}
                                        {new Date(m.ts).toLocaleTimeString()}
                                    </div>

                                    {m.text}
                                </div>
                            </div>
                        );
                    })}

                    <div ref={bottomRef} />
                </div>

                <div className="flex gap-2">
                    <input
                        value={text}
                        onChange={(e) => setText(e.target.value)}
                        onKeyDown={(e) =>
                            e.key === 'Enter' && handleSend()
                        }
                        placeholder="Повідомлення для вкладок =D"
                        className="flex-1 rounded-xl border border-emerald-400/20 bg-black/20 px-4 py-3 text-white placeholder:text-emerald-200/40 focus:outline-none focus:ring-2 focus:ring-emerald-400"
                    />

                    <button
                        onClick={handleSend}
                        className="rounded-xl bg-emerald-500 px-5 py-3 font-semibold text-white transition hover:bg-emerald-400"
                    >
                        Надіслати
                    </button>
                </div>
            </div>
        </div>
    );
}