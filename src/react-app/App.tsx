import ThreeScene from "./examples/three.js/simple.tsx"
import Wrapper from "./components/wrapper.tsx"
import "./index.css"

function App() {
    return (
        <div>
            <h1>Looking Glass WebXR Library</h1>
            <p>This page includes various example cases for the Looking Glass WebXR Library</p>
            <br />
            <div className="flex-wrapper">
                <Wrapper src="/html_examples/three-test.html" title="Three.JS" docs="https://docs.lookingglassfactory.com/developer-tools/webxr/three.js"/>
                <Wrapper src="/html_examples/babylon-es5.html" title="babylonJS Pirate Fort" docs=""/>
                <Wrapper src="/html_examples/babylon-fish.html" title="BabylonJS Fish Scene" docs=""/>
            </div>
        </div>
    )

}

export default App