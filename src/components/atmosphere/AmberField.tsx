'use client';

import React, { useRef, useEffect, useState } from 'react';

interface AmberFieldProps {
  intensity?: 'hero' | 'subtle' | 'empty';
  className?: string;
}

const VERTEX_SHADER = `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const FRAGMENT_SHADER = `
  precision highp float;

  varying vec2 vUv;
  uniform float uTime;
  uniform float uIntensity;
  uniform vec2 uResolution;

  // Perlin noise implementation
  vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
  vec4 mod289(vec4 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
  vec4 permute(vec4 x) { return mod289(((x*34.0)+1.0)*x); }
  vec4 taylorInvSqrt(vec4 r) { return 1.79284291400159 - 0.85373472095314 * r; }

  float snoise(vec3 v) {
    const vec2 C = vec2(1.0/6.0, 1.0/3.0);
    const vec4 D = vec4(0.0, 0.5, 1.0, 2.0);

    vec3 i  = floor(v + dot(v, C.yyy));
    vec3 x0 = v - i + dot(i, C.xxx);

    vec3 g = step(x0.yzx, x0.xyz);
    vec3 l = 1.0 - g;
    vec3 i1 = min(g.xyz, l.zxy);
    vec3 i2 = max(g.xyz, l.zxy);

    vec3 x1 = x0 - i1 + C.xxx;
    vec3 x2 = x0 - i2 + C.yyy;
    vec3 x3 = x0 - D.yyy;

    i = mod289(i);
    vec4 p = permute(permute(permute(
              i.z + vec4(0.0, i1.z, i2.z, 1.0))
            + i.y + vec4(0.0, i1.y, i2.y, 1.0))
            + i.x + vec4(0.0, i1.x, i2.x, 1.0));

    float n_ = 0.142857142857;
    vec3 ns = n_ * D.wyz - D.xzx;

    vec4 j = p - 49.0 * floor(p * ns.z * ns.z);

    vec4 x_ = floor(j * ns.z);
    vec4 y_ = floor(j - 7.0 * x_);

    vec4 x = x_ * ns.x + ns.yyyy;
    vec4 y = y_ * ns.x + ns.yyyy;
    vec4 h = 1.0 - abs(x) - abs(y);

    vec4 b0 = vec4(x.xy, y.xy);
    vec4 b1 = vec4(x.zw, y.zw);

    vec4 s0 = floor(b0) * 2.0 + 1.0;
    vec4 s1 = floor(b1) * 2.0 + 1.0;
    vec4 sh = -step(h, vec4(0.0));

    vec4 a0 = b0.xzyw + s0.xzyw * sh.xxyy;
    vec4 a1 = b1.xzyw + s1.xzyw * sh.zzww;

    vec3 p0 = vec3(a0.xy, h.x);
    vec3 p1 = vec3(a0.zw, h.y);
    vec3 p2 = vec3(a1.xy, h.z);
    vec3 p3 = vec3(a1.zw, h.w);

    vec4 norm = taylorInvSqrt(vec4(dot(p0,p0), dot(p1,p1), dot(p2,p2), dot(p3,p3)));
    p0 *= norm.x;
    p1 *= norm.y;
    p2 *= norm.z;
    p3 *= norm.w;

    vec4 m = max(0.6 - vec4(dot(x0,x0), dot(x1,x1), dot(x2,x2), dot(x3,x3)), 0.0);
    m = m * m;
    return 42.0 * dot(m*m, vec4(dot(p0,x0), dot(p1,x1), dot(p2,x2), dot(p3,x3)));
  }

  void main() {
    vec2 uv = vUv;
    vec2 center = vec2(0.5, 0.2);

    // Create flowing organic shapes
    float time = uTime * 0.15;

    // Layer 1: Large warm amber field
    float n1 = snoise(vec3(uv * 1.5 + time * 0.3, time * 0.1));
    float n2 = snoise(vec3(uv * 2.0 - time * 0.2, time * 0.15));
    float n3 = snoise(vec3(uv * 0.8 + time * 0.1, time * 0.05));

    // Radial falloff from center-top
    float dist = length(uv - center);
    float radial = smoothstep(1.2, 0.0, dist * 1.4);

    // Combine noise layers
    float field = (n1 * 0.5 + n2 * 0.3 + n3 * 0.2) * radial * uIntensity;

    // Warm amber color palette
    vec3 darkAmber = vec3(0.15, 0.08, 0.02);
    vec3 midAmber = vec3(0.35, 0.15, 0.03);
    vec3 brightAmber = vec3(0.96, 0.62, 0.04);

    vec3 color = mix(darkAmber, midAmber, field * 0.6);
    color = mix(color, brightAmber, pow(field, 3.0) * 0.4);

    // Subtle vignette
    float vignette = smoothstep(1.5, 0.5, length(uv - 0.5));
    color *= vignette;

    gl_FragColor = vec4(color, field * 0.35 * uIntensity);
  }
`;

export default function AmberField({ intensity = 'hero', className = '' }: AmberFieldProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [webglSupported, setWebglSupported] = useState(false);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  const intensityMap = { hero: 1.0, subtle: 0.45, empty: 0.3 };
  const currentIntensity = intensityMap[intensity];

  useEffect(() => {
    // Check prefers-reduced-motion
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mediaQuery.matches);

    const handleChange = (e: MediaQueryListEvent) => setPrefersReducedMotion(e.matches);
    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  useEffect(() => {
    if (prefersReducedMotion) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    // Check WebGL support
    const gl = canvas.getContext('webgl2', { alpha: true, premultipliedAlpha: true, antialias: true })
            || canvas.getContext('webgl', { alpha: true, premultipliedAlpha: true, antialias: true });

    if (!gl) {
      setWebglSupported(false);
      return;
    }

    setWebglSupported(true);

    // Create shaders
    const createShader = (type: number, source: string) => {
      const shader = gl.createShader(type)!;
      gl.shaderSource(shader, source);
      gl.compileShader(shader);
      if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        console.error('Shader compile error:', gl.getShaderInfoLog(shader));
        gl.deleteShader(shader);
        return null;
      }
      return shader;
    };

    const vertexShader = createShader(gl.VERTEX_SHADER, VERTEX_SHADER);
    const fragmentShader = createShader(gl.FRAGMENT_SHADER, FRAGMENT_SHADER);

    if (!vertexShader || !fragmentShader) return;

    const program = gl.createProgram()!;
    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);
    gl.linkProgram(program);

    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      console.error('Program link error:', gl.getProgramInfoLog(program));
      return;
    }

    // Geometry: full-screen quad
    const positions = new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]);
    const positionBuffer = gl.createBuffer()!;
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, positions, gl.STATIC_DRAW);

    const positionLoc = gl.getAttribLocation(program, 'position');
    const timeLoc = gl.getUniformLocation(program, 'uTime');
    const intensityLoc = gl.getUniformLocation(program, 'uIntensity');
    const resolutionLoc = gl.getUniformLocation(program, 'uResolution');

    // Resize handler
    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio, 1.5);
      const width = canvas.clientWidth * dpr;
      const height = canvas.clientHeight * dpr;
      if (canvas.width !== width || canvas.height !== height) {
        canvas.width = width;
        canvas.height = height;
        gl.viewport(0, 0, width, height);
      }
    };

    let animationId: number;
    let lastTime = 0;
    let frameCount = 0;
    const targetFps = 30;
    const frameInterval = 1000 / targetFps;

    const render = (time: number) => {
      if (time - lastTime < frameInterval) {
        animationId = requestAnimationFrame(render);
        return;
      }
      lastTime = time;

      resize();

      gl.useProgram(program);
      gl.enable(gl.BLEND);
      gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);

      gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
      gl.enableVertexAttribArray(positionLoc);
      gl.vertexAttribPointer(positionLoc, 2, gl.FLOAT, false, 0, 0);

      gl.uniform1f(timeLoc, time * 0.001);
      gl.uniform1f(intensityLoc, currentIntensity);
      gl.uniform2f(resolutionLoc, canvas.width, canvas.height);

      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);

      animationId = requestAnimationFrame(render);
    };

    // IntersectionObserver for visibility optimization
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting && entry.intersectionRatio > 0.1) {
            animationId = requestAnimationFrame(render);
          } else {
            cancelAnimationFrame(animationId);
          }
        });
      },
      { threshold: [0, 0.1, 0.5] }
    );

    observer.observe(canvas);

    // Visibility change handler
    const handleVisibilityChange = () => {
      if (document.hidden) {
        cancelAnimationFrame(animationId);
      } else {
        animationId = requestAnimationFrame(render);
      }
    };
    document.addEventListener('visibilitychange', handleVisibilityChange);

    animationId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animationId);
      observer.disconnect();
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      gl.deleteProgram(program);
      gl.deleteShader(vertexShader);
      gl.deleteShader(fragmentShader);
      gl.deleteBuffer(positionBuffer);
    };
  }, [currentIntensity, prefersReducedMotion]);

  if (prefersReducedMotion) {
    return null; // CSS fallback in globals.css handles this
  }

  return (
    <canvas
      ref={canvasRef}
      className={`fixed inset-0 w-full h-full pointer-events-none aria-hidden ${className}`}
      aria-hidden="true"
      style={{ display: webglSupported ? 'block' : 'none' }}
    />
  );
}