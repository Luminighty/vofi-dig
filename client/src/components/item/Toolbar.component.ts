import { ToolbarDialog } from "../../dialogs/ToolbarDialog/ToolbarDialog";
import { World } from "../../entities";
import { Controls } from "../../systems/controls";
import { ItemComponent } from "./Item.component";
import { ItemContainerComponent } from "./ItemContainer.component";
import { ItemDBComponent } from "./ItemDB.component";

interface ItemEntry {
	item: string;
	amount: number;
}

export class ToolbarComponent {
	static readonly COMPONENT_ID = "ToolbarComponent" as const;
	world!: World;
	itemDb!: ItemDBComponent;
	toolbar: ToolbarDialog | null = null;
	title = "Toolbar";
	slots = 4;
	items: (ItemEntry | undefined)[] = [];
	width = 300;

	get isOpen() { return this.toolbar !== null; }

	onInit() {
		this.itemDb = this.world.querySingleton(ItemDBComponent);
		this.onOpenDialog();
	}

	onUpdate() {
		this.select();
	}

	select() {
		if (Controls.mouse.scrollY && this.toolbar) {
			const selected = this.toolbar.selected - Controls.mouse.scrollY;
			this.toolbar.selected = (selected + this.slots) % this.slots;
		}
	}

	async onOpenDialog() {
		if (this.toolbar)
			return;
		const items = await Promise.all(this.items.map(this.toItemProp.bind(this)));
		this.toolbar = ToolbarDialog.open({
			slots: this.slots,
			items,
			onItemsChanged: (items) => {
				this.items = items.map((prop) => prop && {
					amount: prop.amount,
					item: prop.item
				});
			}
		});
		this.toolbar.dialog.onClose(() => {
			this.toolbar = null;
		});
	}

	onCloseDialog() {
		if (this.toolbar) {
			this.toolbar.dialog.close();
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