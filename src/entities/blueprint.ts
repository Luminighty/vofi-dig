
export interface ComponentBlueprint {
	type: string,
	props: object,
}

export interface EntityBlueprint {
	id: string,
	components: ComponentBlueprint[]
}
