import { Grid3D } from './components/Grid3D';
import { GridDimensions, CubeProperties } from './components/types';

// Get DOM elements
const container = document.getElementById('canvas-container') as HTMLElement;
const xRangeInput = document.getElementById('xRange') as HTMLInputElement;
const yRangeInput = document.getElementById('yRange') as HTMLInputElement;
const zRangeInput = document.getElementById('zRange') as HTMLInputElement;
const cubeXInput = document.getElementById('cubeX') as HTMLInputElement;
const cubeYInput = document.getElementById('cubeY') as HTMLInputElement;
const cubeZInput = document.getElementById('cubeZ') as HTMLInputElement;
const cubeColorInput = document.getElementById('cubeColor') as HTMLInputElement;
const addCubeButton = document.getElementById('addCube') as HTMLButtonElement;
const removeCubeButton = document.getElementById('removeCube') as HTMLButtonElement;

// Initialize grid with default dimensions
const initialDimensions: GridDimensions = {
    xRange: parseInt(xRangeInput.value),
    yRange: parseInt(yRangeInput.value),
    zRange: parseInt(zRangeInput.value)
};

const grid = new Grid3D(container, {
    dimensions: initialDimensions,
    gridColor: '#000000',
    backgroundColor: '#ffffff',
    dotSize: 0.1
});

// Add event listeners
addCubeButton.addEventListener('click', () => {
    const cubeProps: CubeProperties = {
        position: {
            x: parseInt(cubeXInput.value),
            y: parseInt(cubeYInput.value),
            z: parseInt(cubeZInput.value)
        },
        color: cubeColorInput.value,
        opacity: 0.6
    };
    grid.addCube(cubeProps);
});

removeCubeButton.addEventListener('click', () => {
    grid.removeLastCube();
});

// Update grid dimensions when inputs change
[xRangeInput, yRangeInput, zRangeInput].forEach(input => {
    input.addEventListener('change', () => {
        const newDimensions: GridDimensions = {
            xRange: parseInt(xRangeInput.value),
            yRange: parseInt(yRangeInput.value),
            zRange: parseInt(zRangeInput.value)
        };
        // You might want to add a method to Grid3D to update dimensions
        // grid.updateDimensions(newDimensions);
    });
});
