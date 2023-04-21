const BIT_NOISE1 = 0xB5297A4D;
const BIT_NOISE2 = 0x68E31DA4;
const BIT_NOISE3 = 0x1B56C4E9;
const PRIME1 = 198491317;
const PRIME2 = 6542989;

const toFloat = (number: number) => number / 0xFFFFFFF;

export const Random = {
	seed: Math.random() * 0xFFFFFF,
	position: 0,

	getSeed() {
		return this.get() * 0xFFFFFF;
	},

	/** @returns Returns a number between 0 and 1 */
	get1D(position: number) {
		let mangled = position;

		mangled *= BIT_NOISE1;
		mangled += this.seed;
		mangled ^= (mangled >> 8);
		mangled += BIT_NOISE2;
		mangled ^= (mangled << 8);
		mangled *= BIT_NOISE3;
		mangled ^= (mangled >> 8);

		return toFloat(mangled % 0xFFFFFFF);
	},

	/** @returns Returns a number between 0 and 1 */
	get2D(x: number, y: number) {
		return this.get1D(x + (PRIME1 * y));
	},

	/** @returns Returns a number between 0 and 1 */
	get3D(x: number, y: number, z: number) {
		return this.get1D(x + PRIME1 * y + PRIME2 * z);
	},

	/** @returns Returns a number between 0 and 1 */
	get() {
		return this.get1D(this.position++);
	},

	/** @returns Returns a boolean depending on the parameter */
	getRandomChance(chanceOfTrue: number) {
		return this.get() < chanceOfTrue;
	},

	getDirection() {
    let theta = Math.random() * 2 * Math.PI;
    return {x: Math.cos(theta), y: Math.sin(theta)};
	}
}
