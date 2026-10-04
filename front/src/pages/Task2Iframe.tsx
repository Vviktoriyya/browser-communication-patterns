import { useEffect, useRef, useState } from 'react';
import {Link} from "react-router-dom";
import game from "../assets/img/game.jfif";

type Msg = { from: 'parent' | 'iframe'; text: string };

const childHtml = `
<!doctype html>
<html>
<head>
    <meta charset="utf-8" />
    <script src="https://cdn.tailwindcss.com"></script>
</head>

<body class="m-0 flex h-screen flex-col overflow-hidden bg-[#14132c] font-sans text-white">


    <!-- Messages -->
    <ul id="log" class="m-0 min-h-0 flex-1 list-none space-y-2 overflow-y-auto p-5"></ul>

    <!-- Input -->
    <div class="flex shrink-0 gap-2 border-t border-[#302d59] bg-[#101023] p-4">
        <input
            id="inp"
            placeholder="Написати повідомлення..."
            class="min-w-0 flex-1 border border-[#37345f] bg-[#0d0d1e] px-4 py-3 text-sm text-[#e7e7f3] outline-none placeholder:text-[#5e5d7e] focus:border-[#596cc4] focus:ring-1 focus:ring-[#596cc4]"
        />
        <button
            id="btn"
            class="bg-gradient-to-r from-[#405cb4] to-[#5946a0] px-6 text-xs font-bold uppercase tracking-wider text-white transition hover:brightness-110"
        >Send</button>
    </div>

<script>
    const log = document.getElementById('log');
    const inp = document.getElementById('inp');
    const btn = document.getElementById('btn');

    const empty = document.createElement('li');
    empty.className = 'text-sm text-[#5e5d7e]';
    empty.textContent = 'Повідомлень поки немає';
    log.appendChild(empty);

    function add(text, mine) {
        if (empty.parentNode) log.removeChild(empty);

        const li = document.createElement('li');
        li.className =
            'border-l-2 px-4 py-3 ' +
            (mine ? 'border-[#d5a238] bg-[#242039]' : 'border-[#596bc4] bg-[#19183a]');

        const label = document.createElement('div');
        label.className = 'mb-1 text-[9px] font-bold uppercase tracking-wider text-[#77769b]';
        label.textContent = mine ? 'You • Iframe' : 'Parent';

        const body = document.createElement('div');
        body.className = 'break-words text-sm text-[#d9d9e8]';
        body.textContent = text; 

        li.appendChild(label);
        li.appendChild(body);
        log.appendChild(li);
        log.scrollTop = log.scrollHeight;
    }

 
    window.addEventListener('message', function (e) {
        if (e.source !== window.parent) return;
        if (e.data && e.data.type === 'chat' && typeof e.data.text === 'string') {
            add(e.data.text, false);
        }
    });

    function send() {
        const value = inp.value.trim();
        if (!value) return;
        // srcDoc + sandbox => origin iframe = "null", тому targetOrigin = '*'
        window.parent.postMessage({ type: 'chat', text: value }, '*');
        add(value, true);
        inp.value = '';
    }

    btn.addEventListener('click', send);
    inp.addEventListener('keydown', function (e) {
        if (e.key === 'Enter') send();
    });
</script>
</body>
</html>
`;

export default function Task2Iframe() {
    const iframeRef = useRef<HTMLIFrameElement>(null);
    const historyEndRef = useRef<HTMLDivElement>(null);

    const [text, setText] = useState('');
    const [messages, setMessages] = useState<Msg[]>([]);

    useEffect(() => {
        const onMessage = (e: MessageEvent) => {
            if (e.source !== iframeRef.current?.contentWindow) return;

            if (e.data?.type === 'chat' && typeof e.data.text === 'string') {
                setMessages((prev) => [...prev, { from: 'iframe', text: e.data.text }]);
            }
        };

        window.addEventListener('message', onMessage);
        return () => window.removeEventListener('message', onMessage);
    }, []);

    // Автопрокрутка історії до останнього повідомлення
    useEffect(() => {
        historyEndRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }, [messages]);

    const send = () => {
        const value = text.trim();
        if (!value) return;

        iframeRef.current?.contentWindow?.postMessage({ type: 'chat', text: value }, '*');
        setMessages((prev) => [...prev, { from: 'parent', text: value }]);
        setText('');
    };

    const panel =
        'flex h-[32rem] flex-col overflow-hidden border border-[#363264] bg-[#14132c] shadow-2xl shadow-black/50';
    const panelHeader =
        'flex shrink-0 items-center gap-3 border-b border-[#302d59] bg-gradient-to-r from-[#19183a] to-[#14132c] px-6 py-4';

    return (
        <div  className="relative flex min-h-screen items-center justify-center bg-cover bg-center bg-no-repeat"
              style={{ backgroundImage: `url(${game})` }}>
            <Link
                to="/"
                className="absolute left-4 top-4 rounded bg-white/80 px-3 py-1 text-sm hover:bg-white"
            >
                ←
            </Link>
            <div className="mx-auto max-w-6xl">
                <div className="mb-6 flex items-center gap-4 border-b border-[#302d59] pb-5">
                    <div className="flex h-12 w-12 items-center justify-center bg-gradient-to-br from-[#3155a6] to-[#5a3e9e] text-sm font-bold shadow-lg">
                        cs2
                    </div>
                    <div>
                        <h2 className="text-2xl font-bold uppercase tracking-wider text-[#e8e8f5]">Завдання про  postMessage communication</h2>

                    </div>
                </div>

                <div className="grid gap-6 w-[1200px] lg:grid-cols-2">
                    {/* PARENT */}
                    <section className={panel}>
                        <div className={panelHeader}>
                            <span className="h-2 w-2 bg-[#e0a82e] shadow-[0_0_10px_rgba(224,168,46,0.7)]" />
                            <h4 className="text-sm font-bold uppercase tracking-wider text-[#e4e4f2]">
                                Parent window
                            </h4>
                        </div>

                        <div className="min-h-0 flex-1 space-y-2 overflow-y-auto p-5">
                            {messages.length === 0 && (
                                <p className="text-sm text-[#5e5d7e]">Повідомлень немає</p>
                            )}

                            {messages.map((m, i) => (
                                <div
                                    key={i}
                                    className={`border-l-2 px-4 py-3 ${
                                        m.from === 'parent'
                                            ? 'border-[#596bc4] bg-[#19183a]'
                                            : 'border-[#d5a238] bg-[#242039]'
                                    }`}
                                >
                                    <div className="mb-1 text-[9px] font-bold uppercase tracking-wider text-[#77769b]">
                                        {m.from === 'parent' ? 'You • Parent' : 'Iframe'}
                                    </div>
                                    <div className="break-words text-sm text-[#d9d9e8]">{m.text}</div>
                                </div>
                            ))}
                            <div ref={historyEndRef} />
                        </div>

                        <div className="flex shrink-0 gap-2 border-t border-[#302d59] bg-[#101023] p-4">
                            <input
                                value={text}
                                onChange={(e) => setText(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && send()}
                                placeholder="Написати повідомлення..."
                                className="min-w-0 flex-1 border border-[#37345f] bg-[#0d0d1e] px-4 py-3 text-sm text-[#e7e7f3] outline-none placeholder:text-[#5e5d7e] focus:border-[#596cc4] focus:ring-1 focus:ring-[#596cc4]"
                            />
                            <button
                                onClick={send}
                                className="bg-gradient-to-r from-[#405cb4] to-[#5946a0] px-6 text-xs font-bold uppercase tracking-wider text-white transition hover:brightness-110"
                            >
                                Send
                            </button>
                        </div>
                    </section>

                    <section className={panel}>
                        <div className={panelHeader}>
                            <span className="h-2 w-2 bg-[#596bc4] shadow-[0_0_8px_rgba(89,107,196,0.7)]" />
                            <h4 className="text-sm font-bold uppercase tracking-wider text-[#e4e4f2]">
                                Iframe window
                            </h4>
                        </div>

                        <iframe
                            ref={iframeRef}
                            title="child"
                            srcDoc={childHtml}
                            sandbox="allow-scripts"
                            className="min-h-0 w-full flex-1 border-0 bg-[#14132c]"
                        />
                    </section>
                </div>
            </div>
        </div>
    );
}