import { setStyle, webXRButton } from "./LookingGlassStyles"

// Our own WebXRButton, this is a styled button that calls navigator.xr.requestSession
export function CreateLookingGlassWebXRButton() {
	const button = document.createElement("button")
    document.body.append(button)
	button.id = "LookingGlassWebXRButton"
    button.innerHTML = "Cast to Looking Glass"
	setStyle(button, webXRButton)
	return button
}
