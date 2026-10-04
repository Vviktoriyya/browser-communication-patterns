type Listener<T> = (payload: T) => void;

export class EventEmitter<Events extends Record<string, unknown>> {
    private listeners = new Map<keyof Events, Set<Listener<any>>>();

    on<K extends keyof Events>(event: K, listener: Listener<Events[K]>): () => void {
        if (!this.listeners.has(event)) this.listeners.set(event, new Set());
        this.listeners.get(event)!.add(listener);
        return () => this.listeners.get(event)?.delete(listener); // відписка
    }

    emit<K extends keyof Events>(
        event: K,
        ...args: Events[K] extends void ? [] : [payload: Events[K]]
    ): void {
        this.listeners.get(event)?.forEach((listener) => listener(args[0]));
    }
}

type ModalEvents = {
    'modal:open': { src: string };
    'modal:close': void;
};

export const modalEmitter = new EventEmitter<ModalEvents>();