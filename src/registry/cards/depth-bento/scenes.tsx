import type { CSSProperties, ReactNode } from "react";
import { Layer } from "./DepthBento";

const at = (left: string, top: string, width: string, height?: string): CSSProperties => ({ position: "absolute", left, top, width, height });
const Lines = ({ n = 2, w = ["70%", "45%"] }: { n?: number; w?: string[] }) => <span style={{ display: "grid", gap: 7, flex: 1 }}>{Array.from({ length: n }, (_, i) => <span key={i} className="dline" style={{ width: w[i] ?? "60%" }} />)}</span>;
const Card = ({ style, children }: { style: CSSProperties; children: ReactNode }) => <div className="dpane" style={{ ...style, display: "flex", alignItems: "center", gap: 12, padding: "14px 16px" }}>{children}</div>;

/** A stack of messages with a reply waiting on top. */
export const Inbox = () => (
  <>
    <Layer z={0}><Card style={at("16%", "10%", "68%", "26%")}><span className="ddot" style={{ width: 30, height: 30, opacity: 0.45 }} /><Lines /></Card></Layer>
    <Layer z={1}><Card style={at("10%", "32%", "74%", "28%")}><span className="ddot" style={{ width: 34, height: 34, opacity: 0.7 }} /><Lines w={["80%", "55%"]} /></Card></Layer>
    <Layer z={2}><Card style={at("4%", "56%", "80%", "30%")}><span className="ddot" style={{ width: 38, height: 38 }} /><Lines w={["74%", "40%"]} /><span className="ddot" style={{ width: 10, height: 10, background: "#7df0c4" }} /></Card></Layer>
    <Layer z={3.4}><div style={at("62%", "48%", "auto")}><span className="dpill">↩ Reply in 2m</span></div></Layer>
  </>
);

/** A phone with two notifications floating off its screen. */
export const Phone = () => (
  <>
    <Layer z={0}><div className="dpane" style={{ ...at("22%", "4%", "56%", "90%"), borderRadius: 30 }} /></Layer>
    <Layer z={0.8}><div style={{ ...at("29%", "14%", "42%", "62%"), display: "grid", alignContent: "start", gap: 10 }}>{["90%", "60%", "75%", "50%", "68%"].map((w, i) => <span key={i} className="dline" style={{ width: w }} />)}</div></Layer>
    <Layer z={2.2}><Card style={{ ...at("8%", "30%", "70%"), padding: "10px 12px" }}><span className="ddot" style={{ width: 22, height: 22 }} /><Lines w={["90%", "55%"]} /></Card></Layer>
    <Layer z={3.4}><Card style={{ ...at("26%", "52%", "70%"), padding: "10px 12px" }}><span className="ddot" style={{ width: 22, height: 22, background: "#ffd27a" }} /><Lines w={["80%", "48%"]} /></Card></Layer>
  </>
);

const NODES: [number, number][] = [[10, 62], [28, 24], [46, 70], [62, 30], [80, 64], [92, 22]];
/** A small graph with one route lit. */
export const Graph = () => (
  <>
    <Layer z={0}>
      <svg viewBox="0 0 100 100" preserveAspectRatio="none" style={at("0", "0", "100%", "100%")}>
        {NODES.slice(1).map(([x, y], i) => <line key={i} x1={NODES[i][0]} y1={NODES[i][1]} x2={x} y2={y} stroke="currentColor" strokeOpacity=".35" strokeWidth=".5" vectorEffect="non-scaling-stroke" />)}
        <line x1="28" y1="24" x2="62" y2="30" stroke="currentColor" strokeOpacity=".2" strokeDasharray="2 2" vectorEffect="non-scaling-stroke" />
      </svg>
    </Layer>
    <Layer z={1}>{NODES.map(([x, y], i) => <span key={i} className="dpane" style={{ ...at(`${x}%`, `${y}%`, "26px", "26px"), borderRadius: 9, transform: "translate(-50%, -50%)" }} />)}</Layer>
    <Layer z={2.6}><span className="ddot" style={{ ...at("62%", "30%", "18px", "18px"), transform: "translate(-50%, -50%)", boxShadow: "0 0 0 8px rgb(255 255 255 / .18), 0 0 0 16px rgb(255 255 255 / .08)" }} /></Layer>
    <Layer z={3.4}><div style={at("66%", "40%", "auto")}><span className="dpill">eu-west · 12ms</span></div></Layer>
  </>
);

/** A week with events lifting off it. */
export const Week = () => (
  <>
    <Layer z={0}><div className="dpane" style={{ ...at("8%", "6%", "84%", "88%"), display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gridTemplateRows: "repeat(4, 1fr)", gap: 1, padding: 10 }}>{Array.from({ length: 20 }, (_, i) => <span key={i} style={{ borderRadius: 4, background: "var(--db-pane)" }} />)}</div></Layer>
    <Layer z={1.8}><span className="dpill" style={at("16%", "26%", "auto")}>Standup</span></Layer>
    <Layer z={3}><span className="dpill" style={{ ...at("44%", "58%", "auto"), background: "#ffd27a", color: "#1d1407" }}>Launch ✦</span></Layer>
  </>
);

/** Three frames pulled apart like layers in a design file. */
export const Frames = () => (
  <>
    {[0, 1, 2].map((i) => (
      <Layer key={i} z={i * 1.4}>
        <div className="dpane" style={{ ...at(`${18 + i * 10}%`, `${12 + i * 12}%`, "52%", "54%"), opacity: 0.55 + i * 0.22, display: "grid", placeItems: "center" }}>
          {i === 2 && <span className="ddot" style={{ width: 28, height: 28 }} />}
        </div>
      </Layer>
    ))}
  </>
);

/** A laptop and a phone with a sync arc between them. */
export const Sync = () => (
  <>
    <Layer z={0}><div className="dpane" style={{ ...at("8%", "16%", "46%", "64%"), display: "grid", alignContent: "start", gap: 8, padding: 14 }}>{["70%", "50%", "62%"].map((w, i) => <span key={i} className="dline" style={{ width: w }} />)}</div></Layer>
    <Layer z={0}><div className="dpane" style={{ ...at("4%", "80%", "54%", "6%"), borderRadius: 6 }} /></Layer>
    <Layer z={1.6}><div className="dpane" style={{ ...at("68%", "10%", "20%", "80%"), borderRadius: 18, display: "grid", alignContent: "start", gap: 7, padding: "14px 10px" }}>{["80%", "55%"].map((w, i) => <span key={i} className="dline" style={{ width: w }} />)}</div></Layer>
    <Layer z={3}>
      <svg viewBox="0 0 100 100" preserveAspectRatio="none" style={at("0", "0", "100%", "100%")}>
        <path d="M44 30C52 12 64 14 70 30" fill="none" stroke="currentColor" strokeWidth="1.4" strokeDasharray="3 3" vectorEffect="non-scaling-stroke" />
      </svg>
      <span className="dpill" style={at("46%", "6%", "auto")}>Synced</span>
    </Layer>
  </>
);
