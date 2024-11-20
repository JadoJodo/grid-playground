import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { Grid3DOptions, CubeProperties } from './types';
import { Cube3D } from './Cube3D';

export class Grid3D {
    private scene: THREE.Scene;
    private camera: THREE.PerspectiveCamera;
    private renderer: THREE.WebGLRenderer;
    private controls: OrbitControls;
    private grid: THREE.Points;
    private cubes: Cube3D[] = [];
    private options: Grid3DOptions;
    private raycaster: THREE.Raycaster;
    private mouse: THREE.Vector2;
    private selectedCube: Cube3D | null = null;
    private onCubeSelected: ((cube: Cube3D | null) => void) | null = null;

    constructor(container: HTMLElement, options: Grid3DOptions) {
        this.options = options;
        
        // Scene setup
        this.scene = new THREE.Scene();
        this.scene.background = new THREE.Color(options.backgroundColor || '#ffffff');

        // Camera setup
        this.camera = new THREE.PerspectiveCamera(
            75,
            container.clientWidth / container.clientHeight,
            0.1,
            1000
        );
        this.camera.position.set(15, 15, 15);

        // Renderer setup
        this.renderer = new THREE.WebGLRenderer({ antialias: true });
        this.renderer.setSize(container.clientWidth, container.clientHeight);
        container.appendChild(this.renderer.domElement);

        // Controls setup
        this.controls = new OrbitControls(this.camera, this.renderer.domElement);
        this.controls.enableDamping = true;

        // Lighting
        const ambientLight = new THREE.AmbientLight(0x404040);
        const directionalLight = new THREE.DirectionalLight(0xffffff, 0.5);
        directionalLight.position.set(10, 10, 10);
        this.scene.add(ambientLight, directionalLight);

        // Create grid
        this.createGrid();

        // Start animation
        this.animate();

        // Handle window resize
        window.addEventListener('resize', () => this.onWindowResize(container));
    }

    private createGrid(): void {
        const { xRange, yRange, zRange } = this.options.dimensions;
        const positions: number[] = [];
        const dotSize = this.options.dotSize || 0.1;

        for (let x = -xRange; x <= xRange; x++) {
            for (let y = -yRange; y <= yRange; y++) {
                for (let z = -zRange; z <= zRange; z++) {
                    positions.push(x, y, z);
                }
            }
        }

        const geometry = new THREE.BufferGeometry();
        geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));

        const material = new THREE.PointsMaterial({
            color: this.options.gridColor || '#000000',
            size: dotSize
        });

        this.grid = new THREE.Points(geometry, material);
        this.scene.add(this.grid);
    }

    addCube(properties: CubeProperties): void {
        const cube = new Cube3D(properties);
        this.cubes.push(cube);
        this.scene.add(cube.getMesh());
        this.scene.add(cube.getEdges());
    }

    removeLastCube(): void {
        const cube = this.cubes.pop();
        if (cube) {
            this.scene.remove(cube.getMesh());
            this.scene.remove(cube.getEdges());
        }
    }

    private animate(): void {
        requestAnimationFrame(() => this.animate());
        this.controls.update();
        this.renderer.render(this.scene, this.camera);
    }

    private onWindowResize(container: HTMLElement): void {
        this.camera.aspect = container.clientWidth / container.clientHeight;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(container.clientWidth, container.clientHeight);
    }

    setOnCubeSelected(callback: (cube: Cube3D | null) => void): void {
        this.onCubeSelected = callback;
    }

    private initializeRaycaster(): void {
        this.raycaster = new THREE.Raycaster();
        this.mouse = new THREE.Vector2();

        this.renderer.domElement.addEventListener('click', (event) => {
            const rect = this.renderer.domElement.getBoundingClientRect();
            this.mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
            this.mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

            this.raycaster.setFromCamera(this.mouse, this.camera);
            const intersects = this.raycaster.intersectObjects(
                this.cubes.map(cube => cube.getMesh())
            );

            if (intersects.length > 0) {
                const selectedMesh = intersects[0].object;
                const selectedCube = this.cubes.find(cube => cube.getMesh() === selectedMesh);
                this.selectCube(selectedCube || null);
            } else {
                this.selectCube(null);
            }
        });
    }

    private selectCube(cube: Cube3D | null): void {
        if (this.selectedCube) {
            this.selectedCube.deselect();
        }
        this.selectedCube = cube;
        if (cube) {
            cube.select();
        }
        if (this.onCubeSelected) {
            this.onCubeSelected(cube);
        }
    }

    getCubes(): Cube3D[] {
        return this.cubes;
    }

    removeCube(cube: Cube3D): void {
        const index = this.cubes.indexOf(cube);
        if (index > -1) {
            this.cubes.splice(index, 1);
            this.scene.remove(cube.getMesh());
            this.scene.remove(cube.getEdges());
            if (this.selectedCube === cube) {
                this.selectCube(null);
            }
        }
    }
}
