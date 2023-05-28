export interface RecipeInput {
	type: string[],
	amount: number,
	slot: string,
}

export interface RecipeOutput {
	item: string,
	amount: number,
}

export class RecipeComponent {
	static readonly COMPONENT_ID = "RecipeComponent" as const;

	inputs: RecipeInput[] = [];
	outputs: RecipeOutput[] = [];

	onInit() {
		console.log({in: this.inputs, out: this.outputs});
	}


}