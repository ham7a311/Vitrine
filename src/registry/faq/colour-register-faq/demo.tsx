"use client";
import { ColourRegisterFaq } from "./ColourRegisterFaq";
const items=[
 {id:"purpose",question:"What makes a piece worth keeping?",answer:<p>A clear idea, useful behaviour, and the small details that make it feel considered. The collection favours character over quantity.</p>},
 {id:"ownership",question:"Can I make it my own?",answer:<p>Absolutely. Change the words, the colours, and the context. Each piece is a starting point, not a prescription.</p>},
 {id:"included",question:"What comes with each piece?",answer:<><p>The source, a working example, and the design brief that explains how it should look and behave.</p><p>Read the <a href="#collection-notes" onClick={event => event.preventDefault()}>collection notes</a> for the full story.</p></>},
 {id:"begin",question:"Where should I begin?",answer:<p>Choose one piece that solves a problem you have today. Keep it small, understand its states, and build from there.</p>},
 {id:"support",question:"Will it work on a small screen?",answer:<p>Every piece has an intentional narrow-screen layout and keyboard behaviour. Motion preferences are part of the design, not an afterthought.</p>}
];
export default function Demo(){return <div style={{minHeight:"100%",padding:"clamp(24px,5vw,64px)",background:"#f3f1e9",display:"grid",placeContent:"center"}}><div style={{width:"min(850px,100%)"}}><p style={{font:"10px 'Geist Mono',monospace",letterSpacing:".13em",color:"#52604f",margin:"0 0 18px"}}>A FEW GOOD QUESTIONS</p><h2 style={{font:"42px 'Instrument Serif',serif",color:"#28322c",margin:"0 0 36px"}}>Good to know.</h2><ColourRegisterFaq items={items} initiallyOpenId="included"/></div></div>;}
