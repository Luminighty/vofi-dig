import { ItemContainerDialog } from "../../dialogs/ItemContainerDialog";
import { World } from "../../entities";
import { ItemComponent } from "./Item.component";
import { ItemDBComponent } from "./ItemDB.component";

interface ItemEntry {
	item: string;
	amount: number;
}

export class ItemContainerComponent {
	static readonly COMPONENT_ID = "ItemContainerComponent" as const;
	world!: World;
	itemDb!: ItemDBComponent;
	items: (ItemEntry | undefined)[] = [];
	slots = 8;
	title = "Container";
	container: ItemContainerDialog | null = null;
	width = 300;

	get isOpen() { return this.container !== null; }

	onInit() {
		this.itemDb = this.world.querySingleton(ItemDBComponent);
	}

	async onAddItem({item, amount = 1}) {
		const entry = this.items.find((i) => i && i.item === item);
		for (let i = 0; i < this.slots; i++) {
			if (!this.items[i]){
				this.items[i] = { item, amount }
				break;
			}
		}
		if (this.container)
			this.container.items = await Promise.all(this.items.map(this.toItemProp.bind(this)));
	}

	async onOpenDialog() {
		if (this.container)
			return;
		this.container = ItemContainerDialog.open({
			count: this.slots,
			title: this.title,
			items: await Promise.all(this.items.map(this.toItemProp.bind(this))),
			onItemsChanged: (items) => {
				this.items = items.map((prop) => prop && {
					amount: prop.amount,
					item: prop.item
				});
			}
		});
		this.container.dialog.onClose(() => {
			this.container = null;
		});
	}

	onCloseDialog() {
		if (this.container) {
			this.container.dialog.close();
		}
	}

	async toItemProp(entry: ItemEntry | undefined) {
		if (!entry)
			return undefined;
		const data = await this.itemDb.get(entry.item);
		const item = data.getComponent(ItemComponent);
		return {
			item: entry.item,
			img: item.icon,
			amount: entry.amount,
			tags: item.tags,
		}
	}

}