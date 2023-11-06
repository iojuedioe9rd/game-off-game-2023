/// <reference types="vite/client" />



type vec2 = {
    x: number,
    y: number
}

type size = {
    width: number
    height: number
}

type mapInfo = {
    polyline: vec2[];
    map: string;
}

type mouseData  = Partial<vec2> & {
    width: number
    height: number
}
type rect = vec2 & size

type HealthCallback = (oldHealth: number, health: number) => (void | Promise<void>)
