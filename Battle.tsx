import { useEffect, useRef, useState } from "react";
import { ArrowLeft, BookOpen, Brain, Check, Lock, Mic, Play, RotateCcw, Square, Volume2 } from "lucide-react";
import "./battle.css";

const VERSE = ["O, that this too too solid flesh would melt,", "Thaw and resolve itself into a dew!"];
const STEPS = ["READ", "DECODE", "REHEARSE", "PERFORM"];

export default function Battle({ onExit }: { onExit: () => void }) {
  const [step, setStep] = useState(0), [xp, setXp] = useState(0);
  const [answer, setAnswer] = useState(""), [checked, setChecked] = useState(false);
  const [beats, setBeats] = useState([false, false, false]);
  const [recording, setRecording] = useState(false), [url, setUrl] = useState<string | null>(null);
  const [error, setError] = useState(""), [complete, setComplete] = useState(false);
  const recorder = useRef<MediaRecorder | null>(null), chunks = useRef<Blob[]>([]);

  useEffect(() => () => { recorder.current?.stream.getTracks().forEach(t => t.stop()); }, []);
  const hear = () => { if ("speechSynthesis" in window) { speechSynthesis.cancel(); const u = new SpeechSynthesisUtterance(VERSE.join(" ")); u.rate=.82; u.pitch=.88; speechSynthesis.speak(u); } };
  const advance = (to:number) => { setStep(to); setXp(to*50); };
  async function startRecording() {
    setError("");
    if (!navigator.mediaDevices?.getUserMedia || typeof MediaRecorder === "undefined") return setError("Audio recording is unavailable in this browser. Try current Chrome or Edge.");
    try {
      const stream=await navigator.mediaDevices.getUserMedia({audio:true}); chunks.current=[];
      const r=new MediaRecorder(stream); recorder.current=r;
      r.ondataavailable=e=>{if(e.data.size) chunks.current.push(e.data)};
      r.onstop=()=>{const blob=new Blob(chunks.current,{type:r.mimeType||"audio/webm"}); setUrl(old=>{if(old)URL.revokeObjectURL(old);return URL.createObjectURL(blob)});stream.getTracks().forEach(t=>t.stop())};
      r.start(); setRecording(true);
    } catch { setError("Microphone access was blocked. Allow it in the browser, then try again."); }
  }
  const stopRecording=()=>{recorder.current?.stop();setRecording(false)};
  const correct=answer==="escape";

  return <div className="battle-shell">
    <header className="battle-topbar"><button className="battle-brand" onClick={onExit}>FUNIVERSITY</button><button className="exit-battle" onClick={onExit}><ArrowLeft/> EXIT BATTLE</button><div className="battle-stat"><span>LEVEL</span><strong>01</strong></div><div className="battle-stat"><span>XP</span><strong>{xp}</strong></div></header>
    <main className="battle-main">
      <div className="battle-title"><h1>SHAKESPEARE BATTLE</h1><p>RESPECT THE VERSE</p></div>
      <section className="verse-chamber"><div className="chamber-light"/><blockquote>{VERSE.map(v=><span key={v}>{v}</span>)}</blockquote><div className="stage-disc"/></section>
      <ol className="step-rail">{STEPS.map((s,i)=><li key={s} className={i===step?"active":i<step?"done":""}><span>{i<step?<Check/>:i+1}</span><b>{s}</b></li>)}</ol>
      <section className="battle-console"><div className="lesson-panel">
        {step===0&&<><h2>STEP 1: READ</h2><p>Read it once. Don’t act it yet. Let the words land.</p><div className="battle-actions"><button className="secondary-action" onClick={hear}><Volume2/> HEAR THE TEXT</button><button className="primary-action" onClick={()=>advance(1)}><BookOpen/> I’VE READ IT</button></div></>}
        {step===1&&<><h2>STEP 2: DECODE</h2><p>What does Hamlet want in this moment?</p><div className="meaning-options"><button className={answer==="escape"?"selected":""} onClick={()=>setAnswer("escape")}>He wants his painful physical life to dissolve.</button><button className={answer==="revenge"?"selected":""} onClick={()=>setAnswer("revenge")}>He is announcing his plan to take revenge.</button><button className={answer==="weather"?"selected":""} onClick={()=>setAnswer("weather")}>He is describing the cold weather in Denmark.</button></div>{checked&&<p className={correct?"feedback good":"feedback"}>{correct?"Exactly. The thought moves solid → melt → thaw → dew. He wants escape, not action.":"Not yet. Follow the transformation: solid → melt → thaw → dew."}</p>}<button className="primary-action solo" disabled={!answer} onClick={()=>correct&&checked?advance(2):setChecked(true)}>{correct&&checked?"ENTER REHEARSAL":"CHECK MY READ"}</button></>}
        {step===2&&<><h2>STEP 3: REHEARSE</h2><p>Build the thought before you perform it. Tap each coaching beat.</p><div className="coach-beats">{["Stress the transformation words: solid, melt, thaw, dew.","Let “O” escape before the sentence—it is the pressure valve.","Drive toward “dew.” That final image completes the thought."].map((t,i)=><button key={t} className={beats[i]?"checked":""} onClick={()=>setBeats(old=>old.map((v,n)=>n===i?!v:v))}><span>{beats[i]?<Check/>:i+1}</span>{t}</button>)}</div><div className="battle-actions"><button className="secondary-action" onClick={hear}><Volume2/> HEAR IT AGAIN</button><button className="primary-action" disabled={!beats.every(Boolean)} onClick={()=>advance(3)}><Mic/> ENTER THE STAGE</button></div></>}
        {step===3&&!complete&&<><h2>STEP 4: PERFORM</h2><p>One breath. One thought. No imitation—make Hamlet yours.</p><div className={recording?"record-pod active":"record-pod"}><Mic/><strong>{recording?"RECORDING…":url?"TAKE CAPTURED":"MIC READY"}</strong><span>{recording?"Let the whole thought land.":"Your recording stays on this device."}</span></div>{error&&<p className="feedback">{error}</p>}<div className="battle-actions">{!recording&&<button className="primary-action" onClick={startRecording}><Mic/> {url?"RECORD AGAIN":"RECORD TAKE"}</button>}{recording&&<button className="stop-action" onClick={stopRecording}><Square/> STOP</button>}{url&&<audio className="take-player" src={url} controls/>}{url&&<button className="secondary-action" onClick={()=>{setXp(250);setComplete(true)}}><Play/> COMPLETE BATTLE</button>}</div></>}
        {complete&&<div className="victory"><span className="victory-mark">250</span><div><h2>VERSE RESPECTED</h2><p>You understood the thought, rehearsed the language, and committed to a complete take.</p></div><button className="primary-action" onClick={()=>{setStep(0);setXp(0);setComplete(false);setAnswer("");setChecked(false);setBeats([false,false,false]);setUrl(null)}}><RotateCcw/> PLAY AGAIN</button></div>}
      </div><aside className="mission-panel"><h3><Brain/> MISSION</h3><dl><dt>OBJECTIVE</dt><dd>Understand the thought before performing it.</dd><dt>REWARD</dt><dd>+250 XP</dd></dl><div className={step===3?"mic-lock unlocked":"mic-lock"}>{step===3?<Mic/>:<Lock/>}<span><strong>PERFORM</strong>{step===3?"Microphone unlocked.":"Microphone unlocks at Step 4."}</span></div></aside></section>
    </main>
  </div>;
}
