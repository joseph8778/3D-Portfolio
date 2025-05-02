"use client";
import { useEffect, useRef, useState } from "react";
import {
  Color,
  Fog,
  Group,
  PerspectiveCamera,
  Scene,
  Vector3,
} from "three";
import ThreeGlobe from "three-globe";
import {
  useThree,
  Canvas,
  useFrame,
} from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import countries from "../../data/Globe.json";

const RING_PROPAGATION_SPEED = 3;
const cameraZ = 300;

type Position = {
  order: number;
  startLat: number;
  startLng: number;
  endLat: number;
  endLng: number;
  arcAlt: number;
  color: string;
};

export type GlobeConfig = {
  pointSize?: number;
  globeColor?: string;
  showAtmosphere?: boolean;
  atmosphereColor?: string;
  atmosphereAltitude?: number;
  emissive?: string;
  emissiveIntensity?: number;
  shininess?: number;
  polygonColor?: string;
  ambientLight?: string;
  directionalLeftLight?: string;
  directionalTopLight?: string;
  pointLight?: string;
  arcTime?: number;
  arcLength?: number;
  rings?: number;
  maxRings?: number;
  initialPosition?: {
    lat: number;
    lng: number;
  };
  autoRotate?: boolean;
  autoRotateSpeed?: number;
};

interface WorldProps {
  globeConfig: GlobeConfig;
  data: Position[];
}

export function Globe({ globeConfig, data }: WorldProps) {
  const globeRef = useRef<any>(null);
  const groupRef = useRef<Group>(null);

  const [globeData, setGlobeData] = useState<any[]>([]);

  const defaultProps = {
    pointSize: 1,
    atmosphereColor: "#ffffff",
    showAtmosphere: true,
    atmosphereAltitude: 0.1,
    polygonColor: "rgba(255,255,255,0.7)",
    globeColor: "#1d072e",
    emissive: "#000000",
    emissiveIntensity: 0.1,
    shininess: 0.9,
    arcTime: 2000,
    arcLength: 0.9,
    rings: 1,
    maxRings: 3,
    ...globeConfig,
  };

  useEffect(() => {
    const g = new ThreeGlobe();

    g.hexPolygonsData(countries.features)
      .hexPolygonResolution(3)
      .hexPolygonMargin(0.7)
      .showAtmosphere(defaultProps.showAtmosphere)
      .atmosphereColor(defaultProps.atmosphereColor)
      .atmosphereAltitude(defaultProps.atmosphereAltitude)
      .hexPolygonColor(() => defaultProps.polygonColor);

    const material = g.globeMaterial() as any;
    material.color = new Color(defaultProps.globeColor);
    material.emissive = new Color(defaultProps.emissive);
    material.emissiveIntensity = defaultProps.emissiveIntensity;
    material.shininess = defaultProps.shininess;

    globeRef.current = g;
    if (groupRef.current) {
      groupRef.current.add(g);
    }

    const arcs = data;
    const points = arcs.flatMap((arc) => {
      const rgb = hexToRgb(arc.color)!;
      const point = (lat: number, lng: number) => ({
        size: defaultProps.pointSize,
        order: arc.order,
        color: (t: number) =>
          `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${1 - t})`,
        lat,
        lng,
      });
      return [point(arc.startLat, arc.startLng), point(arc.endLat, arc.endLng)];
    });

    const uniquePoints = points.filter(
      (v, i, a) =>
        a.findIndex(
          (v2) => v2.lat === v.lat && v2.lng === v.lng
        ) === i
    );

    setGlobeData(uniquePoints);

    g.arcsData(data)
      .arcStartLat((d) => d.startLat)
      .arcStartLng((d) => d.startLng)
      .arcEndLat((d) => d.endLat)
      .arcEndLng((d) => d.endLng)
      .arcColor((d) => d.color)
      .arcAltitude((d) => d.arcAlt)
      .arcStroke(() => [0.32, 0.28, 0.3][Math.floor(Math.random() * 3)])
      .arcDashLength(defaultProps.arcLength)
      .arcDashGap(15)
      .arcDashInitialGap((d) => d.order)
      .arcDashAnimateTime(defaultProps.arcTime);

    g.pointsData(data)
      .pointColor((d) => d.color)
      .pointsMerge(true)
      .pointAltitude(0)
      .pointRadius(2);

    g.ringsData([])
      .ringColor((e: any) => (t: number) => e.color(t))
      .ringMaxRadius(defaultProps.maxRings)
      .ringPropagationSpeed(RING_PROPAGATION_SPEED)
      .ringRepeatPeriod(
        (defaultProps.arcTime * defaultProps.arcLength) /
          defaultProps.rings
      );
  }, [data]);

  useEffect(() => {
    if (!globeRef.current || !globeData.length) return;
    const interval = setInterval(() => {
      const randomIndices = genRandomNumbers(0, globeData.length, Math.floor(globeData.length * 0.8));
      const filtered = globeData.filter((_, i) => randomIndices.includes(i));
      globeRef.current!.ringsData(filtered);
    }, 2000);
    return () => clearInterval(interval);
  }, [globeData]);

  useFrame(() => {
    if (globeConfig.autoRotate && groupRef.current) {
      groupRef.current.rotation.y += 0.002 * (globeConfig.autoRotateSpeed || 1);
    }
  });

  return <group ref={groupRef} />;
}

export function WebGLRendererConfig() {
  const { gl, size } = useThree();

  useEffect(() => {
    gl.setPixelRatio(window.devicePixelRatio);
    gl.setSize(size.width, size.height);
    gl.setClearColor(0xffaaff, 0);
  }, []);

  return null;
}

export function World(props: WorldProps) {
  const { globeConfig } = props;

  return (
    <Canvas
      camera={{ position: [0, 0, cameraZ], fov: 50 }}
      gl={{ antialias: true }}
      shadows
    >
      <ambientLight color={globeConfig.ambientLight} intensity={0.6} />
      <directionalLight
        color={globeConfig.directionalLeftLight}
        position={[-400, 100, 400]}
      />
      <directionalLight
        color={globeConfig.directionalTopLight}
        position={[-200, 500, 200]}
      />
      <pointLight
        color={globeConfig.pointLight}
        position={[-200, 500, 200]}
        intensity={0.8}
      />
      <Globe {...props} />
      <OrbitControls
        enablePan={false}
        enableZoom={false}
        minDistance={cameraZ}
        maxDistance={cameraZ}
        autoRotate
        autoRotateSpeed={1}
        minPolarAngle={Math.PI / 3.5}
        maxPolarAngle={Math.PI - Math.PI / 3}
      />
    </Canvas>
  );
}

function hexToRgb(hex: string) {
  const shorthand = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
  hex = hex.replace(shorthand, (_, r, g, b) => r + r + g + g + b + b);
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16),
      }
    : null;
}

function genRandomNumbers(min: number, max: number, count: number) {
  const arr = new Set<number>();
  while (arr.size < count) {
    arr.add(Math.floor(Math.random() * (max - min)) + min);
  }
  return [...arr];
}
