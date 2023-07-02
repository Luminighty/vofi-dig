import { ItemContainerDialog } from "../../dialogs/ItemContainerDialog";
import { World } from "../../entities";
import { Serializable } from "../../network";
import { ItemComponent } from "./Item.component";
import { ItemDBComponent } from "./ItemDB.component";

interface ItemEntry {
	item: string;
	amount: number;
}

@Serializable("items")
export class ItemContainerComponent {
	static readonly COMPONENT_ID = "ItemContainerComponent" as const;
	world!: World;
	itemDb!: ItemDBComponent;
	items: (ItemEntry | undefined)[] = [];
	slots = 8;
	title = "Container";
	key = "container";
	container: ItemContainerDialog | null = null;
	width = 4;
	height = 0;

	get isOpen() { return this.container !== null; }

	onInit() {
		this.itemDb = this.world.querySingleton(ItemDBComponent);
		const rows = Math.floor(this.slots / this.width) + (this.slots % this.width ? 1 : 0);
		this.width = this.width * 64 + (this.width - 1) * 5 + 20;
		this.height = rows * 64 + (rows - 1) * 5 + 57;
	}

	async onAddItem({item, amount = 1}) {
		const entry = this.items.find((i) => i && i.item === item);
		for (let i = 0; i < this.slots; i++) {
			if (!this.items[i]) {
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
			width: this.width,
			height: this.height,
			count: this.slots,
			title: this.title,
			key: this.key,
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

	onToggleDialog() {
		if (this.container) {
			this.onCloseDialog();
		} else {
			this.onOpenDialog();
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