/* eslint-disable react/prop-types */
/* eslint-disable react/no-unknown-property */

import { useLoader, useThree } from '@react-three/fiber';
import { GLTFLoader } from 'three/examples/jsm/Addons.js';
import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { Html } from '@react-three/drei';

// dont change speaker pos values for now
export default function Speaker({ position = [1.93, 2.14, -1.9], audioUrl = '/src/assets/audio1.mp3' }) {
    const gltf = useLoader(GLTFLoader, '/src/models/speaker.glb');
    const audioRef = useRef();
    const speakerRef = useRef();
    const [isAudioInitialized, setIsAudioInitialized] = useState(false);
    const [isPlaying, setIsPlaying] = useState(false);
    const { camera } = useThree();

    // Setup spatial audio
    useEffect(() => {
        if (!camera) return;

        const listener = new THREE.AudioListener();
        camera.add(listener);

        const sound = new THREE.PositionalAudio(listener);
        audioRef.current = sound;

        const audioLoader = new THREE.AudioLoader();
        audioLoader.load(audioUrl, (buffer) => {
            sound.setBuffer(buffer);
            sound.setRefDistance(0.3);
            sound.setRolloffFactor(1);
            sound.setDistanceModel('inverse');
            sound.setLoop(true);
            sound.setVolume(0.8);
            setIsAudioInitialized(true);
        });

        if (speakerRef.current) {
            speakerRef.current.add(sound);
        }

        return () => {
            if (sound) {
                sound.stop();
                sound.disconnect();
            }
            if (listener) {
                camera.remove(listener);
            }
        };
    }, [audioUrl, camera]);

    // Handle play/pause
    const toggleAudio = () => {
        if (!audioRef.current || !isAudioInitialized) return;
        
        if (isPlaying) {
            audioRef.current.pause();
        } else {
            audioRef.current.play();
        }
        setIsPlaying(!isPlaying);
    };

    return (
        <group
            ref={speakerRef}
            position={position}
            rotation={[0, -Math.PI / 2, 0]}
            scale={[0.2, 0.2, 0.2]}
        >
            <primitive object={gltf.scene} />
            <Html position={[0, 2, 0]} center>
                <div className="bg-black/50 p-2 rounded-lg backdrop-blur-sm">
                    <button
                        onClick={toggleAudio}
                        className="w-8 h-8 flex items-center justify-center bg-white/10 hover:bg-white/20 rounded text-white transition-colors"
                    >
                        {isPlaying ? '⏸️' : '▶️'}
                    </button>
                </div>
            </Html>
        </group>
    );
}
