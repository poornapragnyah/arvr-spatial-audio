// camera.getWorldDirection   =>  Returns a vector representing the direction of object's positive z-axis in world space.


import { useEffect, useState } from 'react';
import { useThree } from '@react-three/fiber';
import { PointerLockControls } from '@react-three/drei';
import { Vector3 } from 'three';

function FirstPersonController() {
    const { camera, gl } = useThree();  // Access the canvas renderer (gl) from useThree
    const moveSpeed = 0.1;
    const [moveDirection] = useState(new Vector3());
    const [isPointerLocked, setIsPointerLocked] = useState(false);

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
                    moveDirection.add(forward.multiplyScalar(moveSpeed));
                    break;
                case 'KeyS':
                    moveDirection.add(forward.multiplyScalar(-moveSpeed));
                    break;
                case 'KeyA':
                    moveDirection.add(right.multiplyScalar(moveSpeed));
                    break;
                case 'KeyD':
                    moveDirection.add(right.multiplyScalar(-moveSpeed));
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

            camera.position.add(moveDirection);
            moveDirection.set(0, 0, 0);
        };

        window.addEventListener('mousedown', handleMouseDown);
        window.addEventListener('keydown', handleKeyDown);

        return () => {
            window.removeEventListener('mousedown', handleMouseDown);
            window.removeEventListener('keydown', handleKeyDown);
        };
    }, [camera, moveDirection, moveSpeed, gl, isPointerLocked]);

    return (
        <>
            {isPointerLocked && <PointerLockControls />}
        </>
    );
}

export default FirstPersonController;
