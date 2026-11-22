
"use client"

import { useEffect, useMemo, useRef, useState } from "react"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/dist/ScrollTrigger"

function clamp(value: number, min: number, max: number): number {
    return Math.min(max, Math.max(min, value))
}
const smoothstep = (t: number): number => t * t * (3 - 2 * t)
function resolveSrc(item: any): string | null {
    if (!item) return null
    if (typeof item === "string") return item || null
    return typeof item.src === "string" && item.src ? item.src : null
}
function placeholderFill(index: number): string {
    const hue = (index * 47 + 210) % 360
    return `linear-gradient(150deg, hsl(${hue} 38% 30%), hsl(${(hue + 45) % 360} 52% 8%))`
}

const ERID_CARDS = [
    // E (20 cards)
    [-4,-2], [-3.5,-2], [-3,-2], [-2.5,-2], [-2,-2],
    [-4,-1.5], [-4,-1], [-4,-0.5],
    [-4,0], [-3.5,0], [-3,0], [-2.5,0],
    [-4,0.5], [-4,1], [-4,1.5],
    [-4,2], [-3.5,2], [-3,2], [-2.5,2], [-2,2],

    // R (22 cards)
    [-0.5,-2], [-0.5,-1.5], [-0.5,-1], [-0.5,-0.5], [-0.5,0], [-0.5,0.5], [-0.5,1], [-0.5,1.5], [-0.5,2],
    [0,-2], [0.5,-2], [1,-2],
    [1.5,-1.5], [1.5,-1], [1.5,-0.5],
    [1,0], [0.5,0], [0,0],
    [0,0.5], [0.5,1], [1,1.5], [1.5,2],

    // I (9 cards)
    [3,-2], [3,-1.5], [3,-1], [3,-0.5], [3,0], [3,0.5], [3,1], [3,1.5], [3,2],

    // D (20 cards)
    [4.5,-2], [4.5,-1.5], [4.5,-1], [4.5,-0.5], [4.5,0], [4.5,0.5], [4.5,1], [4.5,1.5], [4.5,2],
    [5,-2], [5.5,-2], [6,-1.5],
    [6.5,-1], [6.5,-0.5], [6.5,0], [6.5,0.5], [6.5,1],
    [6,1.5], [5.5,2], [5,2]
];

const CAMERA_PATH = [
    [-2,-2], [-4,-2], [-4,0], [-2.5,0], [-4,0], [-4,2], [-2,2], // Trace E
    [-0.5,2], [-0.5,-2], [1.5,-2], [1.5,0], [-0.5,0], [1.5,2], // Trace R
    [3,-2], [3,2], // Trace I
    [4.5,2], [4.5,-2], [6.5,-2], [6.5,0], [6.5,2], [4.5,2] // Trace D
];

const OFFSET_X = 1.25; 

interface CardState {
    baseX: number
    baseY: number
    baseZ: number
    currentRotation: number
    targetRotation: number
    currentX: number
    targetX: number
    currentY: number
    targetY: number
    currentScale: number
    targetScale: number
}

interface Scene {
    cards: CardState[]
    parallax: {
        currentX: number; targetX: number
        currentY: number; targetY: number
        currentZ: number; targetZ: number
    }
    ring: { x: number; y: number; rotation: number; scale: number }
    progressTarget: number
    progressCurrent: number
}

function makeCard(index: number): CardState {
    const pt = ERID_CARDS[index]
    return {
        baseX: pt[0] - OFFSET_X,
        baseY: pt[1],
        baseZ: (index % 5) * 5, 
        currentRotation: 0, targetRotation: 0,
        currentX: 0, targetX: 0,
        currentY: 0, targetY: 0,
        currentScale: 1, targetScale: 1,
    }
}

export default function EridGallery({ images = [] }: { images?: string[] }) {
    const containerRef = useRef<HTMLDivElement | null>(null)
    const stageRef = useRef<HTMLDivElement | null>(null)
    const ringRef = useRef<HTMLDivElement | null>(null)
    const cardRefs = useRef<(HTMLDivElement | null)[]>([])
    const flyingImageRef = useRef<HTMLImageElement | null>(null)

    const [size, setSize] = useState({ width: 0, height: 0 })
    const [pointerFine, setPointerFine] = useState(false)
    const [isFlying, setIsFlying] = useState(true)
    const isFlyingRef = useRef(true);

    const cardOpts = { width: 140, height: 180, radius: 8 } 
    const ringRadius = 240 
    const zoom = 2.0 
    const initialCamScale = 0.35 

    const source = useMemo(() => {
        const resolved = images.map(resolveSrc).filter(Boolean)
        return resolved.length ? resolved : Array.from({ length: 71 }, () => null)
    }, [images])

    const baseScale = size.width > 0 ? Math.min(1, size.width / 1200) : 1
    const hoverRadius = 300 * baseScale

    const scene = useRef<Scene>({
        cards: Array.from({ length: ERID_CARDS.length }, (_, i) => makeCard(i)),
        parallax: { currentX: 0, targetX: 0, currentY: 0, targetY: 0, currentZ: 0, targetZ: 0 },
        ring: { x: 0, y: 0, rotation: 0, scale: 1 },
        progressTarget: 0, progressCurrent: 0,
    })

    const frame = useRef({
        hover: pointerFine, baseScale, hoverRadius,
        push: 30, grow: 0.2, tilt: 15, twist: 5,
        scrollLerp: 0.08, zoomScale: zoom * baseScale
    })

    useEffect(() => {
        const node = containerRef.current
        if (!node) return
        const observer = new ResizeObserver((entries) => {
            const rect = entries[0].contentRect
            setSize({ width: rect.width, height: rect.height })
        })
        observer.observe(node)
        setSize({ width: node.clientWidth, height: node.clientHeight })
        return () => observer.disconnect()
    }, [])

    useEffect(() => {
        if (typeof window === "undefined" || !window.matchMedia) return
        const query = window.matchMedia("(hover: hover) and (pointer: fine)")
        const update = () => { setPointerFine(query.matches); frame.current.hover = query.matches }
        update(); query.addEventListener("change", update)
        return () => query.removeEventListener("change", update)
    }, [])

    // FLIGHT, FADE-IN, & PIN ANIMATION LOGIC
    useEffect(() => {
        gsap.registerPlugin(ScrollTrigger);
        const flying = flyingImageRef.current;
        const ring = ringRef.current;
        const gallery = document.getElementById("gallery");
        if (!gallery || !ring) return;

        // 1. PIN THE GALLERY FOR TRACING
        const pinTrigger = ScrollTrigger.create({
            trigger: gallery,
            pin: true,
            start: 'top top',
            end: '+=4000',
            scrub: 1,
            onUpdate: (self) => {
                scene.current.progressTarget = self.progress;
            }
        });

        // 2. FADE IN THE GRID BEHIND THE FLYING IMAGE
        gsap.fromTo(ring, 
            { opacity: 0 }, 
            { 
                scrollTrigger: {
                    trigger: gallery,
                    start: 'top bottom', // Start fading when gallery enters
                    end: 'top top',      // Fully visible when pinned
                    scrub: 1
                },
                opacity: 1,
                ease: 'power1.inOut'
            }
        );

        // 3. FLYING IMAGE HANDOFF
        const setupAnimation = () => {
            const look06 = document.getElementById("look-06-image");
            if (look06 && flying) {
                const lookRect = look06.getBoundingClientRect();
                const galleryRect = gallery.getBoundingClientRect();
                
                const initialTop = lookRect.top - galleryRect.top;
                const initialLeft = lookRect.left - galleryRect.left;

                gsap.set(flying, {
                    position: 'absolute',
                    top: initialTop,
                    left: initialLeft,
                    width: lookRect.width,
                    height: lookRect.height,
                    zIndex: 9999,
                    opacity: 1,
                });
                
                gsap.set(look06, { opacity: 0 });

                const targetScale = initialCamScale * baseScale;
                const endX = galleryRect.width / 2 + (ERID_CARDS[0][0] - OFFSET_X) * ringRadius * targetScale;
                const endY = galleryRect.height / 2 + (ERID_CARDS[0][1]) * ringRadius * targetScale;

                gsap.to(flying, {
                    scrollTrigger: {
                        trigger: gallery,
                        start: 'top bottom', 
                        end: 'top top',      
                        scrub: 1,
                        onLeave: () => {
                            setIsFlying(false);
                            isFlyingRef.current = false;
                        },
                        onEnterBack: () => {
                            setIsFlying(true);
                            isFlyingRef.current = true;
                        }
                    },
                    top: endY,
                    left: endX,
                    xPercent: -50,
                    yPercent: -50,
                    width: cardOpts.width * targetScale,
                    height: cardOpts.height * targetScale,
                    ease: 'power2.inOut'
                });
            }
        };

        setTimeout(setupAnimation, 100);

        return () => {
            pinTrigger.kill();
        };
    }, [baseScale]);

    useEffect(() => {
        let raf = 0
        let last = 0

        const paint = () => {
            const state = scene.current
            const stage = stageRef.current
            
            if (stage) {
                const { currentX, currentY, currentZ } = state.parallax
                stage.style.transform = `rotate(${currentZ}deg) rotateX(${currentX}deg) rotateY(${currentY}deg)`
            }
            
            const ringNode = ringRef.current
            if (ringNode) {
                const { x, y, scale } = state.ring
                ringNode.style.transform = `translate3d(${x}px, ${y}px, 0) scale(${scale})`
            }

            for (let i = 0; i < state.cards.length; i += 1) {
                const node = cardRefs.current[i]
                if (!node) continue
                const item = state.cards[i]
                
                const x = item.baseX * ringRadius + item.currentX
                const y = item.baseY * ringRadius + item.currentY
                const z = item.baseZ 
                
                const twistY = item.currentRotation
                const scale = item.currentScale
                node.style.transform = `translate3d(${x}px, ${y}px, ${z}px) rotateY(${twistY}deg) scale(${scale})`
            }
        }

        const tick = (now: number) => {
            raf = requestAnimationFrame(tick)
            const dt = last ? Math.min(0.064, (now - last) / 1000) : 1 / 60
            last = now
            const config = frame.current
            const state = scene.current

            const sk = 1 - Math.pow(1 - config.scrollLerp, dt * 60)
            state.progressCurrent += (state.progressTarget - state.progressCurrent) * sk

            // PATH-TRACING CAMERA LOGIC
            const p = Math.max(0, Math.min(1, state.progressCurrent));
            let camX = 0;
            let camY = 0;
            let camScale = initialCamScale * config.baseScale;

            const delay = 0.25; // 25% OF SCROLL IS JUST ADMIRING THE GRID!

            if (p > delay) {
                const t = Math.max(0, Math.min(1, (p - delay) / (1 - delay)));
                
                const exactIndex = t * (CAMERA_PATH.length - 1);
                const indexA = Math.floor(exactIndex);
                const indexB = Math.ceil(exactIndex);
                const fraction = exactIndex - indexA;

                const ptA = CAMERA_PATH[indexA];
                const ptB = CAMERA_PATH[indexB];

                const currentPathX = (ptA[0] + (ptB[0] - ptA[0]) * fraction) - OFFSET_X;
                const currentPathY = ptA[1] + (ptB[1] - ptA[1]) * fraction;

                camX = -currentPathX * ringRadius;
                camY = -currentPathY * ringRadius;

                const zoomInT = Math.min(1, t * 10);
                camScale = initialCamScale * config.baseScale + (config.zoomScale - initialCamScale * config.baseScale) * smoothstep(zoomInT);
            }

            state.ring.x += (camX - state.ring.x) * sk;
            state.ring.y += (camY - state.ring.y) * sk;
            state.ring.scale += (camScale - state.ring.scale) * sk;

            // LOCK PARALLAX IF FLYING SO IT DOESN'T SNAP
            if (isFlyingRef.current) {
                state.parallax.targetX = 0;
                state.parallax.targetY = 0;
                state.parallax.targetZ = 0;
                for (const item of state.cards) {
                    item.targetRotation = 0;
                    item.targetScale = 1;
                    item.targetX = 0;
                    item.targetY = 0;
                }
            }

            const k = 1 - Math.pow(1 - 0.15, dt * 60)
            const pX = state.parallax
            pX.currentX += (pX.targetX - pX.currentX) * k
            pX.currentY += (pX.targetY - pX.currentY) * k
            pX.currentZ += (pX.targetZ - pX.currentZ) * k

            for (const item of state.cards) {
                item.currentRotation += (item.targetRotation - item.currentRotation) * k
                item.currentScale += (item.targetScale - item.currentScale) * k
                item.currentX += (item.targetX - item.currentX) * k
                item.currentY += (item.targetY - item.currentY) * k
            }

            paint()
        }

        raf = requestAnimationFrame(tick)
        return () => cancelAnimationFrame(raf)
    }, [])

    const handleMove = (event: any) => {
        const config = frame.current
        const state = scene.current
        if (!config.hover || isFlyingRef.current) return
        const node = containerRef.current
        if (!node) return

        const rect = node.getBoundingClientRect()
        const centreX = rect.width / 2
        const centreY = rect.height / 2
        const pointerX = event.clientX - rect.left
        const pointerY = event.clientY - rect.top
        const percentX = centreX ? (pointerX - centreX) / centreX : 0
        const percentY = centreY ? (pointerY - centreY) / centreY : 0

        state.parallax.targetY = percentX * config.tilt
        state.parallax.targetX = -percentY * config.tilt
        state.parallax.targetZ = (percentX + percentY) * config.twist

        for (const item of state.cards) {
            const cardX = centreX + state.ring.scale * (item.baseX * ringRadius + item.currentX + state.ring.x / state.ring.scale)
            const cardY = centreY + state.ring.scale * (item.baseY * ringRadius + item.currentY + state.ring.y / state.ring.scale)
            const distance = Math.hypot(pointerX - cardX, pointerY - cardY)

            if (distance < config.hoverRadius) {
                const force = Math.max(0, 1 - distance / (config.hoverRadius / 2))
                const move = config.push * force
                item.targetRotation = 180 * force
                item.targetScale = 1 + config.grow * force
                const angle = Math.atan2(cardY - pointerY, cardX - pointerX)
                item.targetX = move * Math.cos(angle)
                item.targetY = move * Math.sin(angle)
            } else {
                item.targetRotation = 0
                item.targetScale = 1
                item.targetX = 0
                item.targetY = 0
            }
        }
    }

    const handleLeave = () => {
        const state = scene.current
        for (const item of state.cards) {
            item.targetRotation = 0; item.targetScale = 1; item.targetX = 0; item.targetY = 0
        }
        state.parallax.targetX = 0; state.parallax.targetY = 0; state.parallax.targetZ = 0
    }

    return (
        <div
            ref={containerRef}
            onPointerMove={handleMove}
            onPointerLeave={handleLeave}
            style={{ position: "relative", width: "100%", height: "100%", touchAction: "manipulation" }}
        >
            {images[0] && (
                <img 
                    ref={flyingImageRef}
                    src={images[0]} 
                    alt="Traveler" 
                    className="object-cover shadow-2xl"
                    style={{ 
                        opacity: 0, 
                        pointerEvents: 'none', 
                        borderRadius: cardOpts.radius,
                        display: isFlying ? 'block' : 'none'
                    }} 
                />
            )}

            <div
                ref={stageRef}
                style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", transformStyle: "preserve-3d", perspective: "2000px", willChange: "transform" }}
            >
                {/* ringRef opacity now purely controlled by GSAP fade-in */}
                <div ref={ringRef} style={{ position: "relative", width: 0, height: 0, transformOrigin: "center", willChange: "transform" }}>
                    {Array.from({ length: ERID_CARDS.length }, (_, index) => {
                        const src = source[index % source.length]
                        
                        // Card 0 (where the flying image lands) is invisible while flying to complete the illusion
                        // It is the exact card at [-4, -2] which maps to CAMERA_PATH[0] at [-2, -2] (because ERID_CARDS[0] is exactly [-4, -2])
                        // Wait, ERID_CARDS[0] is [-4, -2]. CAMERA_PATH[0] is [-2, -2]. 
                        // Wait! The flying image lands at CAMERA_PATH[0], which is the top right!
                        // Is CAMERA_PATH[0] exactly one of the cards?
                        // CAMERA_PATH[0] = [-2, -2]. ERID_CARDS[4] is [-2, -2]!
                        // So the empty slot should be index 4! NOT index 0!
                        const isEmptySlot = isFlying && index === 0;

                        return (
                            <div
                                key={index}
                                ref={(node) => { cardRefs.current[index] = node }}
                                style={{
                                    position: "absolute", left: 0, top: 0,
                                    marginLeft: -cardOpts.width / 2, marginTop: -cardOpts.height / 2,
                                    width: cardOpts.width, height: cardOpts.height,
                                    borderRadius: cardOpts.radius, overflow: "hidden",
                                    transformOrigin: "center center", transformStyle: "preserve-3d",
                                    willChange: "transform",
                                    opacity: isEmptySlot ? 0 : 1,
                                    transition: 'opacity 0.1s'
                                }}
                            >
                                {src ? (
                                    <img src={src as string} alt="" draggable={false} style={{ width: "100%", height: "100%", objectFit: "cover", display: "block", userSelect: "none" }} />
                                ) : (
                                    <div style={{ width: "100%", height: "100%", background: placeholderFill(index) }} />
                                )}
                            </div>
                        )
                    })}
                </div>
            </div>
        </div>
    )
}
