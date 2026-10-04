import { useEffect, useRef, useState } from "react";
import { io } from "socket.io-client";

const socket = io("http://localhost:3001");

interface Message {
    author: string;
    text: string;
    time: number;
}

const colors = ["bg-indigo-500", "bg-green-600", "bg-pink-500", "bg-orange-500", "bg-teal-500"];
const getColor = (name: string) => colors[name.length % colors.length];

function Avatar({ name, size = "h-10 w-10" }: { name: string; size?: string }) {
    return (
        <div
            className={`${size} ${getColor(name)} flex shrink-0 items-center justify-center rounded-full font-bold text-white`}
        >
            {name[0]?.toUpperCase()}
        </div>
    );
}

export default function Task6SocketChat() {
    // ім'я та кімната беруться з localStorage, якщо були збережені
    const [name, setName] = useState(localStorage.getItem("chatName") ?? "");
    const [loggedIn, setLoggedIn] = useState(!!localStorage.getItem("chatName"));
    const [room, setRoom] = useState(localStorage.getItem("chatRoom") ?? "");

    const [rooms, setRooms] = useState<string[]>([]);
    const [online, setOnline] = useState<string[]>([]);
    const [newRoom, setNewRoom] = useState("");
    const [messages, setMessages] = useState<Message[]>([]);
    const [text, setText] = useState("");
    const [typingUser, setTypingUser] = useState("");
    const timer = useRef<number | undefined>(undefined);
    const bottomRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        // повернутись у чат після оновлення сторінки або перепідключення
        const restore = () => {
            const savedName = localStorage.getItem("chatName");
            const savedRoom = localStorage.getItem("chatRoom");
            if (savedName) socket.emit("login", savedName);
            if (savedRoom) socket.emit("joinRoom", savedRoom);
        };
        if (socket.connected) restore();
        socket.on("connect", restore);

        socket.on("rooms", setRooms);
        socket.on("online", setOnline);
        socket.on("history", setMessages); // історія кімнати
        socket.on("message", (m: Message) => setMessages((prev) => [...prev, m]));
        socket.on("typing", ({ user, isTyping }) => setTypingUser(isTyping ? user : ""));

        return () => {
            socket.off("connect", restore);
            socket.off("rooms");
            socket.off("online");
            socket.off("history");
            socket.off("message");
            socket.off("typing");
        };
    }, []);

    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    const login = () => {
        if (!name.trim()) return;
        localStorage.setItem("chatName", name);
        socket.emit("login", name);
        setLoggedIn(true);
    };

    const logout = () => {
        localStorage.removeItem("chatName");
        localStorage.removeItem("chatRoom");
        window.location.reload();
    };

    const createRoom = () => {
        if (!newRoom.trim()) return;
        socket.emit("createRoom", newRoom);
        joinRoom(newRoom);
        setNewRoom("");
    };

    const joinRoom = (r: string) => {
        localStorage.setItem("chatRoom", r);
        socket.emit("joinRoom", r);
        setRoom(r);
        setTypingUser("");
    };

    const onChange = (value: string) => {
        setText(value);
        socket.emit("typing", { room, isTyping: true });

        clearTimeout(timer.current);
        timer.current = window.setTimeout(() => {
            socket.emit("typing", { room, isTyping: false });
        }, 1000);
    };

    const send = () => {
        if (!text.trim()) return;
        socket.emit("message", { room, text });
        socket.emit("typing", { room, isTyping: false });
        setText("");
    };

    // ---------- Екран входу ----------
    if (!loggedIn) {
        return (
            <div className="flex h-screen items-center justify-center bg-[#5865f2]">
                <div className="w-96 rounded-lg bg-[#313338] p-8 text-white shadow-xl">
                    <h1 className="mb-2 text-center text-2xl font-bold">Ласкаво просимо!</h1>
                    <p className="mb-6 text-center text-sm text-gray-400">Введи ім'я, щоб увійти в чат</p>
                    <input
                        className="mb-4 w-full rounded bg-[#1e1f22] p-2 outline-none"
                        placeholder="Ім'я"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        onKeyDown={(e) => e.key === "Enter" && login()}
                    />
                    <button
                        className="w-full rounded bg-[#5865f2] p-2 font-medium hover:bg-[#4752c4]"
                        onClick={login}
                    >
                        Увійти
                    </button>
                </div>
            </div>
        );
    }

    // ---------- Основний екран ----------
    return (
        <div className="flex h-screen bg-[#313338] text-gray-100">
            {/* Ліво: кімнати */}
            <div className="flex w-60 flex-col bg-[#2b2d31]">
                <div className="border-b border-black/30 p-3 font-bold">Кімнати</div>

                <div className="flex-1 overflow-y-auto p-2">
                    {rooms.map((r) => (
                        <div
                            key={r}
                            onClick={() => joinRoom(r)}
                            className={`cursor-pointer rounded px-2 py-1 ${
                                r === room
                                    ? "bg-[#404249] text-white"
                                    : "text-gray-400 hover:bg-[#35373c] hover:text-gray-200"
                            }`}
                        >
                            # {r}
                        </div>
                    ))}

                    <div className="mt-3 flex gap-1">
                        <input
                            className="min-w-0 flex-1 rounded bg-[#1e1f22] p-1 text-sm outline-none"
                            placeholder="Нова кімната"
                            value={newRoom}
                            onChange={(e) => setNewRoom(e.target.value)}
                            onKeyDown={(e) => e.key === "Enter" && createRoom()}
                        />
                        <button className="rounded bg-[#5865f2] px-2 hover:bg-[#4752c4]" onClick={createRoom}>
                            +
                        </button>
                    </div>
                </div>

                {/* Панель користувача внизу */}
                <div className="flex items-center gap-2 bg-[#232428] p-2">
                    <Avatar name={name} size="h-8 w-8" />
                    <span className="flex-1 text-sm font-medium">{name}</span>
                    <button className="text-xs text-gray-400 hover:text-white" onClick={logout}>
                        Вийти
                    </button>
                </div>
            </div>

            {/* Центр: чат */}
            <div className="flex flex-1 flex-col">
                {!room ? (
                    <div className="m-auto text-gray-400">Обери або створи кімнату</div>
                ) : (
                    <>
                        <div className="border-b border-black/30 p-3 font-bold"># {room}</div>

                        <div className="flex-1 overflow-y-auto p-4">
                            {messages.map((m, i) => (
                                <div key={i} className="mb-4 flex gap-3">
                                    <Avatar name={m.author} />
                                    <div>
                                        <div>
                                            <span className="font-medium">{m.author}</span>
                                            <span className="ml-2 text-xs text-gray-400">
                        {new Date(m.time).toLocaleString([], {
                            day: "2-digit",
                            month: "2-digit",
                            hour: "2-digit",
                            minute: "2-digit",
                        })}
                      </span>
                                        </div>
                                        <div className="text-gray-200">{m.text}</div>
                                    </div>
                                </div>
                            ))}
                            <div ref={bottomRef} />
                        </div>

                        <div className="px-4">
                            <input
                                className="w-full rounded-lg bg-[#383a40] p-3 outline-none"
                                placeholder={`Написати в #${room}`}
                                value={text}
                                onChange={(e) => onChange(e.target.value)}
                                onKeyDown={(e) => e.key === "Enter" && send()}
                            />
                            <div className="h-6 pt-1 text-sm font-medium">
                                {typingUser && `${typingUser} пише повідомлення...`}
                            </div>
                        </div>
                    </>
                )}
            </div>

            {/* Право: хто online */}
            <div className="w-60 bg-[#2b2d31] p-3">
                <div className="mb-2 text-xs font-bold uppercase text-gray-400">
                    Online — {online.length}
                </div>
                {online.map((u) => (
                    <div key={u} className="mb-1 flex items-center gap-2 rounded p-1 hover:bg-[#35373c]">
                        <div className="relative">
                            <Avatar name={u} size="h-8 w-8" />
                            <span className="absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full border-2 border-[#2b2d31] bg-green-500" />
                        </div>
                        <span className="text-sm">{u}</span>
                    </div>
                ))}
            </div>
        </div>
    );
}