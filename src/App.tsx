import { useEffect, useMemo, useState } from "react";
import Battle from "./Battle";
import {
  ArrowRight, BookOpen, Bot, Brain, Clapperboard, Flag, Gamepad2,
  Globe2, Heart, Lightbulb, Palette, Search, Sparkles, Trophy, Users, Zap
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
          <button className="icon-button" aria-label="Search"><Search size={19}/></button>
          <a className="login" href="#join">LOG IN</a><a className="apply" href="#join">APPLY</a>
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
            <Quest icon={<Bot/>} type="CHALLENGE" title="EXAM BOSS: SYSTEMS THINKING" text="Solve real-world problems across disciplines." reward="+750 XP" blue/>
            <Quest icon={<Flag/>} type="SIDE QUEST" title="BUILD YOUR PORTFOLIO" text="Create something real. Show what you can do." reward="+300 XP" yellow/>
          </div>
        </section>

        <section id="join" className="checkpoint panel-frame">
          <div className="campus-art" aria-hidden="true">🏫</div>
          <div><p>// FINAL CHECKPOINT</p><h2>START YOUR RUN</h2><span>Same curiosity. A more exciting future.</span><button onClick={() => document.getElementById("top")?.scrollIntoView({behavior:"smooth"})}>INSERT COIN <ArrowRight/></button></div>
          <div className="manifesto"><strong>LEARN</strong><strong>CREATE</strong><strong>COMBINE</strong><strong>BELONG</strong></div>
          <div className="planet" aria-hidden="true">🪐</div>
        </section>
      </main>

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
