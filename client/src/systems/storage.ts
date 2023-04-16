export function getUserId() {
	return localStorage.getItem("uuid");
}

export function setUserId(uuid: string) {
	return localStorage.setItem("uuid", uuid);
}

export function getEntity(id: number) {
	return JSON.parse(localStorage.getItem(toEntityKey(id)) ?? "null");
}

export function updateEntity(id: number, data: object) {
	localStorage.setItem(toEntityKey(id), JSON.stringify(data))
}

export function clearEntities(except: number[] = []) {
	const exceptKeys = except.map(toEntityKey);
	for (let i = 0; i < localStorage.length; i++) {
		const key = localStorage.key(i);
		if (key && isEntityKey(key) && !exceptKeys.includes(key))
			localStorage.removeItem(key)
	}
}

const toEntityKey = (id: number) => `entity-${id}`
const isEntityKey = (key: string) => key.startsWith("entity-")