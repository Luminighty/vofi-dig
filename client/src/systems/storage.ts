export const LocalStorage = {

	getValue(key) {
		return localStorage.getItem(key)
	},

	setValue(key, value) {
		localStorage.setItem(key, value)
	},

	getUserId() {
		return localStorage.getItem("uuid");
	},

	setUserId(uuid: string) {
		return localStorage.setItem("uuid", uuid);
	},

	getEntity(id: number) {
		return JSON.parse(localStorage.getItem(toEntityKey(id)) ?? "null");
	},

	updateEntity(id: number, data: object) {
		localStorage.setItem(toEntityKey(id), JSON.stringify(data))
	},

	clearEntities(except: number[] = []) {
		const exceptKeys = except.map(toEntityKey);
		for (let i = 0; i < localStorage.length; i++) {
			const key = localStorage.key(i);
			if (key && isEntityKey(key) && !exceptKeys.includes(key))
				localStorage.removeItem(key)
		}
	},
}

const toEntityKey = (id: number) => `entity-${id}`
const isEntityKey = (key: string) => key.startsWith("entity-")
