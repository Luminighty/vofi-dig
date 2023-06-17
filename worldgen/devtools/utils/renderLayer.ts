const renderers: (() => void)[] = [];

export function RenderAll() {
	renderers.forEach((c) => c());
}

export function RenderLayer(
	main: HTMLCanvasElement, 
	mainContext: CanvasRenderingContext2D, 
	render: (canvas: HTMLCanvasElement, context: CanvasRenderingContext2D) => void) 
{
	const canvas = document.createElement('canvas');
	const context = canvas.getContext('2d');
	renderers.push(() => mainContext.drawImage(canvas, 0, 0));
	return () => {
		canvas.width = main.width;
		canvas.height = main.height;
		render(canvas, context!);
		RenderAll();
	}
}