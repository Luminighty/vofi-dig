import { World } from "../entities";

interface ItemEntry {
	item: string;
	amount: number;
}

export class ItemContainerComponent {
	static readonly COMPONENT_ID = "ItemContainerComponent" as const;
	world!: World;
	items: ItemEntry[] = [];

	onAddItem({item, amount = 1}) {
		console.log(`Adding item ${item} ${amount}`);
		const entry = this.items.find((i) => i.item === item);
		if (!entry) {
			this.items.push({ item, amount});
			return;
		}
		entry.amount += amount;
	}

}