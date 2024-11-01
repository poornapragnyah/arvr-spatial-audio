import { useEffect, useState } from 'react';
import { useThree, useFrame } from '@react-three/fiber';
import { PointerLockControls } from '@react-three/drei';
import { Vector3 } from 'three';

function FirstPersonController() {
    const { camera, gl } = useThree(); // Access the canvas renderer (gl) from useThree
    const moveSpeed = 0.05; // Reduce move speed for slower movement
    const [moveDirection] = useState(new Vector3());
    const [isPointerLocked, setIsPointerLocked] = useState(false);

    // Use useFrame to update the camera position on each frame
    useFrame(() => {
        // Move the camera based on the moveDirection
        camera.position.add(moveDirection.clone().multiplyScalar(moveSpeed));
    });

    useEffect(() => {
        const handleMouseDown = (e) => {
            // Activate pointer lock on middle mouse button (button 1)
            if (e.button === 1) {
                if (isPointerLocked) {
                    document.exitPointerLock();
                    setIsPointerLocked(false);
                } else {
                    gl.domElement.requestPointerLock(); // Request pointer lock directly on the canvas element
                    setIsPointerLocked(true);
                }
            }
        };

        const handleKeyDown = (event) => {
            const forward = new Vector3();
            const right = new Vector3();

            camera.getWorldDirection(forward);
            right.crossVectors(camera.up, forward).normalize();

            forward.y = 0;
            forward.normalize();

            switch(event.code) {
                case 'KeyW':
                    moveDirection.add(forward);
                    break;
                case 'KeyS':
                    moveDirection.add(forward.negate());
                    break;
                case 'KeyA':
                    moveDirection.add(right.negate());
                    break;
                case 'KeyD':
                    moveDirection.add(right);
                    break;
                case 'PageUp':
                    camera.position.y += moveSpeed;
                    break;
                case 'PageDown':
                    camera.position.y -= moveSpeed;
                    break;
                default:
                    break;
            }
        };

        const handleKeyUp = (event) => {
            const forward = new Vector3();
            const right = new Vector3();

            camera.getWorldDirection(forward);
            right.crossVectors(camera.up, forward).normalize();

            forward.y = 0;
            forward.normalize();

            switch(event.code) {
                case 'KeyW':
                case 'KeyS':
                    moveDirection.set(0, 0, 0); // Stop moving forward/backward
                    break;
                case 'KeyA':
                case 'KeyD':
                    moveDirection.set(0, 0, 0); // Stop moving left/right
                    break;
                default:
                    break;
            }
        };

        window.addEventListener('mousedown', handleMouseDown);
        window.addEventListener('keydown', handleKeyDown);
        window.addEventListener('keyup', handleKeyUp); // Add keyup listener for smoother stop

        return () => {
            window.removeEventListener('mousedown', handleMouseDown);
            window.removeEventListener('keydown', handleKeyDown);
            window.removeEventListener('keyup', handleKeyUp); // Cleanup on unmount
        };
    }, [camera, moveDirection, gl, isPointerLocked]);

    return (
        <>
            {isPointerLocked && <PointerLockControls />}
        </>
    );
}

export default FirstPersonController;
