"use client";
import { useEffect, useRef, type CSSProperties } from "react";

type Props = { colors?: [string, string, string, string]; className?: string };

const VS = "attribute vec2 p;void main(){gl_Position=vec4(p,0.,1.);}";
const FS = `precision highp float;
uniform vec2 res; uniform float t; uniform vec4 pts[16]; uniform vec3 c0,c1,c2,c3;
float h(vec2 p){return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453);}
float n(vec2 p){vec2 i=floor(p),f=fract(p);f=f*f*(3.-2.*f);
 return mix(mix(h(i),h(i+vec2(1,0)),f.x),mix(h(i+vec2(0,1)),h(i+vec2(1,1)),f.x),f.y);}
float fbm(vec2 p){float v=0.,a=.5;for(int i=0;i<4;i++){v+=a*n(p);p=p*2.03+vec2(11.7,3.1);a*=.5;}return v;}
void main(){
 vec2 uv=gl_FragCoord.xy/res.y; vec2 p=uv*2.4;
 for(int i=0;i<16;i++){ vec2 d=uv-pts[i].xy; float r2=dot(d,d); p-=pts[i].zw*exp(-r2*22.)*6.; }
 vec2 q=vec2(fbm(p+t*.03),fbm(p+vec2(5.2,1.3)-t*.025));
 vec2 r=vec2(fbm(p+3.2*q+vec2(1.7,9.2)+t*.02),fbm(p+3.2*q+vec2(8.3,2.8)));
 float f=fbm(p+3.4*r);
 float band=sin(f*22.+r.x*7.);
 float veins=smoothstep(.55,1.,abs(band));
 vec3 col=mix(c0,c1,smoothstep(.2,.8,f));
 col=mix(col,c2,smoothstep(.45,.85,r.x)*.85);
 col=mix(col,c3,veins*.85);
 col*=.82+.3*fbm(uv*90.); // paper tooth
 gl_FragColor=vec4(col,1.);
}`;

const hex = (s: string) => [1, 3, 5].map((i) => parseInt(s.slice(i, i + 2), 16) / 255);

export function MarbledInk({ colors = ["#0f2a3a", "#e8dcc0", "#b3392b", "#f5efe0"], className = "" }: Props) {
  const wrap = useRef<HTMLDivElement>(null);
  const cv = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = cv.current!, box = wrap.current!;
    const gl = canvas.getContext("webgl", { antialias: false, alpha: false });
    if (!gl) return;
    const sh = (type: number, src: string) => { const s = gl.createShader(type)!; gl.shaderSource(s, src); gl.compileShader(s); return s; };
    const prog = gl.createProgram()!;
    gl.attachShader(prog, sh(gl.VERTEX_SHADER, VS)); gl.attachShader(prog, sh(gl.FRAGMENT_SHADER, FS)); gl.linkProgram(prog); gl.useProgram(prog);
    const buf = gl.createBuffer(); gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
    const loc = gl.getAttribLocation(prog, "p"); gl.enableVertexAttribArray(loc); gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);
    const U = (n: string) => gl.getUniformLocation(prog, n);
    ["c0", "c1", "c2", "c3"].forEach((k, i) => gl.uniform3fv(U(k), hex(colors[i])));

    const pts = new Float32Array(64); let head = 0;
    let w = 1, h = 1, raf = 0, visible = true, last: [number, number] | null = null;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2) * 0.6;
      w = Math.max(2, Math.floor(box.clientWidth * dpr)); h = Math.max(2, Math.floor(box.clientHeight * dpr));
      canvas.width = w; canvas.height = h; gl.viewport(0, 0, w, h);
    };
    const move = (e: PointerEvent) => {
      const r = box.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.height, y = 1 - (e.clientY - r.top) / r.height;
      if (last) {
        const dx = x - last[0], dy = y - last[1];
        pts.set([x, y, dx * 3, dy * 3], head * 4); head = (head + 1) % 16;
      }
      last = [x, y];
    };
    const leave = () => { last = null; };
    const draw = (now: number) => {
      raf = requestAnimationFrame(draw);
      if (!visible) return;
      for (let i = 0; i < 16; i++) { pts[i * 4 + 2] *= 0.985; pts[i * 4 + 3] *= 0.985; }
      gl.uniform2f(U("res"), w, h); gl.uniform1f(U("t"), reduce ? 0 : now / 1000); gl.uniform4fv(U("pts"), pts);
      gl.drawArrays(gl.TRIANGLES, 0, 3);
    };
    resize();
    const ro = new ResizeObserver(resize); ro.observe(box);
    const io = new IntersectionObserver(([e]) => (visible = e.isIntersecting)); io.observe(box);
    box.addEventListener("pointermove", move); box.addEventListener("pointerleave", leave);
    raf = requestAnimationFrame(draw);
    return () => { cancelAnimationFrame(raf); ro.disconnect(); io.disconnect(); box.removeEventListener("pointermove", move); box.removeEventListener("pointerleave", leave); };
  }, [colors]);

  const style: CSSProperties = { position: "relative", width: "100%", height: "100%", minHeight: 240, background: colors[0], touchAction: "none" };
  return (
    <div ref={wrap} className={className} style={style}>
      <canvas ref={cv} style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }} aria-hidden="true" />
    </div>
  );
}
