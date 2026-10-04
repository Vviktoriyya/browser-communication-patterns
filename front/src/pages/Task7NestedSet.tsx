import { useState } from 'react';
import { Link } from 'react-router-dom';
import {
    buildNestedSet,
    familyTree,
    findParent,
    findAllParent,
    findPath,
    findDirectChildren,
    findAllChildren,
    findLeaves,
    findDirectSiblings,
    countDirectChildren,
    countDescendants,
    getSubtree,
    type NSNode,
} from '../helpers/nestedSet';

// рахуємо left/right/depth один раз
const tree = buildNestedSet(familyTree);

const names = (nodes: NSNode[], sep = ', ') =>
    nodes.map((n) => n.name).join(sep) || '—';

export default function Task7NestedSet() {
    const [id, setId] = useState(1);
    const selected = tree.find((n) => n.id === id)!;

    const rows: [string, string][] = [
        ['Батько', findParent(tree, id)?.name ?? '—'],
        ['Усі предки', names(findAllParent(tree, id))],
        ['Шлях від кореня', names(findPath(tree, id), ' → ')],
        ['Прямі діти', names(findDirectChildren(tree, id))],
        ['Усі нащадки', names(findAllChildren(tree, id))],
        ['Листки', names(findLeaves(tree, id))],
        ['Брати / сестри', names(findDirectSiblings(tree, id))],
        ['Кількість прямих дітей', String(countDirectChildren(tree, id))],
        ['Кількість нащадків', String(countDescendants(tree, id))],
    ];

    return (
        <div className="min-h-screen bg-slate-900 p-6 text-slate-100">
            <Link to="/" className="rounded bg-white/80 px-3 py-1 text-sm text-black hover:bg-white">
                ←
            </Link>

            <h2 className="mb-1 mt-4 text-2xl font-semibold">Task 7: Nested Set</h2>
            <p className="mb-4 text-slate-400">
                Клікни на людину, і побачиш результат усіх методів. Біля імені: [left, right],
                depth.
            </p>

            <div className="grid gap-6 lg:grid-cols-2">
                {/* Дерево */}
                <div className="h-[75vh] overflow-y-auto rounded-lg border border-slate-700 p-3">
                    {tree.map((n) => (
                        <div
                            key={n.id}
                            onClick={() => setId(n.id)}
                            style={{ paddingLeft: n.depth * 20 }}
                            className={`cursor-pointer rounded px-2 py-1 text-sm hover:bg-slate-800 ${
                                n.id === id ? 'bg-blue-600 hover:bg-blue-600' : ''
                            }`}
                        >
                            {n.name}{' '}
                            <span className="text-xs text-slate-400">
                                [{n.left}, {n.right}] d{n.depth}
                            </span>
                        </div>
                    ))}
                </div>

                {/* Результати методів */}
                <div className="h-[75vh] overflow-y-auto rounded-lg border border-slate-700 p-4">
                    <h3 className="mb-3 text-lg font-semibold">
                        {selected.name}{' '}
                        <span className="text-sm font-normal text-slate-400">
                            left {selected.left} · right {selected.right} · depth {selected.depth}
                        </span>
                    </h3>

                    {rows.map(([label, value]) => (
                        <div key={label} className="mb-3">
                            <div className="text-xs uppercase text-slate-400">{label}</div>
                            <div className="text-sm">{value}</div>
                        </div>
                    ))}

                    <details>
                        <summary className="cursor-pointer text-xs uppercase text-slate-400">
                            Піддерево (getSubtree)
                        </summary>
                        <pre className="mt-2 text-xs">
                            {JSON.stringify(getSubtree(tree, id), null, 2)}
                        </pre>
                    </details>
                </div>
            </div>
        </div>
    );
}