"use client"

import { useState, useRef, useEffect, useCallback, Suspense } from "react";
import dynamic from "next/dynamic";
import { useFrame, useThree } from "@react-three/fiber";
import { motion, AnimatePresence } from "framer-motion";
import { Maximize2, Minimize2, ChevronRight, ChevronLeft, Eye, Loader2 } from "lucide-react";
import * as THREE from "three";

// ── Type ──────────────────────────────────────────────────────────────────────

type Room = {
  id: number;
  roomKey: string;
  name: string;
  description: string;
  image: string;   
  order: number;
};

// ── PanoSphere ────────────────────────────────────────────────────────────────
function PanoSphere({ imageUrl }: { imageUrl: string }) {
  const meshRef = useRef<THREE.Mesh>(null);
  const [texture, setTexture] = useState<THREE.Texture | null>(null);

  useEffect(() => {
    const loader = new THREE.TextureLoader();
    loader.load(imageUrl, (tex) => {
      tex.mapping = THREE.EquirectangularReflectionMapping;
      tex.colorSpace = THREE.SRGBColorSpace;
      setTexture(tex);
    });
  }, [imageUrl]);

  useFrame(() => {
    if (meshRef.current) meshRef.current.rotation.y += 0.0005;
  });

  if (!texture) return null;

  return (
    <mesh ref={meshRef} scale={[-1, 1, 1]}>
      <sphereGeometry args={[50, 64, 32]} />
      <meshBasicMaterial map={texture} side={THREE.BackSide} />
    </mesh>
  );
}

// ── PanoControls ──────────────────────────────────────────────────────────────
function PanoControls() {
  const { camera, gl } = useThree();
  const isPointerDown = useRef(false);
  const prevPointer = useRef({ x: 0, y: 0 });
  const lon = useRef(0);
  const lat = useRef(0);

  const updateCamera = useCallback(() => {
    const phi   = THREE.MathUtils.degToRad(90 - lat.current);
    const theta = THREE.MathUtils.degToRad(lon.current);
    camera.lookAt(new THREE.Vector3(
      Math.sin(phi) * Math.cos(theta),
      Math.cos(phi),
      Math.sin(phi) * Math.sin(theta)
    ));
  }, [camera]);

  useEffect(() => {
    const el = gl.domElement;
    const onDown  = (e: PointerEvent) => { isPointerDown.current = true; prevPointer.current = { x: e.clientX, y: e.clientY }; };
    const onMove  = (e: PointerEvent) => {
      if (!isPointerDown.current) return;
      lon.current -= (e.clientX - prevPointer.current.x) * 0.2;
      lat.current  = Math.max(-85, Math.min(85, lat.current + (e.clientY - prevPointer.current.y) * 0.2));
      prevPointer.current = { x: e.clientX, y: e.clientY };
      updateCamera();
    };
    const onUp    = () => { isPointerDown.current = false; };
    const onTouchStart = (e: TouchEvent) => { if (e.touches.length === 1) { isPointerDown.current = true; prevPointer.current = { x: e.touches[0].clientX, y: e.touches[0].clientY }; } };
    const onTouchMove  = (e: TouchEvent) => {
      if (!isPointerDown.current || e.touches.length !== 1) return;
      lon.current -= (e.touches[0].clientX - prevPointer.current.x) * 0.2;
      lat.current  = Math.max(-85, Math.min(85, lat.current + (e.touches[0].clientY - prevPointer.current.y) * 0.2));
      prevPointer.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
      updateCamera();
    };

    el.addEventListener("pointerdown",  onDown);
    el.addEventListener("pointermove",  onMove);
    el.addEventListener("pointerup",    onUp);
    el.addEventListener("pointerleave", onUp);
    el.addEventListener("touchstart",   onTouchStart, { passive: true });
    el.addEventListener("touchmove",    onTouchMove,  { passive: true });
    el.addEventListener("touchend",     onUp);
    updateCamera();

    return () => {
      el.removeEventListener("pointerdown",  onDown);
      el.removeEventListener("pointermove",  onMove);
      el.removeEventListener("pointerup",    onUp);
      el.removeEventListener("pointerleave", onUp);
      el.removeEventListener("touchstart",   onTouchStart);
      el.removeEventListener("touchmove",    onTouchMove);
      el.removeEventListener("touchend",     onUp);
    };
  }, [gl, updateCamera]);

  return null;
}

// ── SSR-safe Canvas ───────────────────────────────────────────────────────────

const NoSSRCanvas = dynamic(
  () => import("@react-three/fiber").then((mod) => {
    const { Canvas } = mod;
    return function WrappedCanvas(props: React.ComponentProps<typeof Canvas>) {
      return <Canvas {...props} />;
    };
  }),
  { ssr: false }
);

// ── Main Component ────────────────────────────────────────────────────────────
export default function WalkthroughPage() {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [loading, setLoading] = useState(true);


  const [currentRoom, setCurrentRoom]     = useState(0);
  const [isFullscreen, setIsFullscreen]   = useState(false);
  const [transitioning, setTransitioning] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // ── Fetch rooms from API ──────────────────────────────────────────────────
  useEffect(() => {
    const fetchRooms = async () => {
      try {
        const res  = await fetch("/api/walkthrough");
        const data = await res.json();
        setRooms(data.data?.rooms ?? []);
      } catch {
        setRooms([]);
      } finally {
        setLoading(false);
      }
    };
    fetchRooms();
  }, []);

  // ── Room navigation ───────────────────────────────────────────────────────
  const goToRoom = (index: number) => {
    if (index === currentRoom || transitioning || rooms.length === 0) return;
    setTransitioning(true);
    setTimeout(() => {
      setCurrentRoom(index);
      setTimeout(() => setTransitioning(false), 300);
    }, 300);
  };

  const nextRoom = () => goToRoom((currentRoom + 1) % rooms.length);
  const prevRoom = () => goToRoom((currentRoom - 1 + rooms.length) % rooms.length);

  // ── Fullscreen ────────────────────────────────────────────────────────────
  const toggleFullscreen = () => {
    if (!containerRef.current) return;
    if (!isFullscreen) {
      containerRef.current.requestFullscreen?.();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen?.();
      setIsFullscreen(false);
    }
  };

  useEffect(() => {
    const handler = () => setIsFullscreen(!!document.fullscreenElement);
    document.addEventListener("fullscreenchange", handler);
    return () => document.removeEventListener("fullscreenchange", handler);
  }, []);

  const room = rooms[currentRoom];

  // ── UI ────────────────────────────────────────────────────────────────────
  return (
    <section id="walkthrough" className="section-padding bg-secondary/30">
      <div className="container mx-auto">

        {/* Header */}
        <motion.div className="text-center mb-12"
          initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }} transition={{ duration: 0.7 }}>
          <span className="text-accent font-semibold text-sm uppercase tracking-wider">Virtual Experience</span>
          <h2 className="font-heading text-3xl md:text-5xl font-bold text-foreground mt-2">
            Walk Through Our <span className="text-gradient-gold">Completed Projects</span>
          </h2>
          <p className="text-muted-foreground mt-4 max-w-2xl mx-auto">
            Explore every room in 360° — drag to look around and navigate between spaces.
          </p>
        </motion.div>

        {/* Loading state */}
        {loading && (
          <div className="flex justify-center items-center aspect-[16/9] rounded-xl border border-border bg-foreground/5">
            <Loader2 size={36} className="animate-spin text-muted-foreground" />
          </div>
        )}

        {/* No rooms */}
        {!loading && rooms.length === 0 && (
          <div className="flex justify-center items-center aspect-[16/9] rounded-xl border border-border bg-foreground/5">
            <p className="text-muted-foreground text-sm">No walkthrough rooms available yet.</p>
          </div>
        )}

        {/* Viewer */}
        {!loading && room && (
          <motion.div
            ref={containerRef}
            className={`relative rounded-xl overflow-hidden border border-border bg-foreground/5 ${
              isFullscreen ? "fixed inset-0 z-50 rounded-none" : "aspect-[16/9]"
            }`}
            initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }} transition={{ duration: 0.7, delay: 0.2 }}>

            {/* Transition overlay */}
            <AnimatePresence>
              {transitioning && (
                <motion.div className="absolute inset-0 z-30 bg-foreground"
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }} />
              )}
            </AnimatePresence>

            {/* 360° Canvas */}
            <Suspense fallback={
              <div className="absolute inset-0 flex items-center justify-center bg-secondary">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent" />
              </div>
            }>
              <NoSSRCanvas camera={{ fov: 75, position: [0, 0, 0.1] }} dpr={[1, 1.5]}>
           
                <PanoSphere imageUrl={`/api/files/${room.image}`} />
                <PanoControls />
              </NoSSRCanvas>
            </Suspense>

            {/* Room info */}
            <div className="absolute top-4 left-4 z-20 max-w-[160px] sm:max-w-xs">
              <motion.div key={room.id}
                initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}
                className="bg-foreground/60 backdrop-blur-md text-primary-foreground rounded-lg px-4 py-3">
                <div className="flex items-center gap-2 mb-1">
                  <Eye size={14} className="text-accent" />
                  <h4 className="font-heading font-bold text-sm">{room.name}</h4>
                </div>
                <p className="text-[11px] text-primary-foreground/70 leading-relaxed">{room.description}</p>
              </motion.div>
            </div>

            {/* Prev / Next */}
            <button onClick={prevRoom}
              className="absolute left-3 top-1/2 -translate-y-1/2 z-20 bg-foreground/50 hover:bg-foreground/70 text-primary-foreground p-2 rounded-full backdrop-blur-sm transition-all">
              <ChevronLeft size={22} />
            </button>
            <button onClick={nextRoom}
              className="absolute right-3 top-1/2 -translate-y-1/2 z-20 bg-foreground/50 hover:bg-foreground/70 text-primary-foreground p-2 rounded-full backdrop-blur-sm transition-all">
              <ChevronRight size={22} />
            </button>

            {/* Fullscreen toggle */}
            <button onClick={toggleFullscreen}
              className="absolute top-4 right-4 z-20 bg-foreground/50 hover:bg-foreground/70 text-primary-foreground p-2 rounded-full backdrop-blur-sm transition-all">
              {isFullscreen ? <Minimize2 size={18} /> : <Maximize2 size={18} />}
            </button>

            {/* Room pills */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 flex gap-1.5 max-w-[90vw] overflow-x-auto px-2 scrollbar-none">
              {rooms.map((r, i) => (
                <button key={r.id} onClick={() => goToRoom(i)}
                  className={`px-3 py-1.5 rounded-full text-xs font-medium backdrop-blur-sm transition-all whitespace-nowrap ${
                    i === currentRoom
                      ? "bg-accent text-accent-foreground shadow-lg"
                      : "bg-foreground/40 text-primary-foreground/80 hover:bg-foreground/60"
                  }`}>
                  {r.name}
                </button>
              ))}
            </div>

            {/* Hint */}
            <div className="absolute bottom-14 left-1/2 -translate-x-1/2 z-20 bg-foreground/40 backdrop-blur-sm text-primary-foreground text-[10px] sm:text-[11px] px-3 py-1 rounded-full whitespace-nowrap">
              Drag to look around in 360°
            </div>

          </motion.div>
        )}
      </div>
    </section>
  );
}