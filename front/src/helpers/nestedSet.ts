// ============================================================
// NESTED SET: дерево, де кожен вузол має left, right, depth
// ============================================================

export type Person = { id: number; name: string; parentId: number | null };
export type NSNode = Person & { left: number; right: number; depth: number };
export type SubtreeNode = { id: number; name: string; children: SubtreeNode[] };

export const familyTree: Person[] = [
    { id: 1, name: 'Прадед Гриша', parentId: null },

    { id: 2, name: 'Дед Вася', parentId: 1 },
    { id: 3, name: 'Бабка Маша', parentId: 1 },
    { id: 4, name: 'Дед Миша', parentId: 1 },

    { id: 5, name: 'Тетя Таня', parentId: 2 },
    { id: 6, name: 'Дядя Вадик', parentId: 2 },
    { id: 7, name: 'Тетя Оля', parentId: 2 },
    { id: 8, name: 'Тетя Валя', parentId: 2 },

    { id: 9, name: 'Дядя Гарик', parentId: 3 },
    { id: 10, name: 'Дядя Ваня', parentId: 3 },

    { id: 11, name: 'Папа Сергей', parentId: 4 },
    { id: 12, name: 'Тетя Ира', parentId: 4 },
    { id: 13, name: 'Тетя Наташа', parentId: 4 },
    { id: 14, name: 'Дядя Игорь', parentId: 4 },
    { id: 15, name: 'Дядя Кирилл', parentId: 4 },

    { id: 16, name: 'Я (Вася)', parentId: 11 },
    { id: 17, name: 'Сестра Аня', parentId: 11 },
    { id: 18, name: 'Брат Коля', parentId: 11 },

    { id: 19, name: 'Кузен Дима', parentId: 12 },
    { id: 20, name: 'Кузина Лена', parentId: 12 },

    { id: 21, name: 'Кузина Света', parentId: 13 },
    { id: 22, name: 'Кузен Саша', parentId: 13 },

    { id: 23, name: 'Кузен Андрей', parentId: 14 },
    { id: 24, name: 'Кузен Петр', parentId: 14 },

    { id: 25, name: 'Кузина Катя', parentId: 15 },
    { id: 26, name: 'Кузен Женя', parentId: 15 },
    { id: 27, name: 'Кузен Максим', parentId: 15 },

    { id: 28, name: 'Кузен Рома', parentId: 5 },
    { id: 29, name: 'Кузина Вика', parentId: 5 },

    { id: 30, name: 'Кузен Тимур', parentId: 6 },
    { id: 31, name: 'Кузен Олег', parentId: 6 },

    { id: 32, name: 'Кузина Юля', parentId: 7 },

    { id: 33, name: 'Кузина Алина', parentId: 8 },
    { id: 34, name: 'Кузен Марк', parentId: 8 },

    { id: 35, name: 'Кузен Артем', parentId: 9 },
    { id: 36, name: 'Кузина Настя', parentId: 9 },

    { id: 37, name: 'Кузен Илья', parentId: 10 },

    { id: 38, name: 'Сын Даня', parentId: 16 },
    { id: 39, name: 'Дочь София', parentId: 16 },

    { id: 40, name: 'Племянник Кирюша', parentId: 17 },

    { id: 41, name: 'Племянница Мила', parentId: 18 },
];

// ============================================================
// 1. РОЗРАХУНОК left / right / depth
// ============================================================
// Обходимо дерево вглиб (DFS). Лічильник росте на 1 при вході у вузол (left)
// і на 1 при виході з нього (right). Depth = рівень вкладеності (корінь = 0).
export function buildNestedSet(people: Person[]): NSNode[] {
    // parentId -> список дітей
    const childrenOf = new Map<number | null, Person[]>();
    for (const p of people) {
        const list = childrenOf.get(p.parentId) ?? [];
        list.push(p);
        childrenOf.set(p.parentId, list);
    }

    const result: NSNode[] = [];
    let counter = 1;

    const visit = (person: Person, depth: number) => {
        const node: NSNode = { ...person, left: counter++, right: 0, depth };
        result.push(node); // порядок = за зростанням left

        for (const child of childrenOf.get(person.id) ?? []) {
            visit(child, depth + 1);
        }

        node.right = counter++;
    };

    for (const root of childrenOf.get(null) ?? []) visit(root, 0);

    return result;
}

// ============================================================
// Допоміжна функція: знайти вузол за id
// ============================================================
const getNode = (tree: NSNode[], id: number): NSNode | undefined =>
    tree.find((n) => n.id === id);

// ============================================================
// 2. МЕТОДИ (працюють тільки з left, right, depth)
// ============================================================
// Ключова ідея:
//   B потомок A       <=>  B.left > A.left  && B.right < A.right
//   B прямий потомок  <=>  те саме + B.depth === A.depth + 1
//   B предок A        <=>  B.left < A.left  && B.right > A.right

// Усі нащадки (діти, онуки, правнуки...)
export function findAllChildren(tree: NSNode[], parentID: number): NSNode[] {
    const p = getNode(tree, parentID);
    if (!p) return [];
    return tree.filter((n) => n.left > p.left && n.right < p.right);
}

// Тільки прямі діти
export function findDirectChildren(tree: NSNode[], parentID: number): NSNode[] {
    const p = getNode(tree, parentID);
    if (!p) return [];
    return tree.filter(
        (n) => n.left > p.left && n.right < p.right && n.depth === p.depth + 1
    );
}

// Прямий батько
export function findParent(tree: NSNode[], userID: number): NSNode | null {
    const u = getNode(tree, userID);
    if (!u) return null;
    return (
        tree.find((n) => n.left < u.left && n.right > u.right && n.depth === u.depth - 1) ??
        null
    );
}

// Усі предки до кореня (від найближчого до кореня)
export function findAllParent(tree: NSNode[], userID: number): NSNode[] {
    const u = getNode(tree, userID);
    if (!u) return [];
    return tree
        .filter((n) => n.left < u.left && n.right > u.right)
        .sort((a, b) => b.depth - a.depth);
}

// Усі брати й сестри, тобто вузли з тим самим батьком (включно з самим вузлом)
export function findSiblings(tree: NSNode[], userID: number): NSNode[] {
    const u = getNode(tree, userID);
    if (!u) return [];
    const parent = findParent(tree, userID);
    if (!parent) return [u]; // корінь: братів немає
    return findDirectChildren(tree, parent.id);
}

// Рідні брати/сестри без самого вузла
export function findDirectSiblings(tree: NSNode[], userID: number): NSNode[] {
    return findSiblings(tree, userID).filter((n) => n.id !== userID);
}

// Усі нащадки-«листки» (без дітей). Листок: right === left + 1
export function findLeaves(tree: NSNode[], parentID: number): NSNode[] {
    return findAllChildren(tree, parentID).filter((n) => n.right === n.left + 1);
}

// Корінь дерева
export function findRoot(tree: NSNode[]): NSNode | null {
    return tree.find((n) => n.depth === 0) ?? null;
}

// Усі вузли на заданій глибині
export function findDepthNodes(tree: NSNode[], depth: number): NSNode[] {
    return tree.filter((n) => n.depth === depth);
}

// Шлях від кореня до вузла (включно з самим вузлом)
export function findPath(tree: NSNode[], userID: number): NSNode[] {
    const u = getNode(tree, userID);
    if (!u) return [];
    return tree
        .filter((n) => n.left <= u.left && n.right >= u.right)
        .sort((a, b) => a.depth - b.depth);
}

// Кількість усіх нащадків: формула без перебору, (right - left - 1) / 2
export function countDescendants(tree: NSNode[], parentID: number): number {
    const p = getNode(tree, parentID);
    return p ? (p.right - p.left - 1) / 2 : 0;
}

// Кількість прямих дітей
export function countDirectChildren(tree: NSNode[], parentID: number): number {
    return findDirectChildren(tree, parentID).length;
}

// Чи є ancestorID предком nodeID
export function isAncestor(tree: NSNode[], ancestorID: number, nodeID: number): boolean {
    const a = getNode(tree, ancestorID);
    const n = getNode(tree, nodeID);
    if (!a || !n) return false;
    return a.left < n.left && a.right > n.right;
}

// Чи є nodeID нащадком ancestorID
export function isDescendant(tree: NSNode[], nodeID: number, ancestorID: number): boolean {
    return isAncestor(tree, ancestorID, nodeID);
}

// Піддерево у вигляді вкладеної структури
export function getSubtree(tree: NSNode[], parentID: number): SubtreeNode | null {
    const p = getNode(tree, parentID);
    if (!p) return null;
    return {
        id: p.id,
        name: p.name,
        children: findDirectChildren(tree, p.id).map((c) => getSubtree(tree, c.id)!),
    };
}

// Усі вузли на певному рівні (0 = корінь, 1 = діти кореня, ...)
export function getAllNodesAtLevel(tree: NSNode[], level: number): NSNode[] {
    return tree.filter((n) => n.depth === level);
}