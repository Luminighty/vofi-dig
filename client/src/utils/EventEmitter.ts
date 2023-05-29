type Listener<Event> = (event: Event) => void;

export class EventEmitter<Event> {
	private listeners: Listener<Event>[] = [];

	addListener(listeners: Listener<Event>) {
		this.listeners.push(listeners);
	}

	notify(event: Event) {
		this.listeners.forEach((l) => l(event));
	}
}