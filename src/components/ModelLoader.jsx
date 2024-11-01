/* eslint-disable react/no-unknown-property */

import { useLoader } from '@react-three/fiber';
import { GLTFLoader } from 'three/examples/jsm/Addons.js';
import Speaker from './Speaker';
import { Suspense } from 'react';

export default function ModelLoader() {
    const gltf = useLoader(GLTFLoader, '/src/models/stylised_room.glb')
    
    return (
        <group
            position={[0, -0.5, 0]}
            rotation={[0, 0, 0]}
            scale={[1, 1, 1]}
        >
            <primitive object={gltf.scene} />
            <Suspense fallback={null}>
                <Speaker audioUrl="/src/assets/audio1.mp3" />
            </Suspense>
        </group>
    );
}