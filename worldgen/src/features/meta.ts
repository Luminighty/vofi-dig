type MetaGenerator = (chunkX: number, chunkY: number) => object;
type MetaMap = { [key: string]: object };

export function useMetaGenerator(metaChunkSize: number, generator: MetaGenerator) {
	const metaMap: MetaMap = {};
	
	return (chunkX, chunkY) => {
		const metaChunkX = Math.floor(chunkX / metaChunkSize);
		const metaChunkY = Math.floor(chunkY / metaChunkSize);
		return getMeta(generator, metaMap, metaChunkX, metaChunkY);
	}
}

function getMeta(generator: MetaGenerator, metaMap: MetaMap, metaChunkX: number, metaChunkY: number): object {
	const key = getKey(metaChunkX, metaChunkY);
	if (metaMap[key])
		return metaMap[key];
	const meta = generator(metaChunkX, metaChunkY);
	metaMap[key] = meta;
	return meta;
}

const getKey = (chunkX: number, chunkY: number) => `${chunkX}-${chunkY}`;