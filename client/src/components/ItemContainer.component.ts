import { ItemContainerDialog } from "../dialogs/ItemContainerDialog";
import { World } from "../entities";
import { ItemComponent } from "./item/Item.component";
import { ItemDBComponent } from "./item/ItemDB.component";

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

	get isOpen() { return this.container !== null; }

	onInit() {
		this.itemDb = this.world.querySingleton(ItemDBComponent);
	}

	onAddItem({item, amount = 1}) {
		const entry = this.items.find((i) => i && i.item === item);
		for (let i = 0; i < this.slots; i++) {
			if (!this.items[i]){
				this.items[i] = { item, amount }
				break;
			}
		}
		if (this.container)
			this.container.items = this.items.map(this.toItemProp.bind(this));
	}

	onOpenDialog() {
		if (this.container)
			return;
		this.container = ItemContainerDialog.open({
			count: this.slots,
			title: this.title,
			items: this.items.map(this.toItemProp.bind(this)),
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

	toItemProp(entry: ItemEntry | undefined) {
		if (!entry)
			return undefined;
		const data = this.itemDb.get(entry.item);
		const item = data.getComponent(ItemComponent);
		return {
			item: entry.item,
			img: item.icon,
			amount: entry.amount,
			tags: item.tags,
		}
	}

}