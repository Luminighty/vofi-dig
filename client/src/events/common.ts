import { baseEvent } from ".";

export const OnInit = baseEvent("onInit");
export const OnUpdate = (dt: number) => baseEvent("onUpdate", dt);