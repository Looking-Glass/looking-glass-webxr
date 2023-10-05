export function createCSSVariables() {
    let style = document.createElement('style');
    document.head.appendChild(style);
    let css = `
	/* Basic thumb styling for WebKit browsers */
	.looking-glass-input::-webkit-slider-thumb {
		background: radial-gradient(76.09% 1304.32% at 87.24% 100%, #A055FA 0%, #5F15E8 100%);
		border: 2px solid #FFFFFF;
		border-radius: 22px;
		-webkit-appearance: none; /* This is important to override browser defaults */
		width: 24px; /* Set a width and height for the thumb */
		height: 24px;
		cursor: pointer;
		box-shadow: -6px 8px 8px -4.5px rgba(0, 0, 0, 0.16), 0px 0px 12px 1px rgba(0, 0, 0, 0.14);
        border-radius: 22px;
	}
	
	.looking-glass-input::-moz-range-thumb {
		background: radial-gradient(76.09% 1304.32% at 87.24% 100%, #A055FA 0%, #5F15E8 100%);
		border: 2px solid #FFFFFF;
		border-radius: 22px;
		-webkit-appearance: none; /* This is important to override browser defaults */
		width: 20px; /* Set a width and height for the thumb */
		height: 20px;
		cursor: pointer;
		box-shadow: -6px 8px 8px -4.5px rgba(0, 0, 0, 0.16), 0px 0px 12px 1px rgba(0, 0, 0, 0.14);
        border-radius: 22px;
	}
	
	/* Override the default appearance of the range input */
	input[type="range"].looking-glass-input {
		-webkit-appearance: none;
		width: 100%;
		height: 8px;
		margin-top: 16px;
		background: rgba(255, 255, 255, 0.40);
		outline: none;
		opacity: 1;
		border-radius: 8px;
		-webkit-transition: 0.2s;
		transition: opacity 0.2s;
	}
    `
    style.appendChild(document.createTextNode(css))
}

export const containerRoot = {
	backgroundColor: "rgba(40, 39, 63, 0.90)",
	borderColor: "#FFFFFF1A",
	borderWidth: 1,
	position: "fixed",
	zIndex: "1000",
	paddingRight: "24px",
	paddingLeft: "24px",
	padding: "15px",
	width: "360px",
	height: "504px",
	maxWidth: "calc(100vw - 18px)",
	whiteSpace: "nowrap",
	color: "white",
	borderRadius: "10px",
	right: "15px",
	bottom: "15px",
	flex: "row",
}

export const heading = {
	width: "100%",
	display: "flex",
	justifyContent: "start",
	alignItems: "center",
	textAlign: "left",
	fontWeight: "bold",
	marginBottom: "8px",
}

export const heading6 = {
	/* Header/Header 6 */
	display: "block",
	fontFamily: "Helvetica Neue",
	fontStyle: "normal",
	fontWeight: "700",
	fontSize: "14px",
	lineHeight: "20px",
	/* identical to box height, or 143% */
	alignItems: "center",
	letterSpacing: "-0.2px",
}

export const controlsContainer = {
	display: "flex",
	flexDirection: "column",
	alignItems: "left",
	padding: "0px",
	gap: "16px",
	paddingRight: "24px",
	paddingLeft: "24px",

}

export const sliderContainer = {
	order: 2,
	flexGrow: 0,
	width: "100%",
	height: "91px"
}

export const slider = {
        WebkitAppearence: "none",
        appearance: "none",
        height: '24px',
        borderRadius: "100px",
        // background: "rgba(255, 255, 255, 0.4)",
        cursor: "pointer",
        width: "15rem",
      }

export const sliderThumb = {
/* purple grad */
background: `radial-gradient(76.09% 1304.32% at 87.24% 100%, #A055FA 0%, #5F15E8 100%)`,
border: `2px solid #FFFFFF`,
/* edge/edge-1000 */
boxShadow: "-6px 8px 8px -4.5px rgba(0, 0, 0, 0.16), 0px 0px 12px 1px rgba(0, 0, 0, 0.14)",
borderRadius: "22px",
}

export const sliderTrack = {
	background: "rgba(255, 255, 255, 0.4)",
	backdropFilter: "blur(50px)",
	/* Note: backdrop-filter has minimal browser support */
	borderRadius: "100px",
}

export const horizontalFlexBoxStyle = {
	display: "flex",
	flexDirection: "row",
	justifyContent: "space-between",
	alignItems: "center",
	width: "100%",
}



export const button = {
	background: "radial-gradient(76.09% 1304.32% at 87.24% 100%, #A055FA 0%, #5F15E8 100%)",
	width: "100%",
	height: "48px",
	left: "0px",
	top: "308px",
	borderRadius: "8px",
	color: "white",
	fontFamily: "Helvetica Neue",
	fontStyle: "normal",
	fontWeight: "700",
	fontSize: "18px",
	lineHeight: "24px",
	outline: "none",
	boxShadow: "none",
}

export const tab_container = {
	display: "flex",
	flexDirection: "row",
}

export const tab_active = {
	background: "radial-gradient(76.09% 1304.32% at 87.24% 100%, #A055FA 0%, #5F15E8 100%)",
	flexGrow: 1,
	height: "48px",
	borderRadius: "8px",
	color: "white",
	fontFamily: "Helvetica Neue",
	fontStyle: "normal",
	fontWeight: "700",
	fontSize: "18px",
	lineHeight: "24px",
	outline: "none",
	boxShadow: "none",
}

export const tab_inactive = {
	background: "rgba(40, 39, 63, 0.90)",
	height: "48px",
	flexGrow: 1,
	borderRadius: "8px",
	color: "white",
	fontFamily: "Helvetica Neue",
	fontStyle: "normal",
	fontWeight: "700",
	fontSize: "18px",
	lineHeight: "24px",
	outline: "none",
	boxShadow: "none",
}

export const webXRButton = {
	cursor: "pointer",
	left: "calc(50% - 50px)",
	width: "280px",
	background: "radial-gradient(76.09% 1304.32% at 87.24% 100%, #403E6C 0%, #1F1E37 100%)",
	borderRadius: "8px",
	position: "absolute",
	fontFamily: "Helvetica Neue",
	fontStyle: "normal",
	fontWeight: "700",
	fontSize: "18px",
	lineHeight: "24px",
	bottom: "20px",
	padding: "12px 6px",
	color: "#fff",
	textAlign: "center",
	outline: "none",
	zIndex: "9999",
}

/**
 *
 * set the style of an HTML or SVG Element with a javascript object, this only sets the style, and not other attributes.
 */
export function setStyle(element: HTMLElement | SVGElement, style: any) {
	Object.assign(element.style, style)
}
/**
 *
 * @param containerStyle the style of the svg container to hold the element
 * @param paths an array of paths to be added to the svg
 * @param pathStyle the style object to be applied to the path elements
 * @returns an svg element with the paths and styles applied
 */
function createSVG(containerStyle: any, paths: string[], pathStyle: any) {
	// svg is a specific namespace in the DOM so we need to use createElementNS instead of just create Element
	const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg")
    svg.setAttribute("width", "40")
    svg.setAttribute("height", "40")
    svg.setAttribute("viewBox", "0 0 40 40")
    svg.setAttribute("fill", "none")
    svg.setAttribute("xmlns", "http://www.w3.org/2000/svg")
	// setStyle(svg, svgContainer)
	setPaths(svg, paths, castIconStyle)
	return svg
}

// svg elements can have multiple path objects, so we use a wrapper here to create them
function setPaths(svg: SVGElement, paths: string[], style: any) {
	for (let i = 0; i < paths.length; i++) {
		const path = document.createElementNS("http://www.w3.org/2000/svg", "path")
        path.setAttribute("fill-rule", "evenodd")
        path.setAttribute("clip-rule", "evenodd")
		path.setAttribute("d", paths[i])
        path.setAttribute("fill", "white")
		svg.appendChild(path)
        // setStyle(path, style)
	}
}

// style for the path element
const castIconStyle = {
	fillRule: "evenodd",
	clipRule: "evenodd",
	fill: "white",
	width: "16px",
	height: "20px",
    display: "block",
}

const castIconPaths = [
    "M29 16.2743V23.6543C29 24.58 28.5114 25.4286 27.7143 25.8786L21.2857 29.5814C20.8871 29.8129 20.45 29.9286 20 29.9286C19.55 29.9286 19.1129 29.8129 18.7143 29.5814L18.0018 29.171C18.0022 29.0134 17.9894 28.8522 17.9624 28.6882C17.801 27.6951 17.4588 26.7641 16.9708 25.9295L19.11 27.21V20.6971L13.17 17.3V22.5773C12.5794 22.3251 11.9526 22.1412 11.2996 22.0352L11.2879 22.0333L11.2761 22.0316C11.1832 22.0176 11.0911 22.0082 11 22.0032V16.2743C11 15.3486 11.4886 14.5 12.2857 14.0371L18.7143 10.3471C19.1129 10.1157 19.55 10 20 10C20.45 10 20.8871 10.1157 21.2857 10.3471L27.7143 14.05C28.5114 14.5 29 15.3486 29 16.2743ZM15.6704 27.8281L12.2857 25.8786C11.5941 25.4881 11.1347 24.7977 11.0253 24.0171L11.0323 24.0183C11.2863 24.0618 11.5349 24.121 11.7771 24.195C13.5676 24.7418 15.0071 26.0923 15.6704 27.8281ZM14.31 15.5029L20 18.87L25.69 15.5029L20 12.07L14.31 15.5029ZM20.89 27.21L26.83 23.6543V17.3L20.89 20.6971V27.21Z",
	"M10 30L10 27.3992C11.4387 27.3992 12.6 28.5609 12.6 30L10 30ZM15.122 30C14.6974 30 14.342 29.6879 14.2727 29.2631C13.9607 27.4599 12.5394 26.0381 10.7367 25.726C10.312 25.6566 10 25.3012 10 24.8764C10 24.3475 10.4593 23.9314 10.9793 24.0094C13.5447 24.4256 15.5727 26.4455 15.9887 29.0117C16.0754 29.5319 15.6507 30 15.122 30Z",
]

// style for the overall svg element
const svgContainer = {
	width: "40px",
	height: "40px",
	fill: "none",
	xmlns: "http://www.w3.org/2000/svg",
}

export function castIcon() {
    let icon = createSVG(svgContainer, castIconPaths, castIconStyle)
    return icon
}

// export const rainbowCastIcon = () => {
//     let icon = createSVG(svgContainer, castIconPaths, rainbowCastIconStyle)
//     return icon
// }

function generateFOVIndicators(): string[] {
	const indicators: string[] = []
	for (let i = 0; i <= 10*12; i += 12) {
		indicators.push(`${i + "\u00B0"}`)
	}
	return indicators
}

export function FOVindicators(containerDiv: HTMLDivElement) {
	const horizontalFlexBox = document.createElement('div');
	setStyle(horizontalFlexBox, horizontalFlexBoxStyle)
	containerDiv.appendChild(horizontalFlexBox);

	const indicators = generateFOVIndicators()
	indicators.forEach((indicator) => {
		const pElement = document.createElement('p');
		pElement.style.fontSize = "12px";
		pElement.style.lineHeight = "16px"
		pElement.style.color = "rgba(255, 255, 255, 0.40)"
		pElement.textContent = indicator;
		horizontalFlexBox.appendChild(pElement);
	})

	return indicators
}

function generateDepthinessIndicators(): string[] {
	const indicators: string[] = []
	for (let i = 0; i <= 10*0.2; i += 0.2) {
		const truncated = i.toFixed(1)
		indicators.push(truncated)
	}
	return indicators
}

export function DepthinessIndicators(containerDiv: HTMLDivElement) {
	const horizontalFlexBox = document.createElement('div');
	setStyle(horizontalFlexBox, horizontalFlexBoxStyle)
	containerDiv.appendChild(horizontalFlexBox);

	const indicators = generateDepthinessIndicators()
	indicators.forEach((indicator) => {
		const pElement = document.createElement('p');
		pElement.style.fontSize = "12px";
		pElement.style.lineHeight = "16px"
		pElement.style.color = "rgba(255, 255, 255, 0.40)"
		pElement.textContent = indicator;
		horizontalFlexBox.appendChild(pElement);
	})

	return indicators
} 
