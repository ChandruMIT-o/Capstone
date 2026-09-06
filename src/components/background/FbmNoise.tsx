import React, { useEffect, useRef } from "react";
import * as THREE from "three";

// Shader code definitions
const vertexShaderSource = `
  void main() {
    gl_Position = vec4( position, 1.0 );
  }
`;

const fragmentShaderSource = `
  uniform vec2 u_resolution;
  uniform float u_time;
  uniform bool u_complex;
  uniform float u_speed;
  uniform float u_scale;
  uniform float u_seed;
  uniform float u_mouse_influence;
  uniform float u_brightness;
  uniform vec3 u_color_shift;
  uniform vec2 u_mouse;

  const int octaves = 6;

  vec2 random2(vec2 st, float s){
    st = vec2( dot(st,vec2(127.1,311.7)),
              dot(st,vec2(269.5,183.3)) );
    return -1.0 + 2.0*fract(sin(st)*s);
  }

  // Value Noise by Inigo Quilez
  float noise(vec2 st, float s) {
    vec2 i = floor(st);
    vec2 f = fract(st);

    vec2 u = f*f*(3.0-2.0*f);

    return mix( mix( dot( random2(i + vec2(0.0,0.0), s ), f - vec2(0.0,0.0) ), 
                     dot( random2(i + vec2(1.0,0.0), s ), f - vec2(1.0,0.0) ), u.x),
                mix( dot( random2(i + vec2(0.0,1.0), s ), f - vec2(0.0,1.0) ), 
                     dot( random2(i + vec2(1.0,1.0), s ), f - vec2(1.0,1.0) ), u.x), u.y);
  }

  float fbm1(in vec2 _st, float s) {
    float v = 0.0;
    float a = 0.5;
    vec2 shift = vec2(100.0);
    mat2 rot = mat2(cos(0.5), sin(0.5),
                    -sin(0.5), cos(0.50));
    for (int i = 0; i < octaves; ++i) {
        v += a * noise(_st, s);
        _st = rot * _st * 2.0 + shift;
        a *= 0.4;
    }
    return v;
  }

  float pattern(vec2 uv, float s, float time, inout vec2 q, inout vec2 r) {
    q = vec2( fbm1( uv * .1 + vec2(0.0,0.0), s ),
                   fbm1( uv + vec2(5.2,1.3), s ) );

    r = vec2( fbm1( uv * .1 + 4.0*q + vec2(1.7 - time / 2.,9.2), s ),
                   fbm1( uv + 4.0*q + vec2(8.3 - time / 2.,2.8), s ) );

    vec2 s_vec = vec2( fbm1( uv + 5.0*r + vec2(21.7 - time / 2.,90.2), s ),
                   fbm1( uv * .05 + 5.0*r + vec2(80.3 - time / 2.,20.8), s ) );

    return fbm1( uv * .05 + 4.0*s_vec, s );
  }

  float pattern2(vec2 uv, float s, float time, inout vec2 q, inout vec2 r) {
    q = vec2( fbm1( uv + vec2(0.0,0.0), s ),
                   fbm1( uv + vec2(5.2,1.3), s ) );

    r = vec2( fbm1( uv + 4.0*q + vec2(1.7 - time / 2.,9.2), s ),
                   fbm1( uv + 4.0*q + vec2(8.3 - time / 2.,2.8), s ) );

    vec2 s_vec = vec2( fbm1( uv + 5.0*r + vec2(21.7 - time / 2.,90.2), s ),
                   fbm1( uv + 5.0*r + vec2(80.3 - time / 2.,20.8), s ) );

    vec2 t = vec2( fbm1( uv + 4.0*s_vec + vec2(121.7 - time / 2.,190.2), s ),
                   fbm1( uv + 4.0*s_vec + vec2(180.3 - time / 2.,120.8), s ) );

    vec2 u = vec2( fbm1( uv + 3.0*t + vec2(221.7 - time / 2.,290.2), s ),
                   fbm1( uv + 3.0*t + vec2(280.3 - time / 2.,220.8), s ) );

    vec2 v = vec2( fbm1( uv + 2.0*u + vec2(221.7 - time / 2.,290.2), s ),
                   fbm1( uv + 2.0*u + vec2(280.3 - time / 2.,220.8), s ) );

    return fbm1( uv + 4.0*v, s );
  }

  void main() {
    vec2 uv = (gl_FragCoord.xy - 0.5 * u_resolution.xy) / u_resolution.y;
    
    // Normalize mouse input to coordinate spaces
    vec2 normMouse = (u_mouse - 0.5 * u_resolution) / u_resolution.y;
    
    // Interactive mouse distortion warp
    uv += normMouse * u_mouse_influence;
    
    float time = u_time * u_speed;
    
    mat2 rot = mat2(cos(time / 10.), sin(time / 10.),
                    -sin(time / 10.), cos(time / 10.));
    
    uv = rot * uv;
    uv *= u_scale;
    uv.x -= time / 5.;
    
    vec2 q = vec2(0.,0.);
    vec2 r = vec2(0.,0.);
    
    float _pattern = 0.;
    float s2 = u_seed + 29398.3020069;
    
    if(u_complex) {
      _pattern = pattern2(uv, u_seed, time, q, r);
    } else {
      _pattern = pattern(uv, u_seed, time, q, r);
    }
    
    vec3 colour = vec3(_pattern) * 2.0;
    colour.r -= dot(q, r) * 15.0;
    
    // Apply Chromatic controls
    colour.rgb *= u_color_shift;
    
    colour = mix(colour, vec3(pattern(r, s2, time, q, r), dot(q, r) * 15.0, -0.1), 0.5);
    colour -= q.y * 1.5;
    colour = mix(colour, vec3(0.2, 0.2, 0.2), (clamp(q.x, -1.0, 0.0)) * 3.0);
    
    vec3 finalColor = -colour + (abs(colour) * 0.5);
    finalColor *= u_brightness;
    
    gl_FragColor = vec4(finalColor, 1.0);
  }
`;

export interface FbmNoiseProps {
  complex?: boolean;
  speed?: number;
  scale?: number;
  seed?: number;
  mouseInfluence?: number;
  brightness?: number;
  colorR?: number;
  colorG?: number;
  colorB?: number;
  paused?: boolean;
  observeVisibility?: boolean;
  className?: string;
  children?: React.ReactNode;
}

export const FbmNoise: React.FC<FbmNoiseProps> = ({
  complex = false,
  speed = 0.1,
  scale = 3.0,
  seed = 43758.5453123,
  mouseInfluence = 0.5,
  brightness = 1.0,
  colorR = 1.0,
  colorG = 1.0,
  colorB = 1.0,
  paused = false,
  observeVisibility = true,
  className = "",
  children,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const uniformsRef = useRef<any>(null);

  // Sync params in ref to avoid re-triggering Three.js setup on every single state change
  const paramsRef = useRef({
    complex,
    speed,
    scale,
    seed,
    mouseInfluence,
    brightness,
    colorR,
    colorG,
    colorB,
    paused,
  });

  useEffect(() => {
    paramsRef.current = {
      complex,
      speed,
      scale,
      seed,
      mouseInfluence,
      brightness,
      colorR,
      colorG,
      colorB,
      paused,
    };

    // Keep active WebGL uniforms directly in sync
    if (uniformsRef.current) {
      uniformsRef.current.u_complex.value = complex;
      uniformsRef.current.u_speed.value = speed;
      uniformsRef.current.u_scale.value = scale;
      uniformsRef.current.u_seed.value = seed;
      uniformsRef.current.u_mouse_influence.value = mouseInfluence;
      uniformsRef.current.u_brightness.value = brightness;
      uniformsRef.current.u_color_shift.value.set(colorR, colorG, colorB);
    }
  }, [complex, speed, scale, seed, mouseInfluence, brightness, colorR, colorG, colorB, paused]);

  const isVisibleRef = useRef(true);
  const isLoopingRef = useRef(false);
  const animateRef = useRef<(() => void) | undefined>(undefined);

  useEffect(() => {
    if (!observeVisibility) {
      isVisibleRef.current = true;
      return;
    }
    const el = containerRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        const visible = entry.isIntersecting;
        const wasVisible = isVisibleRef.current;
        isVisibleRef.current = visible;
        if (visible && !wasVisible && animateRef.current && !isLoopingRef.current) {
          animateRef.current();
        }
      },
      { threshold: 0 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [observeVisibility]);

  // Three.js Scene Setup and rendering Loop
  useEffect(() => {
    if (!canvasRef.current || !containerRef.current) return;

    if (!observeVisibility) {
      isVisibleRef.current = true;
    }
    const canvas = canvasRef.current;
    const container = containerRef.current;

    const camera = new THREE.Camera();
    camera.position.z = 1;

    const scene = new THREE.Scene();
    const geometry = new THREE.PlaneGeometry(2, 2);

    const uniforms = {
      u_time: { value: 2001.0 },
      u_resolution: { value: new THREE.Vector2() },
      u_mouse: { value: new THREE.Vector2() },
      u_complex: { value: paramsRef.current.complex },
      u_speed: { value: paramsRef.current.speed },
      u_scale: { value: paramsRef.current.scale },
      u_seed: { value: paramsRef.current.seed },
      u_mouse_influence: { value: paramsRef.current.mouseInfluence },
      u_brightness: { value: paramsRef.current.brightness },
      u_color_shift: {
        value: new THREE.Vector3(
          paramsRef.current.colorR,
          paramsRef.current.colorG,
          paramsRef.current.colorB
        ),
      },
    };
    uniformsRef.current = uniforms;

    const material = new THREE.ShaderMaterial({
      uniforms: uniforms,
      vertexShader: vertexShaderSource,
      fragmentShader: fragmentShaderSource,
    });

    const mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);

    const renderer = new THREE.WebGLRenderer({
      canvas: canvas,
      antialias: true,
      preserveDrawingBuffer: true,
    });

    const handleResize = () => {
      const width = container.clientWidth;
      const height = container.clientHeight;
      const pixelRatio = Math.min(window.devicePixelRatio, 2);
      renderer.setPixelRatio(pixelRatio);
      renderer.setSize(width, height, false);

      uniforms.u_resolution.value.x = renderer.domElement.width;
      uniforms.u_resolution.value.y = renderer.domElement.height;
    };

    handleResize();

    const handleMouseMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = rect.height - (e.clientY - rect.top);
      uniforms.u_mouse.value.x = x * Math.min(window.devicePixelRatio, 2);
      uniforms.u_mouse.value.y = y * Math.min(window.devicePixelRatio, 2);
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (e.touches.length === 0) return;
      const touch = e.touches[0];
      const rect = container.getBoundingClientRect();
      const x = touch.clientX - rect.left;
      const y = rect.height - (touch.clientY - rect.top);
      uniforms.u_mouse.value.x = x * Math.min(window.devicePixelRatio, 2);
      uniforms.u_mouse.value.y = y * Math.min(window.devicePixelRatio, 2);
    };

    container.addEventListener("mousemove", handleMouseMove);
    container.addEventListener("touchmove", handleTouchMove, { passive: true });
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("touchmove", handleTouchMove, { passive: true });

    let animationFrameId: number;

    const animate = () => {
      if (!isVisibleRef.current) {
        isLoopingRef.current = false;
        return;
      }
      isLoopingRef.current = true;
      animationFrameId = requestAnimationFrame(animate);

      // Rule #4: Dynamic viewport resizing checks inside rendering loop to prevent 0px collapses
      const width = container.clientWidth;
      const height = container.clientHeight;
      const dprFactor = Math.min(window.devicePixelRatio, 2);
      if (
        renderer.domElement.width !== Math.floor(width * dprFactor) ||
        renderer.domElement.height !== Math.floor(height * dprFactor)
      ) {
        handleResize();
      }

      if (!paramsRef.current.paused) {
        const screenWidth = uniforms.u_resolution.value.x || 1;
        const speedBoost = 1.0 + (uniforms.u_mouse.value.x / screenWidth) * 0.8;
        uniforms.u_time.value += 0.05 * speedBoost;
      }

      renderer.render(scene, camera);
    };

    animateRef.current = animate;
    animate();

    return () => {
      container.removeEventListener("mousemove", handleMouseMove);
      container.removeEventListener("touchmove", handleTouchMove);
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("touchmove", handleTouchMove);
      cancelAnimationFrame(animationFrameId);
      isLoopingRef.current = false;
      geometry.dispose();
      material.dispose();
      renderer.dispose();
    };
  }, []);

  const hasHeight = className.includes("h-") || className.includes("height-");
  const hasPosition =
    className.includes("fixed") ||
    className.includes("absolute") ||
    className.includes("relative") ||
    className.includes("sticky");

  return (
    <div
      ref={containerRef}
      className={`${hasPosition ? "" : "relative"} overflow-hidden w-full ${
        hasHeight ? "" : "h-full"
      } ${className}`}
    >
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full block" />

      <div className="absolute inset-0 z-10 flex flex-col items-center justify-center pointer-events-none">
        {children}
      </div>
    </div>
  );
};

export default FbmNoise;
