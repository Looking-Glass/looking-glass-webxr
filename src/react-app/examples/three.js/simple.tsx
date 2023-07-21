import { useEffect, useRef } from "react"
import * as THREE from "three"
import { VRButton } from "three/examples/jsm/webxr/VRButton.js"
import { LookingGlassWebXRPolyfill } from "@library/index"

function ThreeScene() {
	const mount = useRef<HTMLDivElement | null>(null)
	const vrButtonContainer = useRef<HTMLDivElement | null>(null)

	useEffect(() => {
		if (!mount.current && vrButtonContainer.current) return
		// Initialize
		LookingGlassWebXRPolyfill.init({
			tileHeight: 512,
			numViews: 45,
			targetY: 1,
			targetZ: 0,
			targetDiam: 3,
			fovy: (14 * Math.PI) / 180,
		})

		const scene = new THREE.Scene()

		const cube = new THREE.Mesh(new THREE.BoxGeometry(2, 0.1, 0.1), new THREE.MeshStandardMaterial({ color: "red" }))
		cube.position.set(0, 1.3, 0)
		scene.add(cube)
		scene.add(new THREE.GridHelper())

		scene.add(new THREE.AmbientLight(0xaaaaaa))
		const directionalLight = new THREE.DirectionalLight(0xffffff)
		directionalLight.position.set(3, 3, 3)
		scene.add(directionalLight)

		const renderer = new THREE.WebGLRenderer({ antialias: true })
		renderer.setSize(window.innerWidth, window.innerHeight)

		// The actual mount to the DOM
		mount.current?.appendChild(renderer.domElement)

		const vrbutton = VRButton.createButton(renderer.current)

		// setTimeout(function () {
			renderer.xr.enabled = true
			document.body.append(vrbutton)
		// }, 2000)

		const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight)
		camera.position.set(0, 1.3, 3)

		renderer.setAnimationLoop(() => {
			cube.rotation.z += 0.01
			cube.rotation.x += 0.02
			renderer.render(scene, camera)
		})

		// Resize listener
		const resize = () => {
			if (mount.current) {
				const width = mount.current.clientWidth
				const height = mount.current.clientHeight

				renderer.setSize(width, height)
				camera.aspect = width / height
				camera.updateProjectionMatrix()
			}
		}
		resize()
		window.addEventListener("resize", resize)

		// Cleanup
		return () => {
			mount?.current?.removeChild(renderer.domElement)
			window.removeEventListener("resize", resize)
			document.body.removeChild(vrbutton)
		}
	}, [])

	return (
		<div ref={vrButtonContainer} className="threejs-iframe">
			<div ref={mount} style={{ width: "100%", height: "100%" }}></div>
		</div>
	)
}

export default ThreeScene
