import { createServer } from "http";
import { Server } from "socket.io";
import * as fs from "fs";

const FILE = "data.json";

interface Message {
    author: string;
    text: string;
    time: number;
}

// усі дані: кімнати та повідомлення кожної кімнати
let data: { rooms: string[]; messages: Record<string, Message[]> } = {
    rooms: [],
    messages: {},
};

// читаємо файл при запуску
if (fs.existsSync(FILE)) {
    data = JSON.parse(fs.readFileSync(FILE, "utf-8"));
}

// записуємо у файл
const save = () => fs.writeFileSync(FILE, JSON.stringify(data, null, 2));

const httpServer = createServer();
const io = new Server(httpServer, { cors: { origin: "*" } });

const users: Record<string, string> = {}; // id сокета -> ім'я (тільки поки online)

io.on("connection", (socket) => {
    // вхід
    socket.on("login", (name: string) => {
        users[socket.id] = name;
        io.emit("online", Object.values(users));
        socket.emit("rooms", data.rooms);
    });

    // створити кімнату
    socket.on("createRoom", (room: string) => {
        if (!data.rooms.includes(room)) {
            data.rooms.push(room);
            data.messages[room] = [];
            save();
        }
        io.emit("rooms", data.rooms);
    });

    // приєднатися до кімнати + отримати історію
    socket.on("joinRoom", (room: string) => {
        socket.rooms.forEach((r) => {
            if (r !== socket.id) socket.leave(r);
        });
        socket.join(room);
        console.log(users[socket.id], "зайшов у", room, "- повідомлень:", data.messages[room]?.length ?? 0);
        socket.emit("history", data.messages[room] ?? []);
    });

    // повідомлення
    socket.on("message", ({ room, text }) => {
        const msg: Message = { author: users[socket.id], text, time: Date.now() };

        if (!data.messages[room]) data.messages[room] = [];
        data.messages[room].push(msg);
        save();

        io.to(room).emit("message", msg);
    });

    // хтось друкує
    socket.on("typing", ({ room, isTyping }) => {
        socket.to(room).emit("typing", { user: users[socket.id], isTyping });
    });

    // вихід
    socket.on("disconnect", () => {
        delete users[socket.id];
        io.emit("online", Object.values(users));
    });
});

httpServer.listen(3001, () => console.log("Server: http://localhost:3001"));