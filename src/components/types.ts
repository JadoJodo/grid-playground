export interface GridDimensions {
    xRange: number;
    yRange: number;
    zRange: number;
}

export interface CubeProperties {
    position: {
        x: number;
        y: number;
        z: number;
    };
    color: string;
    opacity?: number;
    edgeColor?: string;
}

export interface Grid3DOptions {
    dimensions: GridDimensions;
    gridColor?: string;
    backgroundColor?: string;
    dotSize?: number;
}
