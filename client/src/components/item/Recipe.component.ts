interface Input {
	type: string[],
	amount: number,
	slot: string,
}

interface Output {
	item: string,
	amount: number,
}

export class RecipeComponent {
	static readonly COMPONENT_ID = "RecipeComponent" as const;

	inputs: Input[] = [];
	outputs: Output[] = [];

	onInit() {
		console.log({in: this.inputs, out: this.outputs});
	}


}