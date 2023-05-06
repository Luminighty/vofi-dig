interface LoadingBarProps {
	width?: string,
	backgroundColor?: string,
	color?: string,
	label?: string,
}

export type IProgressCallback = (progress: number, total: number) => void;

export interface ILoadingBar {
	finish: () => void;
	update: (label: string, progress: number, total: number) => void;
	withLabel: (label: string) => IProgressCallback;
	set determinate(value);
	set label(value);
}

export function LoadingBar(props: LoadingBarProps = {}): ILoadingBar {
	const container = document.body.appendChild(document.createElement("div"));
	const labelElement = container.appendChild(document.createElement("div"));
	const progressContainer = container.appendChild(document.createElement("div"));
	const progressElement = progressContainer.appendChild(document.createElement("div"));
	
	labelElement.style.textAlign = "center";
	labelElement.innerText = props.label ?? "Loading...";
	labelElement.style.color = "white";
	labelElement.style.fontWeight = "bold";
	labelElement.style.paddingBottom = "5px";
	labelElement.style.fontSize = "1.5em";
	
	container.style.width = props.width ?? "75vw";
	container.style.padding = "10px";
	container.style.zIndex = "9999";
	container.style.top = "50%";
	container.style.left = "50%";
	container.style.transform = "translate(-50%, -50%)";
	container.style.position = "absolute";
	container.style.backgroundColor = "#000000aa";

	progressContainer.style.width = "100%";
	progressContainer.style.height = "30px";
	progressContainer.style.backgroundColor = props.backgroundColor ?? "grey";
	progressContainer.style.overflow = "hidden";
	progressElement.style.backgroundColor = props.color ?? "#66ff00";
	progressElement.style.height = "100%";
	progressElement.style.width = "1px";
	progressElement.style.transformOrigin = "0% 50%";


	return {
		finish() {
			document.body.removeChild(container);
		},
		withLabel(label: string) {
			return (progress: number, total: number) => this.update(label, progress, total)
		},
		update(label: string, progress: number, total: number) {
			labelElement.innerText = `${label} (${progress}/${total})`;
			progressElement.style.width = `${100 * progress / total}%`;
		},
		set label(value: string) {
			labelElement.innerText = value;
		},
		set determinate(value) {
			if (!value)
				progressElement.style.width = "100%";
			progressElement.style.animation = value ? "" : "indeterminateLoadingBar 2s infinite linear";
		}
	}
}