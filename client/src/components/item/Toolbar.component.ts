import { ToolbarDialog } from "../../dialogs/ToolbarDialog/ToolbarDialog";
import { Entity, World } from "../../entities";
import { Serializable } from "../../network";
import { Controls } from "../../systems/controls";
import { ItemComponent } from "./Item.component";
import { ItemDBComponent } from "./ItemDB.component";

interface ItemEntry {
	item: string;
	amount: number;
}

@Serializable("items", "selected")
export class ToolbarComponent {
	static readonly COMPONENT_ID = "ToolbarComponent" as const;
	world!: World;
	parent!: Entity;
	itemDb!: ItemDBComponent;
	toolbar: ToolbarDialog | null = null;
	title = "Toolbar";
	slots = 4;
	items: (ItemEntry | undefined)[] = [
		{item: "TorchItem", amount: 1}
	];
	selected = 0;
	width = 300;

	get selectedItem() { return this.items[this.selected] }

	get isOpen() { return this.toolbar !== null; }

	onInit() {
		this.itemDb = this.world.querySingleton(ItemDBComponent);
	}

	onUpdate() {
		this.select();
		if (Controls.isPressed(Controls.mouse.right))
			this.use();
	}

	select() {
		if (!Controls.mouse.scrollY || !this.toolbar)
			return;
		const selected = this.toolbar.selected - Controls.mouse.scrollY;
		this.selected = (selected + this.slots) % this.slots;
		this.toolbar.selected = this.selected;
		const item = this.selectedItem;
		if (!item)
			return;
		this.itemDb.get(item.item)
			.then((item) => this.parent?.fireEvent("onItemSelected", {item}))
	}

	async use() {
		const selectedItem = this.items[this.selected];
		if (!selectedItem)
			return;
		const item = await this.itemDb.get(selectedItem.item);
		item.fireEvent("onUse");
	}

	async onOpenDialog() {
		if (this.toolbar)
			return;
		const items = await Promise.all(this.items.map(this.toItemProp.bind(this)));
		this.toolbar = ToolbarDialog.open({
			slots: this.slots,
			items,
			allowedTags: ["TOOL"],
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