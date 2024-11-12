/* eslint-disable react/no-unknown-property */

import { Canvas } from '@react-three/fiber';
import './App.css';
import Model from './components/ModelLoader';
import { Suspense } from 'react';
import FirstPersonController from './components/FirstPersonController';
import { createXRStore, XR } from '@react-three/xr'

const store = createXRStore()


export default function App() {
    return (
        <>
        <button onClick={() => store.enterVR()}>Enter VR</button>
        <button onClick={() => store.enterAR()}>Enter AR</button>
            <Canvas camera={{ position: [-0.3, 1, 1.4]}}>
            <XR store={store}>
            <ambientLight intensity={4.5} />
                <directionalLight color="white" position={[0, 0, 5]} />
                <Suspense fallback={null}>
                    <Model />
                </Suspense>
                <FirstPersonController />
        </XR>

                
            </Canvas>
            {/* Instructions overlay => wont be seen on screen  => for user ref*/}
            <div className="fixed top-0 left-0 p-4 text-white text-sm bg-black/50">
                <p>WASD - Move (always active)</p>
                <p>PageUp/PageDown - Move up/down</p>
                <p>mouse middle click - first person head movement / activate lock control</p>
                <p>Esc - Exit look controls</p>
            </div>
        </>
    );
}