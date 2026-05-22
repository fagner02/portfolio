import { callbackLinkSvg } from "./linkSvgAnimation.js";
import { callbackPhraseSvg } from "./phrase.js";

const obj = document.querySelector("object")! as HTMLObjectElement;
const onLoad = () => {
    try {
        const svgElem = obj
            .contentDocument!.querySelector("svg")!
            .cloneNode(true) as SVGSVGElement;
        svgElem.id = "appended-svg";
        document.body.append(svgElem);
        obj.remove();

        callbackPhraseSvg();
        callbackLinkSvg(svgElem);
    } catch (e) {
        return;
    }
};
obj.onload = onLoad;
if (obj.contentDocument?.readyState === "complete") {
    onLoad();
}
