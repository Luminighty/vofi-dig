export function createIdGenerator() {
	let id = 0;
	return () => id++;
}

export const getId = createIdGenerator();
