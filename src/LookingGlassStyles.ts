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
	paddingRight: "16px",
	paddingLeft: "16px",

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

export const horizontalFlexBoxStyle = {
	display: "flex",
	flexDirection: "row",
	justifyContent: "space-between",
	alignItems: "center",
	width: "100%",
}

export const horizontalFlexCenterStyle = {
	display: "flex",
	flexDirection: "row",
	justifyContent: "center",
	alignItems: "center",
	width: "100%",
	gap: "8px",
}

export const helpButtonStyle = {
	border: "none",
	background: "none",
	cursor: "pointer",
	opacity: "40%",
	hover: "opacity: 100%",
}

export const button = {
	border: "none",
	cursor: "pointer",
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

export const button_noBackground = {
	border: "none",
	cursor: "pointer",
	width: "100%",
	background: "none",
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
	background: "#28273F",
	padding: "4px",
	borderRadius: "8px",
}

export const tab_active = {
	border: "none",
	cursor: "pointer",
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
	border: "none",
	cursor: "pointer",
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
function createSVG(containerStyle: any, paths: string[], pathStyle: any, viewbox: number) {
	// svg is a specific namespace in the DOM so we need to use createElementNS instead of just create Element
	const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg")
    svg.setAttribute("width", `${viewbox}px`)
    svg.setAttribute("height", `${viewbox}px`)
    svg.setAttribute("viewBox", `0 0 ${viewbox} ${viewbox}`)
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

const helpIconStyle = {
	fillRule: "evenodd",
	clipRule: "evenodd",
	fill: "white",
	width: "24px",
	height: "24px",
	display: "block",
	opacity: "40%",
}

const castIconPaths = [
    "M29 16.2743V23.6543C29 24.58 28.5114 25.4286 27.7143 25.8786L21.2857 29.5814C20.8871 29.8129 20.45 29.9286 20 29.9286C19.55 29.9286 19.1129 29.8129 18.7143 29.5814L18.0018 29.171C18.0022 29.0134 17.9894 28.8522 17.9624 28.6882C17.801 27.6951 17.4588 26.7641 16.9708 25.9295L19.11 27.21V20.6971L13.17 17.3V22.5773C12.5794 22.3251 11.9526 22.1412 11.2996 22.0352L11.2879 22.0333L11.2761 22.0316C11.1832 22.0176 11.0911 22.0082 11 22.0032V16.2743C11 15.3486 11.4886 14.5 12.2857 14.0371L18.7143 10.3471C19.1129 10.1157 19.55 10 20 10C20.45 10 20.8871 10.1157 21.2857 10.3471L27.7143 14.05C28.5114 14.5 29 15.3486 29 16.2743ZM15.6704 27.8281L12.2857 25.8786C11.5941 25.4881 11.1347 24.7977 11.0253 24.0171L11.0323 24.0183C11.2863 24.0618 11.5349 24.121 11.7771 24.195C13.5676 24.7418 15.0071 26.0923 15.6704 27.8281ZM14.31 15.5029L20 18.87L25.69 15.5029L20 12.07L14.31 15.5029ZM20.89 27.21L26.83 23.6543V17.3L20.89 20.6971V27.21Z",
	"M10 30L10 27.3992C11.4387 27.3992 12.6 28.5609 12.6 30L10 30ZM15.122 30C14.6974 30 14.342 29.6879 14.2727 29.2631C13.9607 27.4599 12.5394 26.0381 10.7367 25.726C10.312 25.6566 10 25.3012 10 24.8764C10 24.3475 10.4593 23.9314 10.9793 24.0094C13.5447 24.4256 15.5727 26.4455 15.9887 29.0117C16.0754 29.5319 15.6507 30 15.122 30Z",
]

const QuestionMarkIconPaths = [
	"M2 12C2 6.48 6.48 2 12 2C17.52 2 22 6.48 22 12C22 17.52 17.52 22 12 22C6.48 22 2 17.52 2 12ZM11.94 18.43C12.6138 18.43 13.16 17.8838 13.16 17.21C13.16 16.5362 12.6138 15.99 11.94 15.99C11.2662 15.99 10.72 16.5362 10.72 17.21C10.72 17.8838 11.2662 18.43 11.94 18.43ZM13.3319 13.415C13.342 13.3946 13.3522 13.3742 13.3624 13.364C13.6395 12.9577 14.0255 12.6192 14.4168 12.2761C15.3197 11.4846 16.2508 10.6682 15.9383 8.93513C15.643 7.21448 14.2685 5.79926 12.5479 5.54472C10.4505 5.23928 8.5975 6.53232 8.03752 8.38534C7.86444 8.97586 8.31242 9.57656 8.92331 9.57656H9.12693C9.54437 9.57656 9.88036 9.2813 10.0229 8.91477C10.3487 8.00863 11.3058 7.38756 12.3646 7.61155C13.342 7.81518 14.0547 8.78241 13.9631 9.78019C13.8941 10.5576 13.3388 10.9875 12.7225 11.4647C12.3379 11.7624 11.9296 12.0785 11.601 12.5088L11.5908 12.4986C11.5732 12.5163 11.5589 12.5407 11.5442 12.5661C11.5334 12.5846 11.5223 12.6036 11.5094 12.6208C11.4941 12.6463 11.4763 12.6717 11.4585 12.6972C11.4407 12.7226 11.4228 12.7481 11.4076 12.7735C11.3159 12.9161 11.2447 13.0586 11.1836 13.2215C11.1785 13.2419 11.1683 13.2571 11.1581 13.2724C11.1479 13.2877 11.1378 13.303 11.1327 13.3233C11.1225 13.3335 11.1225 13.3437 11.1225 13.3539C11.0003 13.7204 10.9189 14.1582 10.9189 14.6775H12.9653C12.9653 14.4229 12.9959 14.1989 13.0671 13.9851C13.0875 13.9138 13.118 13.8426 13.1486 13.7713C13.1588 13.7306 13.169 13.6899 13.1893 13.6593C13.23 13.5779 13.2809 13.4964 13.3318 13.415L13.3319 13.415Z"
]

const downloadIconPaths = [
	"M17.09 9.83203H15.5V4.83203C15.5 4.28203 15.05 3.83203 14.5 3.83203H10.5C9.95 3.83203 9.5 4.28203 9.5 4.83203V9.83203H7.91C7.02 9.83203 6.57 10.912 7.2 11.542L11.79 16.132C12.18 16.522 12.81 16.522 13.2 16.132L17.79 11.542C18.42 10.912 17.98 9.83203 17.09 9.83203ZM5.5 19.832C5.5 20.382 5.95 20.832 6.5 20.832H18.5C19.05 20.832 19.5 20.382 19.5 19.832C19.5 19.282 19.05 18.832 18.5 18.832H6.5C5.95 18.832 5.5 19.282 5.5 19.832Z"
]

const copyIconPaths = [
	"M9.5 2.33203C8.39543 2.33203 7.5 3.22746 7.5 4.33203H6.5C5.39543 4.33203 4.5 5.22746 4.5 6.33203V11.332H6.5V6.33203H7.5C7.5 7.4366 8.39543 8.33203 9.5 8.33203H15.5C16.6046 8.33203 17.5 7.4366 17.5 6.33203H18.5V20.332H6.5V17.332H4.5V20.332C4.5 21.4366 5.39543 22.332 6.5 22.332H18.5C19.6046 22.332 20.5 21.4366 20.5 20.332V6.33203C20.5 5.22746 19.6046 4.33203 18.5 4.33203H17.5C17.5 3.22746 16.6046 2.33203 15.5 2.33203H9.5ZM9.5 4.33203H15.5V6.33203H9.5V4.33203ZM4.5 15.332H13.0871L10.7933 17.6248L12.2072 19.0393L16.2072 15.0411C16.3948 14.8536 16.5002 14.5993 16.5002 14.3341C16.5003 14.0689 16.395 13.8145 16.2075 13.6269L12.2075 9.62508L10.793 11.039L13.085 13.332H4.5V15.332Z"
]

const svgContainer24px = {
	width: "24px",
	height: "24px",
	fill: "none",
	xmlns: "http://www.w3.org/2000/svg",
}

// style for the overall svg element
const svgContainer = {
	width: "40px",
	height: "40px",
	fill: "none",
	xmlns: "http://www.w3.org/2000/svg",
}

export function downloadIcon() {
	let icon = createSVG(svgContainer24px, downloadIconPaths, castIconStyle, 24)
	return icon
}

export function helpIcon() {
	let icon = createSVG(svgContainer24px, QuestionMarkIconPaths, helpIconStyle, 24)
	return icon
}

export function castIcon() {
    let icon = createSVG(svgContainer, castIconPaths, castIconStyle, 40)
    return icon
}

export function copyIcon() {
	let icon = createSVG(svgContainer24px, copyIconPaths, helpIconStyle, 24)
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
