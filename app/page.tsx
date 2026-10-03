"use client";

import Image from "next/image";
import { useRef, useState, type FormEvent, type MouseEvent } from "react";
import { ArrowRight, Check, Code2, ExternalLink, Music2, Pause, Play, Volume2, X } from "lucide-react";

const bars = [28,46,73,51,89,64,37,78,96,62,45,83,58,91,39,69,52,86,44,76,33,64,48,80];
const catalogBeats = [
  { title: "Make Believe", bpm: "180 BPM", src: "/beats/make-believe.mp3", licenseUrl: "https://traktrain.com/t/1660221", wave: [72,81,92,47,40,54,57,32,38,78,62,42,33,72,31,75,32,70,81,98,31,29,55,23] },
  { title: "Rocky Start", bpm: "158 BPM", src: "/beats/rocky-start.mp3", licenseUrl: "https://traktrain.com/t/1660174", wave: [89,98,92,68,73,94,90,86,69,64,98,74,81,50,86,84,80,83,43,44,86,90,93,40] },
  { title: "Would U Keep Me", bpm: "125 BPM", src: "/beats/would-u-keep-me.mp3", licenseUrl: "https://traktrain.com/t/1660224", wave: [26,78,93,82,38,23,82,88,98,90,43,86,90,72,68,92,48,26,79,83,91,74,58,80] },
  { title: "Betta Be Ready", bpm: "160 BPM", src: "/beats/betta-be-ready.mp3", licenseUrl: "https://traktrain.com/t/1660228", wave: [88,78,87,93,85,83,73,50,83,88,84,60,82,78,90,93,52,78,83,98,87,71,87,87] },
];
const journeyChapters = [
  { year: "2022", label: "The unseen hours", title: "Learning in the dark.", body: "Long sessions, small rooms and the repetition that built the instincts. These clips are pieces of the foundation." },
  { year: "2024", label: "The first placement", title: "A record left the room.", body: "Production on Eric Bellinger’s “Tunnel Vision” turned private work into an industry credit—and made the next level feel real." },
  { year: "2026", label: "Building beyond beats", title: "Music became technology.", body: "Graduate computer science, original records and HELMShape now meet in one vision: build the sounds and the tools behind them." },
];

function StudioFilm({ src, poster, number, title, note }: { src: string; poster: string; number: string; title: string; note: string }) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [open, setOpen] = useState(false);

  function preview() {
    if (open || !videoRef.current) return;
    videoRef.current.muted = true;
    void videoRef.current.play();
  }

  function stopPreview() {
    if (open || !videoRef.current) return;
    videoRef.current.pause();
    videoRef.current.currentTime = 0;
  }

  function openFilm() {
    if (!videoRef.current) return;
    setOpen(true);
    videoRef.current.muted = false;
    void videoRef.current.play();
  }

  function closeFilm(event: MouseEvent<HTMLButtonElement>) {
    event.stopPropagation();
    if (videoRef.current) {
      videoRef.current.pause();
      videoRef.current.muted = true;
      videoRef.current.currentTime = 0;
    }
    setOpen(false);
  }

  return (
    <article className={`film-card ${open ? "open" : ""}`} onMouseEnter={preview} onMouseLeave={stopPreview}>
      <video ref={videoRef} src={src} poster={poster} playsInline loop={!open} controls={open} preload="metadata" />
      <div className="film-shade" />
      <div className="film-number">{number}</div>
      <div className="film-copy"><small>{note}</small><h3>{title}</h3></div>
      {!open && <button className="film-play" type="button" onClick={openFilm}><Play size={17} fill="currentColor"/> Play with sound</button>}
      {open && <button className="film-close" type="button" onClick={closeFilm} aria-label="Close video"><X size={19}/></button>}
      {!open && <div className="film-audio"><Volume2 size={14}/> Hover to preview</div>}
    </article>
  );
}

function CatalogPlayer() {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [active, setActive] = useState<number | null>(null);
  const [progress, setProgress] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

  function toggleBeat(index: number) {
    const audio = audioRef.current;
    if (!audio) return;
    if (active === index && !audio.paused) {
      audio.pause();
      setIsPlaying(false);
      return;
    }
    if (active !== index) {
      audio.src = catalogBeats[index].src;
      setActive(index);
      setProgress(0);
    }
    void audio.play();
    setIsPlaying(true);
  }

  function seek(index: number, event: MouseEvent<HTMLButtonElement>) {
    const audio = audioRef.current;
    if (!audio) return;
    if (active !== index) audio.src = catalogBeats[index].src;
    const rect = event.currentTarget.getBoundingClientRect();
    const next = Math.max(0, Math.min(1, (event.clientX - rect.left) / rect.width));
    audio.currentTime = next * 15;
    setActive(index);
    setProgress(next);
    void audio.play();
    setIsPlaying(true);
  }

  return (
    <div className="catalog-player">
      <audio ref={audioRef} preload="none" onTimeUpdate={event=>setProgress(event.currentTarget.currentTime / 15)} onEnded={()=>{setActive(null);setProgress(0);setIsPlaying(false)}} />
      <div className="catalog-head"><span>04 ORIGINAL BEATS</span><span>15-SECOND PREVIEWS</span></div>
      {catalogBeats.map((beat,index)=>(
        <article className={`beat-row ${active===index?"active":""}`} key={beat.title}>
          <span className="beat-number">{String(index+1).padStart(2,"0")}</span>
          <button className="beat-toggle" type="button" onClick={()=>toggleBeat(index)} aria-label={`${active===index&&isPlaying?"Pause":"Play"} ${beat.title}`}>
            {active===index&&isPlaying?<Pause size={17} fill="currentColor"/>:<Play size={17} fill="currentColor"/>}
          </button>
          <div className="beat-info"><strong>{beat.title}</strong><span>Prod. by JE · {beat.bpm}</span></div>
          <button className="beat-wave" type="button" onClick={event=>seek(index,event)} aria-label={`Seek through ${beat.title} preview`}>
            {beat.wave.map((height,barIndex)=><i key={barIndex} className={active===index&&barIndex/beat.wave.length<=progress?"passed":""} style={{height:`${height}%`}}/>)}
          </button>
          <span className="beat-time">0:{active===index?String(Math.max(0,15-Math.floor(progress*15))).padStart(2,"0"):"15"}</span>
          <a className="beat-license" href={beat.licenseUrl} target="_blank" rel="noreferrer">License <ExternalLink size={12}/></a>
        </article>
      ))}
      <div className="catalog-foot"><span>SOULFUL · CINEMATIC · HARD-HITTING</span><a href="https://traktrain.com/jdemery110" target="_blank" rel="noreferrer">View store on Traktrain <ArrowRight size={14}/></a></div>
    </div>
  );
}
export default function Home() {
  const [journeyChapter, setJourneyChapter] = useState(0);
  const [email, setEmail] = useState("");
  const [consent, setConsent] = useState(false);
  const [signupState, setSignupState] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [signupMessage, setSignupMessage] = useState("");

  function trackPointer(event: MouseEvent<HTMLElement>) {
    const rect = event.currentTarget.getBoundingClientRect();
    event.currentTarget.style.setProperty("--mx", `${event.clientX - rect.left}px`);
    event.currentTarget.style.setProperty("--my", `${event.clientY - rect.top}px`);
  }

  async function joinWaitlist(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSignupState("loading");
    setSignupMessage("");
    const data = new FormData(event.currentTarget);

    try {
      const response = await fetch("/api/helmshape-waitlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, consent, company: data.get("company") }),
      });
      const result = (await response.json()) as { error?: string };
      if (!response.ok) throw new Error(result.error ?? "Unable to join right now.");
      setSignupState("success");
      setSignupMessage("You’re on the list. I’ll let you know when HELMShape is ready.");
      setEmail("");
      setConsent(false);
    } catch (error) {
      setSignupState("error");
      setSignupMessage(error instanceof Error ? error.message : "Unable to join right now.");
    }
  }

  return (
    <main>
      <header className="nav">
        <a className="logo" href="#top"><b>JE</b><small>JEREMIAH EMERY</small></a>
        <nav><a href="#beats">Beats</a><a href="#process">Process</a><a href="#plugin">Plugin</a><a href="#story">Story</a></nav>
        <a className="pill nav-shop" href="https://traktrain.com/jdemery110" target="_blank" rel="noreferrer">Shop Beats <ExternalLink size={14}/></a>
      </header>

      <section className="hero" id="top" onMouseMove={trackPointer}>
        <div className="hero-glow" />
        <div className="hero-copy">
          <p className="hero-kicker">Producer · Software Engineer · New Orleans</p>
          <h1>JEREMIAH EMERY</h1>
          <div className="hero-identity">
            <span><b>JE</b> Prod. by JE</span>
            <span><Code2 size={17}/> M.S. Computer Science</span>
            <span><Music2 size={17}/> Eric Bellinger — “Tunnel Vision”</span>
          </div>
        </div>
        <div className="hero-showcase">
          <div className="showcase-copy">
            <p>THE CREATIVE SYSTEM</p>
            <h2>Records people feel.<br/>Technology artists use.</h2>
            <div>
              <a className="pill white" href="https://traktrain.com/jdemery110" target="_blank" rel="noreferrer">Explore beats <ArrowRight size={17}/></a>
              <a className="text-link" href="#plugin">Meet HELMShape <ArrowRight size={16}/></a>
            </div>
          </div>
          <div className="sound-object" aria-hidden="true">
            <div className="orbit orbit-one"/><div className="orbit orbit-two"/><div className="core"><span>JE</span></div>
            {bars.slice(0,12).map((height,i)=><i key={i} style={{height:`${height}%`,transform:`rotate(${i*30}deg) translateY(-150px)`}}/>)}
          </div>
        </div>
      </section>

      <section className="beats" id="beats">
        <div className="section-intro">
          <p className="overline dark">The catalog</p>
          <h2>Records looking<br/>for the right voice.</h2>
          <p>Original production curated for artists—not a folder of leftovers.</p>
        </div>
        <CatalogPlayer />
      </section>

      <section className="process" id="process">
        <div className="process-head">
          <p className="overline dark">The journey</p>
          <h2>It didn’t happen<br/>overnight.</h2>
          <p>The placement, the degree and the plugin all trace back to quiet hours spent learning the craft. Hover for a glimpse. Open a film to hear it.</p>
        </div>
        <div className="film-grid">
          <StudioFilm src="/studio-process-one.mp4" poster="/studio-process-one.jpg" number="01" title="Before anybody was watching." note="ARCHIVE · 2022" />
          <StudioFilm src="/studio-process-two.mp4" poster="/studio-process-two.jpg" number="02" title="The foundation was forming." note="ARCHIVE · 2022" />
          <StudioFilm src="/journey-studio-keys-2026.mp4" poster="/journey-studio-keys-2026.jpg" number="03" title="The work never stopped." note="ARCHIVE · 2022" />
          <StudioFilm src="/journey-plugin-current.mp4" poster="/journey-plugin-current.jpg" number="04" title="Then the craft became technology." note="BUILDING THE PLUGIN · 2026" />
          <StudioFilm src="/journey-guitar-current.mp4" poster="/journey-guitar-current.jpg" number="05" title="Every instrument became a language." note="LIVE GUITAR · 2026" />
          <StudioFilm src="/journey-keys-current.mp4" poster="/journey-keys-current.jpg" number="06" title="Still rooted in the keys." note="LIVE KEYS · 2026" />
        </div>
        <div className="journey-nav" aria-label="Jeremiah Emery journey">
          <div className="journey-tabs" role="tablist">
            {journeyChapters.map((chapter,index)=>(
              <button key={chapter.year} className={journeyChapter===index?"active":""} onClick={()=>setJourneyChapter(index)} role="tab" aria-selected={journeyChapter===index}>
                <span>{chapter.year}</span><small>{chapter.label}</small>
              </button>
            ))}
          </div>
          <div className="journey-detail" role="tabpanel">
            <span>0{journeyChapter+1} / 03</span>
            <h3>{journeyChapters[journeyChapter].title}</h3>
            <p>{journeyChapters[journeyChapter].body}</p>
          </div>
        </div>
      </section>

      <section className="plugin" id="plugin" onMouseMove={trackPointer}>
        <div className="plugin-copy">
          <div className="badge"><span/> IN DEVELOPMENT</div>
          <p className="overline">HELMShape</p>
          <h2>Describe the feeling.<br/>Shape the sound.</h2>
          <p>An intelligent audio plugin that turns creative language into musical decisions. Built by a producer who codes—not a tech company guessing what producers need.</p>
          <div className="tech"><span>AI SHAPE</span><span>VST3</span><span>AU</span><span>JUCE</span></div>
          <form className="waitlist" onSubmit={joinWaitlist}>
            <div className="waitlist-heading"><strong>Get early access</strong><span>Be first to know when HELMShape drops.</span></div>
            <div className="email-row">
              <label className="sr-only" htmlFor="helmshape-email">Email address</label>
              <input id="helmshape-email" type="email" autoComplete="email" required placeholder="you@email.com" value={email} onChange={event=>setEmail(event.target.value)}/>
              <input className="honey" name="company" type="text" tabIndex={-1} autoComplete="off" aria-hidden="true"/>
              <button type="submit" disabled={signupState==="loading"}>{signupState==="loading"?"Joining…":"Join the list"} <ArrowRight size={16}/></button>
            </div>
            <label className="consent"><input type="checkbox" checked={consent} onChange={event=>setConsent(event.target.checked)} required/><span>I agree to receive HELMShape launch and early-access emails.</span></label>
            {signupMessage && <p className={`form-message ${signupState}`} aria-live="polite">{signupState==="success"&&<Check size={16}/>} {signupMessage}</p>}
          </form>
        </div>
        <div className="plugin-product">
          <div className="product-bar"><span>REAL DEVELOPMENT PREVIEW</span><span>HELMShape · 2026</span></div>
          <Image src="/helmshape-interface-final.png" alt="The updated HELMShape audio plugin interface" width={1806} height={1352}/>
          <div className="product-note"><span>AI-guided sound shaping</span><span>Character · Color · Motion · Space</span></div>
        </div>
      </section>

      <section className="story" id="story">
        <div className="story-copy">
          <p className="overline dark">The person behind it</p>
          <h2>Two crafts.<br/>One vision.</h2>
          <p>Jeremiah Emery is a producer and computer scientist building where music, technology and culture meet. His production appears on Eric Bellinger’s “Tunnel Vision.” He is currently pursuing an M.S. in Computer Science at LSU Online. The records are often signed simply: <strong>Prod. by JE.</strong></p>
          <div className="story-grid">
            <div><Music2/><span>Industry credit</span><strong>Eric Bellinger<br/>“Tunnel Vision”</strong></div>
            <div><Code2/><span>Currently building</span><strong>M.S. Computer Science<br/>+ Audio Software</strong></div>
          </div>
        </div>
        <div className="phone">
          <Image src="/tiktok-profile-2026.png" alt="Jeremiah Emery's updated TikTok creator profile" width={942} height={2048}/>
          <div className="phone-tag"><strong>10.4K</strong><span>following the journey</span></div>
        </div>
      </section>

      <section className="socials">
        <div className="social-head"><p className="overline dark">Follow the process</p><h2>One journey.<br/>Every screen.</h2></div>
        <div className="social-links">
          <a href="https://www.tiktok.com/@jeremiahemery5" target="_blank" rel="noreferrer"><span>01</span><div><small>TIKTOK</small><strong>@jeremiahemery5</strong></div><ArrowRight/></a>
          <a href="https://www.instagram.com/jeremiahemery_/" target="_blank" rel="noreferrer"><span>02</span><div><small>INSTAGRAM</small><strong>@jeremiahemery_</strong></div><ArrowRight/></a>
          <a href="https://www.youtube.com/results?search_query=Jeremiah+Emery" target="_blank" rel="noreferrer"><span>03</span><div><small>YOUTUBE</small><strong>Shorts + the full story</strong></div><ArrowRight/></a>
        </div>
      </section>

      <section className="final-cta">
        <p className="overline">For artists</p><h2>Your next record<br/>starts here.</h2>
        <a className="pill white" href="https://traktrain.com/jdemery110" target="_blank" rel="noreferrer">Shop beats on Traktrain <ExternalLink size={17}/></a>
        <a className="premium-dm" href="https://www.instagram.com/jeremiahemery_/" target="_blank" rel="noreferrer">Premium, exclusive or custom production? DM @jeremiahemery_ <ArrowRight size={15}/></a>
      </section>

      <footer><a className="logo" href="#top"><b>JE</b><small>JEREMIAH EMERY</small></a><p>Music · Software · The journey</p><span>© 2026</span></footer>
    </main>
  );
}
