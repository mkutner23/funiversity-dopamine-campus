import { useEffect, useMemo, useState } from "react";
import Battle from "./Battle";
import {
  ArrowRight, BookOpen, Bot, Brain, Clapperboard, Flag, Gamepad2,
  Globe2, GraduationCap, Heart, Lightbulb, Palette, Search, Sparkles, Trophy, Users, X, Zap
} from "lucide-react";

const leftSubjects = ["FILM", "COMEDY", "MUSIC", "SHAKESPEARE", "DESIGN", "STORYTELLING", "IMPROV"];
const rightSubjects = ["ROBOTICS", "PSYCHOLOGY", "FINANCE", "AI", "PHILOSOPHY", "ENTREPRENEURSHIP", "GAMING"];

function nextDifferent(items: string[], current: string) {
  const pool = items.filter((item) => item !== current);
  return pool[Math.floor(Math.random() * pool.length)];
}

function App() {
  const [battleOpen, setBattleOpen] = useState(() => window.location.pathname === "/shakespeare-battle" || window.location.hash === "#shakespeare-battle");
  const [major, setMajor] = useState<[string, string]>(["FILM", "ROBOTICS"]);
  const [spinning, setSpinning] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [overlay, setOverlay] = useState<"search"|"login"|"systems"|"portfolio"|null>(null);
  const [search, setSearch] = useState("");
  const combined = useMemo(() => `${major[0]} + ${major[1]}`, [major]);

  function spin() {
    if (spinning) return;
    setSpinning(true);
    let ticks = 0;
    const timer = window.setInterval(() => {
      setMajor([leftSubjects[Math.floor(Math.random()*leftSubjects.length)], rightSubjects[Math.floor(Math.random()*rightSubjects.length)]]);
      ticks += 1;
      if (ticks >= 11) {
        window.clearInterval(timer);
        setMajor(([a,b]) => [nextDifferent(leftSubjects,a), nextDifferent(rightSubjects,b)]);
        setSpinning(false);
      }
    }, 85);
  }

  useEffect(() => {
    const close = () => window.innerWidth > 760 && setMenuOpen(false);
    window.addEventListener("resize", close);
    return () => window.removeEventListener("resize", close);
  }, []);

  function openBattle() { window.history.pushState({}, "", "/shakespeare-battle"); setBattleOpen(true); window.scrollTo(0, 0); }
  function closeBattle() { window.history.pushState({}, "", "/"); setBattleOpen(false); window.scrollTo(0, 0); }
  useEffect(() => { const sync = () => setBattleOpen(window.location.pathname === "/shakespeare-battle" || window.location.hash === "#shakespeare-battle"); window.addEventListener("popstate", sync); return () => window.removeEventListener("popstate", sync); }, []);
  if (battleOpen) return <Battle onExit={closeBattle}/>;

  return (
    <div className="app-shell">
      <header className="topbar">
        <a className="brand" href="#top"><strong>FUNIVERSITY</strong><span>THE DOPAMINE CAMPUS</span></a>
        <button className="menu-button" onClick={() => setMenuOpen(!menuOpen)} aria-expanded={menuOpen} aria-controls="nav">MENU</button>
        <nav id="nav" className={menuOpen ? "open" : ""}>
          <a href="#programs">PROGRAMS</a><a href="#how">HOW IT WORKS</a><a href="#quests">QUESTS</a><a href="#about">ABOUT</a>
          <button className="icon-button" aria-label="Search" onClick={() => setOverlay("search")}><Search size={19}/></button>
          <button className="login" onClick={() => setOverlay("login")}>LOG IN</button><a className="apply" href="#apply">APPLY</a>
        </nav>
      </header>

      <main id="top">
        <section className="hero panel-frame">
          <div className="hero-copy">
            <p className="welcome">WELCOME, FUTURE LEGEND <ArrowRight size={16}/></p>
            <h1>FUNIVERSITY</h1>
            <h2>Level Up Your Brain</h2>
            <div className="hud-row">
              <div className="hud"><Brain/><span>XP MULTIPLIER:<strong>x2.5</strong></span></div>
              <div className="hud"><Trophy/><span>ACTIVE QUESTS:<strong>03</strong></span></div>
            </div>
            <h3>Education, but make it Playable.</h3>
            <p className="hero-description">Drop the boring lectures. Build your skill tree, fight exam bosses, and earn your degree through pure dopamine-driven learning. Insert coin to start your academic run.</p>
            <div className="hero-footer"><span>A BRIGHTER, SMARTER, MORE PLAYFUL YOU</span><span>EST. 2026</span></div>
          </div>

          <div className="mashup" aria-live="polite">
            <div className="machine-header"><h2>MAJOR MASHUP <small>v1.0</small></h2><span>SYS.CURRICULUM</span></div>
            <p>SPIN TWO DISCIPLINES. CREATE SOMETHING NEW.</p>
            <div className="reels">
              <SubjectReel label="SUBJECT A" value={major[0]} spinning={spinning}/>
              <span className="plus">+</span>
              <SubjectReel label="SUBJECT B" value={major[1]} spinning={spinning}/>
            </div>
            <div className="machine-controls">
              <span>PRESS<br/><b>+ START</b></span>
              <button onClick={spin} disabled={spinning}>{spinning ? "MIXING..." : "SPIN CURRICULUM"}</button>
              <span>MAKE WEIRDER<br/>THINGS TOGETHER</span>
            </div>
            <div className="major-result">CURRENT BUILD: <strong>{combined}</strong></div>
          </div>
        </section>

        <section id="about" className="value-strip panel-frame">
          <Value icon={<Gamepad2/>} title="PLAYFUL LEARNING" text="Serious skills. More fun."/>
          <Value icon={<Users/>} title="REAL-WORLD SKILLS" text="For a weirder, brighter tomorrow."/>
          <Value icon={<Zap/>} title="INTERDISCIPLINARY BY DESIGN" text="Two subjects. Infinite possibilities."/>
          <Value icon={<Heart/>} title="A HAPPIER YOU" text="Curiosity looks good on you."/>
        </section>

        <section id="programs" className="programs panel-frame">
          <div className="section-heading"><div><p>// PROGRAM SELECT</p><h2>CHOOSE YOUR FIRST RUN</h2><span>One playable sequence at a time. Quality before quantity.</span></div><span>FOUNDING COHORT&nbsp; / &nbsp;18+ ONLY</span></div>
          <div className="program-list">
            <article><span>01</span><div><h3>PERFORMANCE + STORY</h3><p>Start with Shakespeare Battle. Decode the text, rehearse the thought, record the performance.</p></div><button onClick={openBattle}>PLAY LEVEL 1 <ArrowRight/></button></article>
            <article><span>02</span><div><h3>CREATIVE TECHNOLOGY</h3><p>Combine storytelling, design, and AI into portfolio-ready experiments.</p></div><button onClick={() => setOverlay("portfolio")}>VIEW PATH <ArrowRight/></button></article>
            <article><span>03</span><div><h3>SYSTEMS + ENTREPRENEURSHIP</h3><p>Learn how products, communities, incentives, and money work together.</p></div><button onClick={() => setOverlay("systems")}>VIEW PATH <ArrowRight/></button></article>
          </div>
        </section>

        <section id="how" className="skill-tree panel-frame">
          <div className="section-copy"><p>// PROGRESS</p><h2>BUILD YOUR<br/>SKILL TREE</h2><p>Combine skills from different worlds. Unlock new abilities. Become unexpectedly unstoppable.</p><a href="#programs" className="yellow-button">EXPLORE PROGRAMS <ArrowRight/></a></div>
          <div className="tree" aria-label="Connected skill tree">
            <div className="tree-row"><Skill icon={<Clapperboard/>}/><Skill icon={<Sparkles/>}/><Skill icon={<Palette/>}/></div>
            <div className="tree-lines"></div>
            <div className="tree-row"><Skill icon={<BookOpen/>}/><Skill icon={<Lightbulb/>}/><Skill icon={<Bot/>}/></div>
            <div className="tree-lines lower"></div>
            <div className="tree-row"><Skill icon={<Globe2/>}/><Skill icon={<Users/>}/><Skill icon={<Zap/>}/></div>
          </div>
          <div className="potential"><p>// YOUR POTENTIAL</p><Meter name="CREATIVITY" value={87} pink/><Meter name="LOGIC" value={73}/><Meter name="COMMUNICATION" value={91} yellow/><Meter name="PROBLEM SOLVING" value={78}/><Meter name="IMPACT" value={85} pink/><small>DIFFERENT DISCIPLINES.<br/>A BRIGHTER YOU.</small></div>
        </section>

        <section id="quests" className="quests panel-frame">
          <div className="section-heading"><div><p>// ACTIVE QUESTS</p><h2>CURRENT QUESTS</h2><span>Real challenges. Real skills. Real rewards.</span></div><span>03 ACTIVE&nbsp; / &nbsp;12 COMPLETED</span></div>
          <div className="quest-grid">
            <Quest icon={<Sparkles/>} type="MAIN QUEST" title="SHAKESPEARE BATTLE: LEVEL 1" text="Understand the thought. Respect the verse. Perform Hamlet." reward="+250 XP" onClick={openBattle}/>
            <Quest icon={<Bot/>} type="CHALLENGE" title="EXAM BOSS: SYSTEMS THINKING" text="Solve real-world problems across disciplines." reward="+750 XP" blue onClick={() => setOverlay("systems")}/>
            <Quest icon={<Flag/>} type="SIDE QUEST" title="BUILD YOUR PORTFOLIO" text="Create something real. Show what you can do." reward="+300 XP" yellow onClick={() => setOverlay("portfolio")}/>
          </div>
        </section>

        <section id="credits" className="credits panel-frame">
          <div className="credits-copy"><p>// THE FOUNDING MODEL</p><h2>EARN YOUR PLACE</h2><p>FUNiversity is a free-to-play learning prototype for adults. Attendance alone earns nothing. Complete quests, demonstrate mastery, and build real work.</p><strong>NO TUITION. NO CHILD ENROLLMENT. NO EMPTY CREDENTIALS.</strong></div>
          <div className="credit-steps">
            <article><b>01</b><GraduationCap/><h3>PLAY</h3><p>Complete a guided lesson and submit the work.</p></article>
            <article><b>02</b><Trophy/><h3>EARN CREDITS</h3><p>Credits recognize demonstrated skills—not time spent watching lectures.</p></article>
            <article><b>03</b><Sparkles/><h3>UNLOCK FELLOWSHIP</h3><p>Exceptional work earns consideration for the founding fellowship cohort.</p></article>
          </div>
        </section>

        <section id="apply" className="checkpoint panel-frame">
          <div className="campus-art" aria-hidden="true">🏫</div>
          <div><p>// FOUNDING STUDENT 001</p><h2>START YOUR RUN</h2><span>Mike tests the complete experience first. Applications open only after the pilot meets the quality bar.</span><button onClick={openBattle}>PLAY LEVEL 1 <ArrowRight/></button></div>
          <div className="manifesto"><strong>LEARN</strong><strong>CREATE</strong><strong>COMBINE</strong><strong>BELONG</strong></div>
          <div className="planet" aria-hidden="true">🪐</div>
        </section>
      </main>

      {overlay && <div className="overlay" role="dialog" aria-modal="true" aria-label="FUNiversity information"><div className="overlay-card"><button className="overlay-close" onClick={() => setOverlay(null)} aria-label="Close"><X/></button>
        {overlay === "search" && <><p>// CAMPUS SEARCH</p><h2>FIND YOUR NEXT MOVE</h2><input autoFocus value={search} onChange={e=>setSearch(e.target.value)} placeholder="Try Shakespeare, credits, programs…"/><div className="search-results">{[["PROGRAMS","#programs"],["SHAKESPEARE BATTLE","#quests"],["CREDITS + FELLOWSHIPS","#credits"],["FOUNDING STUDENT","#apply"]].filter(([name])=>name.toLowerCase().includes(search.toLowerCase())).map(([name,href])=><a key={name} href={href} onClick={()=>setOverlay(null)}>{name}<ArrowRight/></a>)}</div></>}
        {overlay === "login" && <><p>// PILOT ACCESS</p><h2>LOGIN COMES AFTER LEVEL 1</h2><p>Founding Student 001 is testing the complete learning loop before accounts open. No fake signup form. No harvested emails. Quality first.</p><button onClick={()=>{setOverlay(null);openBattle()}}>PLAY THE PILOT <ArrowRight/></button></>}
        {overlay === "systems" && <><p>// LOCKED QUEST</p><h2>SYSTEMS THINKING</h2><p>This Exam Boss unlocks after Shakespeare Battle Level 1. Map a real system, identify its incentives, and redesign one weak link.</p><button onClick={()=>{setOverlay(null);openBattle()}}>START WITH LEVEL 1 <ArrowRight/></button></>}
        {overlay === "portfolio" && <><p>// SIDE QUEST</p><h2>BUILD YOUR PORTFOLIO</h2><p>Your first artifact is the performance itself: one interpreted Shakespeare passage, recorded and improved through rehearsal.</p><button onClick={()=>{setOverlay(null);openBattle()}}>CREATE ARTIFACT 001 <ArrowRight/></button></>}
      </div></div>}

      <footer><a className="brand" href="#top"><strong>FUNIVERSITY</strong><span>THE DOPAMINE CAMPUS</span></a><span>KNOWLEDGE PLAYS BETTER TOGETHER.</span></footer>
    </div>
  );
}

function SubjectReel({label,value,spinning}:{label:string;value:string;spinning:boolean}) {
  return <div className="reel"><span className="reel-label">{label}</span><div className={spinning ? "reel-window spinning" : "reel-window"}><small>▲</small><strong>{value}</strong><small>▼</small></div></div>;
}
function Value({icon,title,text}:{icon:React.ReactNode;title:string;text:string}) { return <article className="value">{icon}<div><h3>{title}</h3><p>{text}</p></div></article>; }
function Skill({icon}:{icon:React.ReactNode}) { return <span className="skill">{icon}</span>; }
function Meter({name,value,pink,yellow}:{name:string;value:number;pink?:boolean;yellow?:boolean}) { return <div className="meter"><span>{name}</span><div><i className={pink?"pink":yellow?"yellow":""} style={{width:`${value}%`}}></i></div><b>{value}</b></div>; }
function Quest({icon,type,title,text,reward,blue,yellow,onClick}:{icon:React.ReactNode;type:string;title:string;text:string;reward:string;blue?:boolean;yellow?:boolean;onClick?:()=>void}) { return <article className={onClick?"quest clickable":"quest"} onClick={onClick} role={onClick?"button":undefined} tabIndex={onClick?0:undefined} onKeyDown={e=>{if(onClick&&(e.key==="Enter"||e.key===" "))onClick()}}>{icon}<div><span className={blue?"tag blue":yellow?"tag yellow":"tag"}>{type}</span><h3>{title}</h3><p>{text}</p><strong>REWARD: {reward}</strong></div><ArrowRight className="quest-arrow"/></article>; }

export default App;
