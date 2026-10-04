import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Task1Modal from './pages/Task1Modal';
import Task2Iframe from './pages/Task2Iframe';
import Task3Broadcast from './pages/Task3Broadcast';
import Task4LocalStorage from './pages/Task4LocalStorage';
import Task5Youtube from './pages/Task5Youtube';
import Task6SocketChat from './pages/Task6SocketChat';
import Task7NestedSet from "./pages/Task7NestedSet.tsx";

export default function App() {
	return (
		<Routes>
			<Route path="/" element={<Home />} />
			<Route path="/task1" element={<Task1Modal />} />
			<Route path="/task2" element={<Task2Iframe />} />
			<Route path="/task3" element={<Task3Broadcast />} />
			<Route path="/task4" element={<Task4LocalStorage />} />
			<Route path="/task5" element={<Task5Youtube />} />
			<Route path="/task6" element={<Task6SocketChat />} />
			<Route path="/task7" element={<Task7NestedSet />} />
		</Routes>
	);
}