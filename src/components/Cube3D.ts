import * as THREE from 'three';
import { CubeProperties } from './types';

export class Cube3D {
    private mesh: THREE.Mesh;
    private edges: THREE.LineSegments;
    private properties: CubeProperties;

    constructor(properties: CubeProperties) {
        this.properties = properties;
        
        // Create cube geometry
        const geometry = new THREE.BoxGeometry(1, 1, 1);
        
        // Create materials
        const material = new THREE.MeshPhongMaterial({
            color: properties.color,
            transparent: true,
            opacity: properties.opacity || 0.6
        });

        // Create mesh
        this.mesh = new THREE.Mesh(geometry, material);
        this.mesh.position.set(
            properties.position.x,
            properties.position.y,
            properties.position.z
        );

        // Create edges
        const edgesGeometry = new THREE.EdgesGeometry(geometry);
        const edgesMaterial = new THREE.LineBasicMaterial({
            color: properties.edgeColor || '#000000',
            linewidth: 2
        });
        this.edges = new THREE.LineSegments(edgesGeometry, edgesMaterial);
        this.edges.position.copy(this.mesh.position);
    }

    getMesh(): THREE.Mesh {
        return this.mesh;
    }

    getEdges(): THREE.LineSegments {
        return this.edges;
    }

    setPosition(x: number, y: number, z: number): void {
        this.mesh.position.set(x, y, z);
        this.edges.position.set(x, y, z);
    }

    setColor(color: string): void {
        (this.mesh.material as THREE.MeshPhongMaterial).color.set(color);
    }

    setOpacity(opacity: number): void {
        (this.mesh.material as THREE.MeshPhongMaterial).opacity = opacity;
    }
}
