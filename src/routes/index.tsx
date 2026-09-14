import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useState, type ReactNode } from "react";
import {
  Activity, Archive, ArrowDownRight, ArrowLeft, ArrowRight, ArrowUpRight, Aperture,
  Bell, Box, BrainCircuit, BriefcaseBusiness, Camera, Check, ChevronDown, ChevronRight,
  CircleDot, Clapperboard, Command, Compass, Copy, Database, Download, Ellipsis,
  Film, FolderOpen, Gem, Grid2X2, History, Image as ImageIcon, Layers3, LayoutGrid,
  Lightbulb, Link2, List, MapPin, Maximize2, Menu, MessageSquareMore, MoreHorizontal,
  MoveRight, PanelLeftClose, PanelLeftOpen, Play, Plus, RefreshCcw, Search, Send,
  Settings2, Sparkles, SquareArrowOutUpRight, Target, Timer, Trash2, Upload, UserRound,
  Users, WandSparkles, X, Zap,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Toaster } from "@/components/ui/sonner";
import { toast } from "sonner";
import apartmentImage from "@/assets/frameflow-apartment.jpg";
import studioImage from "@/assets/frameflow-studio.jpg";
import rooftopImage from "@/assets/frameflow-rooftop.jpg";
import mayaImage from "@/assets/frameflow-maya.jpg";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "FRAMEFLOW — Production Intelligence" },
      { name: "description", content: "Build consistent production worlds, plan shots, and validate visual continuity with FRAMEFLOW." },
      { property: "og:title", content: "FRAMEFLOW — Production Intelligence" },
      { property: "og:description", content: "Build consistent production worlds, plan shots, and validate visual continuity with FRAMEFLOW." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Frameflow,
});

type View = "overview" | "projects" | "project" | "assets" | "characters" | "character" | "locations" | "location" | "rooms" | "props" | "prop" | "stories" | "story" | "scenes" | "scene" | "shots" | "shot" | "storyboard" | "continuity" | "issue" | "relationships" | "history";
type ImageSrc = string;

const projects = [
  { name: "Home Film POC", status: "In production", image: apartmentImage, stats: ["3 locations", "2 characters", "24 scenes", "84 shots"], updated: "Edited 12 min ago" },
  { name: "Midnight Apartment", status: "Reference review", image: studioImage, stats: ["2 locations", "4 characters", "12 scenes", "46 shots"], updated: "Edited yesterday" },
  { name: "The Last Frame", status: "Story development", image: rooftopImage, stats: ["5 locations", "3 characters", "18 scenes", "62 shots"], updated: "Edited 3 days ago" },
];

const assets = [
  { name: "Maya", type: "Character", refs: "12 references", status: "Identity verified", image: mayaImage, view: "character" as View },
  { name: "Apartment", type: "Location", refs: "18 references", status: "Production-ready", image: apartmentImage, view: "location" as View },
  { name: "Creative Studio", type: "Location", refs: "9 references", status: "Analyzed", image: studioImage, view: "location" as View },
  { name: "Rooftop", type: "Location", refs: "7 references", status: "Production-ready", image: rooftopImage, view: "location" as View },
  { name: "Phone", type: "Prop", refs: "6 references", status: "State tracked", image: apartmentImage, view: "prop" as View },
  { name: "Camera", type: "Prop", refs: "4 references", status: "Confirmed", image: studioImage, view: "prop" as View },
  { name: "Coffee Cup", type: "Prop", refs: "3 references", status: "State tracked", image: apartmentImage, view: "prop" as View },
  { name: "Daniel", type: "Character", refs: "8 references", status: "Identity review", image: rooftopImage, view: "character" as View },
];

const shots = [
  { number: "01", type: "Extreme wide", copy: "Establish the apartment at blue hour", image: apartmentImage, status: "Approved" },
  { number: "02", type: "Wide", copy: "Maya enters from the window", image: studioImage, status: "Approved" },
  { number: "03", type: "Medium", copy: "She finds the phone on the desk", image: rooftopImage, status: "Review" },
  { number: "04", type: "Close-up", copy: "A message changes the room", image: mayaImage, status: "Draft" },
  { number: "05", type: "Over the shoulder", copy: "The screen catches the window light", image: apartmentImage, status: "Draft" },
  { number: "06", type: "Two shot", copy: "Daniel appears in the doorway", image: studioImage, status: "Draft" },
];

const navGroups = [
  { label: "Workspace", items: [{ label: "Overview", icon: Compass, view: "overview" as View }, { label: "Projects", icon: FolderOpen, view: "projects" as View }] },
  { label: "Production", items: [{ label: "Stories", icon: Lightbulb, view: "stories" as View }, { label: "Scenes", icon: Clapperboard, view: "scenes" as View }, { label: "Shots", icon: Target, view: "shots" as View }, { label: "Storyboard", icon: Film, view: "storyboard" as View }] },
  { label: "Assets", items: [{ label: "All Assets", icon: Layers3, view: "assets" as View }, { label: "Characters", icon: Users, view: "characters" as View }, { label: "Locations", icon: MapPin, view: "locations" as View }, { label: "Rooms", icon: Box, view: "rooms" as View }, { label: "Props", icon: Archive, view: "props" as View }] },
  { label: "Intelligence", items: [{ label: "Production AI", icon: Sparkles, view: "overview" as View, ai: true }, { label: "Continuity", icon: CircleDot, view: "continuity" as View }, { label: "Relationships", icon: Link2, view: "relationships" as View }, { label: "History", icon: History, view: "history" as View }] },
];

function Frameflow() {
  const [view, setView] = useState<View>("overview");
  const [collapsed, setCollapsed] = useState(false);
  const [commandOpen, setCommandOpen] = useState(false);
  const [aiOpen, setAiOpen] = useState(false);
  const [createOpen, setCreateOpen] = useState(false);
  const [assetOpen, setAssetOpen] = useState(false);
  const [processing, setProcessing] = useState<string | null>(null);

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") { event.preventDefault(); setCommandOpen(true); }
      if (event.key === "Escape") { setCommandOpen(false); setAiOpen(false); }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const go = (next: View) => { setView(next); window.scrollTo({ top: 0, behavior: "smooth" }); };
  const runProcess = (label: string, next?: View) => {
    setProcessing(label);
    window.setTimeout(() => { setProcessing(null); toast.success(`${label} complete`, { description: "The production context is ready for review." }); if (next) go(next); }, 1400);
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Toaster position="bottom-right" />
      <div className="flex min-h-screen">
        <Sidebar collapsed={collapsed} setCollapsed={setCollapsed} view={view} go={go} onCreate={() => setCreateOpen(true)} />
        <main className="min-w-0 flex-1">
          <Topbar view={view} go={go} onCommand={() => setCommandOpen(true)} onAI={() => setAiOpen(true)} />
          <div className="frameflow-scrollbar h-[calc(100vh-64px)] overflow-y-auto">
            <div className="mx-auto max-w-[1500px] px-6 py-8 lg:px-10">
              {view === "overview" && <Overview go={go} onCreate={() => setCreateOpen(true)} onAI={() => setAiOpen(true)} />}
              {view === "projects" && <Projects go={go} onCreate={() => setCreateOpen(true)} />}
              {view === "project" && <ProjectOverview go={go} onAI={() => setAiOpen(true)} />}
              {view === "assets" && <AssetLibrary go={go} onCreate={() => setAssetOpen(true)} />}
              {view === "characters" && <AssetList title="Characters" eyebrow="Production identities" description="People, performance states and identity references across your stories." items={assets.filter((a) => a.type === "Character")} go={go} />}
              {view === "character" && <CharacterDetail go={go} onProcess={runProcess} />}
              {view === "locations" && <AssetList title="Locations" eyebrow="Production world" description="Physical spaces that hold your stories together." items={assets.filter((a) => a.type === "Location")} go={go} />}
              {view === "location" && <LocationDetail go={go} />}
              {view === "rooms" && <RoomView go={go} />}
              {view === "props" && <AssetList title="Props" eyebrow="Objects that matter" description="Track the things that move, change and carry meaning through each scene." items={assets.filter((a) => a.type === "Prop")} go={go} />}
              {view === "prop" && <PropDetail go={go} />}
              {view === "stories" && <Stories go={go} onCreate={() => toast.success("Story composer ready", { description: "Describe a sequence and FRAMEFLOW will structure it." })} />}
              {view === "story" && <StoryDetail go={go} onProcess={runProcess} />}
              {view === "scenes" && <Scenes go={go} onProcess={runProcess} />}
              {view === "scene" && <SceneDetail go={go} onProcess={runProcess} />}
              {view === "shots" && <Shots go={go} onProcess={runProcess} />}
              {view === "shot" && <ShotDetail go={go} onProcess={runProcess} />}
              {view === "storyboard" && <Storyboard go={go} />}
              {view === "continuity" && <Continuity go={go} onProcess={runProcess} />}
              {view === "issue" && <ContinuityIssue go={go} onProcess={runProcess} />}
              {view === "relationships" && <Relationships go={go} />}
              {view === "history" && <HistoryView />}
            </div>
          </div>
        </main>
        {aiOpen && <ProductionAI close={() => setAiOpen(false)} go={go} />}
      </div>
      {processing && <ProcessingOverlay label={processing} />}
      <CommandPalette open={commandOpen} close={() => setCommandOpen(false)} go={(next) => { setCommandOpen(false); go(next); }} onCreate={() => { setCommandOpen(false); setCreateOpen(true); }} />
      <CreateProject open={createOpen} close={() => setCreateOpen(false)} go={go} />
      <CreateAsset open={assetOpen} close={() => setAssetOpen(false)} go={go} />
    </div>
  );
}

function Sidebar({ collapsed, setCollapsed, view, go, onCreate }: { collapsed: boolean; setCollapsed: (value: boolean) => void; view: View; go: (view: View) => void; onCreate: () => void }) {
  return <aside className={`${collapsed ? "w-[72px]" : "w-[236px]"} hidden shrink-0 border-r border-border bg-sidebar transition-[width] duration-200 lg:block`}>
    <div className="sticky top-0 flex h-screen flex-col px-3 py-4">
      <div className={`mb-6 flex items-center ${collapsed ? "justify-center" : "justify-between px-2"}`}>
        {!collapsed && <button className="flex items-center gap-2.5 text-left" onClick={() => go("overview")} aria-label="Go to FRAMEFLOW overview"><span className="grid h-7 w-7 place-items-center rounded-lg bg-foreground text-background"><Film className="h-4 w-4" /></span><span className="text-[17px] font-bold tracking-[-0.04em]">FRAMEFLOW</span></button>}
        {collapsed && <button onClick={() => go("overview")} className="grid h-8 w-8 place-items-center rounded-lg bg-foreground text-background" aria-label="Go to overview"><Film className="h-4 w-4" /></button>}
        {!collapsed && <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground" onClick={() => setCollapsed(true)} aria-label="Collapse sidebar"><PanelLeftClose className="h-4 w-4" /></Button>}
      </div>
      {collapsed && <Button variant="ghost" size="icon" className="mb-5 h-9 w-full text-muted-foreground" onClick={() => setCollapsed(false)} aria-label="Expand sidebar"><PanelLeftOpen className="h-4 w-4" /></Button>}
      <Button onClick={onCreate} className={`mb-6 h-10 bg-cyan text-primary-foreground hover:bg-cyan-strong ${collapsed ? "px-0" : "justify-between px-3"}`}><span className="flex items-center gap-2"><Plus className="h-4 w-4" />{!collapsed && "New project"}</span>{!collapsed && <span className="text-primary-foreground/70">⌘ N</span>}</Button>
      <nav className="frameflow-scrollbar flex-1 space-y-5 overflow-y-auto">
        {navGroups.map((group) => <div key={group.label}><div className={`mb-2 px-2 text-[10px] font-semibold uppercase tracking-[0.16em] text-muted-foreground ${collapsed ? "text-center" : ""}`}>{collapsed ? "·" : group.label}</div><div className="space-y-0.5">{group.items.map((item) => <button key={item.label} onClick={() => item.ai ? undefined : go(item.view)} className={`group flex w-full items-center gap-3 rounded-lg px-2.5 py-2 text-left text-[13px] font-medium transition-colors ${view === item.view || (item.label === "Production AI" && false) ? "bg-cyan-soft text-cyan-strong" : "text-muted-foreground hover:bg-accent hover:text-foreground"} ${collapsed ? "justify-center px-0" : ""}`} title={collapsed ? item.label : undefined}><item.icon className={`h-[17px] w-[17px] shrink-0 ${item.ai ? "text-cyan" : ""}`} />{!collapsed && <span>{item.label}</span>}{!collapsed && item.ai && <span className="ml-auto rounded-full bg-cyan-soft px-1.5 py-0.5 text-[9px] font-bold text-cyan-strong">AI</span>}</button>)}</div></div>)}
      </nav>
      {!collapsed && <div className="mt-5 border-t border-border pt-4"><button className="flex w-full items-center gap-3 rounded-lg px-2 py-2 text-left hover:bg-accent"><span className="grid h-8 w-8 place-items-center rounded-full bg-foreground text-xs font-semibold text-background">GK</span><span className="min-w-0 flex-1"><span className="block truncate text-xs font-semibold">Girish Kadambari</span><span className="block text-[11px] text-muted-foreground">Director workspace</span></span><MoreHorizontal className="h-4 w-4 text-muted-foreground" /></button></div>}
    </div>
  </aside>;
}

function Topbar({ view, go, onCommand, onAI }: { view: View; go: (view: View) => void; onCommand: () => void; onAI: () => void }) {
  const labels: Record<View, string> = { overview: "Overview", projects: "Projects", project: "Home Film POC", assets: "Assets", characters: "Characters", character: "Maya", locations: "Locations", location: "Apartment", rooms: "Rooms", props: "Props", prop: "Phone", stories: "Stories", story: "The Last Frame", scenes: "Scenes", scene: "Scene 04", shots: "Shots", shot: "Shot 04", storyboard: "Storyboard", continuity: "Continuity", issue: "Issue review", relationships: "Relationships", history: "History" };
  return <header className="sticky top-0 z-20 flex h-16 items-center justify-between border-b border-border bg-background/95 px-6 backdrop-blur lg:px-10"><div className="flex min-w-0 items-center gap-2 text-xs text-muted-foreground"><Button variant="ghost" size="icon" className="mr-1 h-8 w-8 lg:hidden" aria-label="Open navigation"><Menu className="h-4 w-4" /></Button><button onClick={() => go("overview")} className="hidden hover:text-foreground sm:block">Home</button><ChevronRight className="hidden h-3.5 w-3.5 sm:block" /><span className="truncate font-medium text-foreground">{labels[view]}</span>{view !== "overview" && <><ChevronRight className="h-3.5 w-3.5" /><span className="hidden text-muted-foreground sm:block">Production context</span></>}</div><div className="flex items-center gap-2"><button onClick={onCommand} className="hidden h-9 w-52 items-center gap-2 rounded-lg border border-border bg-card px-3 text-left text-xs text-muted-foreground shadow-sm transition-colors hover:border-cyan/40 hover:text-foreground md:flex"><Search className="h-3.5 w-3.5" /><span className="flex-1">Search production…</span><kbd className="rounded border border-border bg-muted px-1.5 py-0.5 text-[10px]">⌘K</kbd></button><Button variant="ghost" size="icon" className="h-9 w-9" onClick={onCommand} aria-label="Search"><Search className="h-4 w-4" /></Button><Button variant="ghost" size="icon" className="h-9 w-9 text-cyan-strong" onClick={onAI} aria-label="Open Production AI"><Sparkles className="h-4 w-4" /></Button><Button variant="ghost" size="icon" className="relative h-9 w-9" aria-label="Notifications"><Bell className="h-4 w-4" /><span className="absolute right-1.5 top-1.5 h-1.5 w-1.5 rounded-full bg-cyan" /></Button><span className="ml-1 grid h-8 w-8 place-items-center rounded-full bg-foreground text-[10px] font-semibold text-background">GK</span></div></header>;
}

function PageHeader({ eyebrow, title, description, action, secondary }: { eyebrow?: string; title: string; description?: string; action?: ReactNode; secondary?: ReactNode }) {
  return <div className="mb-9 flex flex-col justify-between gap-5 md:flex-row md:items-end"><div><div className="mb-2 flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.18em] text-cyan-strong">{eyebrow && <><span className="h-1.5 w-1.5 rounded-full bg-cyan" />{eyebrow}</>}</div><h1 className="text-3xl font-bold tracking-[-0.045em] sm:text-[40px]">{title}</h1>{description && <p className="mt-2 max-w-xl text-[15px] leading-6 text-muted-foreground">{description}</p>}</div><div className="flex items-center gap-2">{secondary}{action}</div></div>;
}

function Overview({ go, onCreate, onAI }: { go: (view: View) => void; onCreate: () => void; onAI: () => void }) {
  return <div><section className="relative mb-10 overflow-hidden rounded-2xl border border-border bg-card"><div className="grid min-h-[286px] items-end md:grid-cols-[1.15fr_0.85fr]"><div className="relative z-10 px-7 py-8 sm:px-10 sm:py-10"><div className="mb-5 flex items-center gap-2 text-xs font-medium text-cyan-strong"><span className="h-2 w-2 rounded-full bg-cyan ai-pulse" />Production intelligence online</div><h1 className="max-w-xl text-4xl font-bold leading-[1.02] tracking-[-0.06em] sm:text-6xl">Build your<br /><span className="text-cyan-strong">production world.</span></h1><p className="mt-5 max-w-lg text-sm leading-6 text-muted-foreground sm:text-[15px]">Turn environments, characters and stories into a consistent visual system for every shot.</p><div className="mt-7 flex flex-wrap gap-2"><Button onClick={onCreate} className="bg-cyan text-primary-foreground hover:bg-cyan-strong"><Plus className="h-4 w-4" />Create project</Button><Button variant="outline" onClick={onAI}><Sparkles className="h-4 w-4 text-cyan-strong" />Open Production AI</Button></div></div><div className="relative hidden h-full min-h-[286px] overflow-hidden md:block"><img src={apartmentImage} alt="Blue-hour apartment production world" className="h-full w-full object-cover" /><div className="absolute inset-0 bg-gradient-to-r from-card via-card/20 to-transparent" /><div className="absolute bottom-5 right-6 rounded-lg border border-primary-foreground/20 bg-foreground/80 px-3 py-2 text-[10px] text-primary-foreground backdrop-blur"><span className="text-primary-foreground/60">Current context</span><br /><strong>Home Film POC / Apartment</strong></div></div></div></section><div className="mb-12"><SectionHeading title="Recent projects" action={<Button variant="ghost" size="sm" onClick={() => go("projects")} className="text-muted-foreground">View all <ArrowRight className="h-3.5 w-3.5" /></Button>} /><div className="grid gap-4 md:grid-cols-3">{projects.map((project, index) => <ProjectCard key={project.name} project={project} featured={index === 0} onClick={() => go(index === 0 ? "project" : "projects")} />)}</div></div><div className="mb-12"><SectionHeading title="Your production world" action={<Button variant="ghost" size="sm" onClick={() => go("assets")} className="text-muted-foreground">Open library <ArrowRight className="h-3.5 w-3.5" /></Button>} /><div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4"><WorldCard title="Characters" count="08" meta="identities" image={mayaImage} onClick={() => go("characters")} /><WorldCard title="Locations" count="06" meta="production-ready" image={apartmentImage} onClick={() => go("locations")} /><WorldCard title="Props" count="42" meta="states tracked" image={studioImage} onClick={() => go("props")} /><WorldCard title="Wardrobe" count="14" meta="looks confirmed" image={rooftopImage} onClick={() => go("assets")} /></div></div><div className="mb-12"><SectionHeading title="Production pipeline" action={<span className="text-xs text-muted-foreground">Everything stays in context</span>} /><Pipeline go={go} /></div><div><SectionHeading title="Recent activity" action={<Button variant="ghost" size="sm" onClick={() => go("history")} className="text-muted-foreground">Open history <ArrowRight className="h-3.5 w-3.5" /></Button>} /><ActivityList /></div></div>;
}

function SectionHeading({ title, action }: { title: string; action?: ReactNode }) { return <div className="mb-4 flex items-center justify-between"><h2 className="text-lg font-semibold tracking-[-0.025em]">{title}</h2>{action}</div>; }

function ProjectCard({ project, featured, onClick }: { project: typeof projects[number]; featured?: boolean; onClick: () => void }) { return <button onClick={onClick} className={`group relative overflow-hidden rounded-xl border border-border bg-card text-left shadow-sm transition-all hover:-translate-y-0.5 hover:border-cyan/40 hover:shadow-md ${featured ? "md:col-span-1" : ""}`}><div className="relative aspect-[16/10] overflow-hidden"><img src={project.image} alt={`${project.name} cover`} loading="lazy" width={1280} height={800} className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" /><div className="absolute inset-0 bg-gradient-to-t from-foreground/80 via-transparent to-transparent" /><div className="absolute left-4 top-4"><Badge className="border-0 bg-primary-foreground/90 text-foreground">{project.status}</Badge></div><div className="absolute bottom-4 left-4 right-4 flex items-end justify-between text-primary-foreground"><span className="text-base font-semibold">{project.name}</span><ArrowUpRight className="h-4 w-4 opacity-0 transition-opacity group-hover:opacity-100" /></div></div><div className="grid grid-cols-2 gap-y-2 px-4 py-3 text-[11px] text-muted-foreground">{project.stats.map((stat) => <span key={stat}>{stat}</span>)}<span className="col-span-2 pt-1 text-[10px] text-muted-foreground/70">{project.updated}</span></div></button>; }

function WorldCard({ title, count, meta, image, onClick }: { title: string; count: string; meta: string; image: ImageSrc; onClick: () => void }) { return <button onClick={onClick} className="group overflow-hidden rounded-xl border border-border bg-card text-left transition-all hover:-translate-y-0.5 hover:border-cyan/40 hover:shadow-md"><div className="relative aspect-[4/3] overflow-hidden"><img src={image} alt={title} loading="lazy" width={1280} height={800} className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" /><div className="absolute inset-0 bg-gradient-to-t from-foreground/80 to-transparent" /><div className="absolute bottom-3 left-4 text-primary-foreground"><div className="text-sm font-semibold">{title}</div><div className="mt-0.5 text-[11px] text-primary-foreground/70">{count} {meta}</div></div></div></button>; }

function Pipeline({ go }: { go: (view: View) => void }) { const steps: [string, string, View][] = [["Assets", "42", "assets"], ["World", "08", "locations"], ["Story", "03", "stories"], ["Scenes", "24", "scenes"], ["Shots", "84", "shots"], ["Storyboard", "32", "storyboard"], ["Continuity", "92%", "continuity"]]; return <div className="flex flex-wrap items-center gap-2 rounded-xl border border-border bg-card p-4 sm:p-5">{steps.map(([label, count, view], index) => <div key={label} className="flex items-center gap-2"><button onClick={() => go(view)} className="group flex min-w-[104px] items-center gap-2 rounded-lg p-2 text-left transition-colors hover:bg-cyan-soft"><span className={`grid h-8 w-8 place-items-center rounded-lg ${index === 6 ? "bg-cyan text-primary-foreground" : "bg-muted text-cyan-strong"}`}>{index === 6 ? <CircleDot className="h-4 w-4" /> : <span className="text-xs font-bold">{count}</span>}</span><span><span className="block text-xs font-semibold">{label}</span><span className="block text-[10px] text-muted-foreground">{index === 6 ? "Needs review" : index === 5 ? "Ready" : "In context"}</span></span></button>{index < steps.length - 1 && <ArrowRight className="hidden h-4 w-4 text-border sm:block" />}</div>)}</div>; }

function ActivityList() { const activities = [["Character identity updated", "Maya · Human confirmed", "4 min ago", Users], ["Bedroom reference analyzed", "Apartment · 18 references", "18 min ago", ImageIcon], ["Scene breakdown completed", "The Last Frame · 12 scenes", "42 min ago", Clapperboard], ["Continuity issue detected", "Shot 14 · Coffee cup", "1 hr ago", CircleDot], ["Shot generated", "Scene 04 · Shot 04", "2 hrs ago", WandSparkles]] as const; return <div className="divide-y divide-border rounded-xl border border-border bg-card">{activities.map(([title, meta, time, Icon]) => <div key={title} className="flex items-center gap-3 px-4 py-3.5 sm:px-5"><span className="grid h-8 w-8 place-items-center rounded-lg bg-muted text-cyan-strong"><Icon className="h-4 w-4" /></span><div className="min-w-0 flex-1"><div className="text-sm font-medium">{title}</div><div className="truncate text-xs text-muted-foreground">{meta}</div></div><span className="text-[11px] text-muted-foreground">{time}</span></div>)}</div>; }

function Projects({ go, onCreate }: { go: (view: View) => void; onCreate: () => void }) { return <div><PageHeader eyebrow="Workspace" title="Projects" description="Your productions, worlds and visual stories." action={<Button onClick={onCreate} className="bg-cyan text-primary-foreground hover:bg-cyan-strong"><Plus className="h-4 w-4" />New project</Button>} /><div className="mb-4 flex items-center justify-between"><span className="text-xs text-muted-foreground">3 productions</span><Button variant="outline" size="sm"><LayoutGrid className="h-3.5 w-3.5" />Grid <ChevronDown className="h-3.5 w-3.5" /></Button></div><div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">{projects.map((project, index) => <ProjectCard key={project.name} project={project} onClick={() => go(index === 0 ? "project" : "projects")} />)}<button onClick={onCreate} className="group flex min-h-[330px] flex-col items-center justify-center rounded-xl border border-dashed border-border bg-card/40 text-muted-foreground transition-colors hover:border-cyan hover:bg-cyan-soft"><span className="mb-3 grid h-12 w-12 place-items-center rounded-xl border border-border bg-card text-cyan"><Plus className="h-5 w-5" /></span><span className="text-sm font-semibold text-foreground">Create a new production</span><span className="mt-1 text-xs">Start with a story or a world</span></button></div></div>; }

function ProjectOverview({ go, onAI }: { go: (view: View) => void; onAI: () => void }) { const journey: [string, string, string, View, string][] = [["Assets", "42 assets", "Ready", "assets", "bg-success"], ["World", "3 locations", "Ready", "locations", "bg-success"], ["Stories", "2 stories", "In progress", "stories", "bg-warning"], ["Scenes", "24 scenes", "Ready", "scenes", "bg-success"], ["Shots", "84 shots", "Draft", "shots", "bg-cyan"], ["Storyboard", "32 frames", "Ready", "storyboard", "bg-success"], ["Continuity", "3 issues", "Needs review", "continuity", "bg-warning"]]; return <div><div className="mb-8 overflow-hidden rounded-2xl border border-border bg-card"><div className="relative h-44"><img src={apartmentImage} alt="Home Film POC apartment" className="h-full w-full object-cover" /><div className="absolute inset-0 bg-gradient-to-r from-foreground/85 via-foreground/40 to-transparent" /><div className="absolute bottom-6 left-7 text-primary-foreground sm:left-9"><div className="mb-2 flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.18em] text-primary-foreground/70"><Film className="h-3 w-3" />Production workspace</div><h1 className="text-3xl font-bold tracking-[-0.05em]">Home Film POC</h1><p className="mt-1 text-sm text-primary-foreground/70">A quiet apartment. A missing hour. Three people who remember it differently.</p></div><div className="absolute bottom-6 right-7 hidden gap-2 sm:flex"><Button onClick={onAI} variant="outline" className="border-primary-foreground/30 bg-foreground/20 text-primary-foreground hover:bg-foreground/40"><Sparkles className="h-4 w-4" />Production AI</Button><Button onClick={() => go("assets")} className="bg-primary-foreground text-foreground hover:bg-primary-foreground/90"><Plus className="h-4 w-4" />Add asset</Button></div></div><div className="grid grid-cols-3 divide-x divide-border sm:grid-cols-7">{[["Characters", "2", "characters"], ["Locations", "3", "locations"], ["Rooms", "5", "rooms"], ["Props", "18", "props"], ["Stories", "2", "stories"], ["Scenes", "24", "scenes"], ["Shots", "84", "shots"]].map(([label, count, target]) => <button key={label} onClick={() => go(target as View)} className="px-3 py-3 text-left transition-colors hover:bg-accent"><div className="text-lg font-semibold tracking-tight">{count}</div><div className="text-[10px] text-muted-foreground">{label}</div></button>)}</div></div><div className="mb-10"><SectionHeading title="Production journey" action={<span className="text-xs text-muted-foreground">Last synced 4 min ago</span>} /><div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">{journey.map(([label, count, status, target, color]) => <button key={label} onClick={() => go(target)} className="group flex items-start gap-3 rounded-xl border border-border bg-card p-4 text-left transition-all hover:-translate-y-0.5 hover:border-cyan/40 hover:shadow-sm"><span className={`mt-1 h-2 w-2 rounded-full ${color}`} /><span className="min-w-0 flex-1"><span className="block text-sm font-semibold">{label}</span><span className="mt-1 block text-xs text-muted-foreground">{count}</span></span><span className={`text-[10px] font-medium ${status === "Needs review" ? "text-warning" : status === "Draft" ? "text-cyan-strong" : "text-success"}`}>{status}</span><ArrowUpRight className="h-3.5 w-3.5 text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100" /></button>)}</div></div><div><SectionHeading title="Project activity" /><div className="grid gap-4 lg:grid-cols-[1.15fr_0.85fr]"><div className="rounded-xl border border-border bg-card p-5"><div className="mb-6 flex items-center justify-between"><span className="text-sm font-semibold">Production signal</span><Badge variant="secondary" className="bg-cyan-soft text-cyan-strong">Live context</Badge></div><div className="flex items-end gap-2 border-b border-border pb-5"><div className="text-4xl font-bold tracking-[-0.06em]">92%</div><span className="mb-1 text-xs text-success">+6% this week</span></div><div className="mt-5 flex h-24 items-end gap-1.5">{[35, 45, 41, 58, 55, 67, 62, 76, 72, 86, 83, 92].map((height, index) => <div key={index} className={`flex-1 rounded-t-sm ${index === 11 ? "bg-cyan" : "bg-cyan-soft"}`} style={{ height: `${height}%` }} />)}</div><div className="mt-2 flex justify-between text-[10px] text-muted-foreground"><span>Aug 28</span><span>Today</span></div></div><div className="rounded-xl border border-border bg-card p-5"><div className="mb-5 flex items-center justify-between"><span className="text-sm font-semibold">Next best actions</span><Sparkles className="h-4 w-4 text-cyan" /></div>{[["Review 3 continuity issues", "Continuity", "continuity"], ["Complete Shot 04", "Shot planning", "shot"], ["Add wardrobe references", "Maya", "character"]].map(([title, meta, target]) => <button key={title} onClick={() => go(target as View)} className="mb-2 flex w-full items-center gap-3 rounded-lg p-2.5 text-left transition-colors hover:bg-accent"><span className="grid h-7 w-7 place-items-center rounded-md bg-muted text-cyan-strong"><ArrowRight className="h-3.5 w-3.5" /></span><span className="flex-1"><span className="block text-xs font-semibold">{title}</span><span className="block text-[11px] text-muted-foreground">{meta}</span></span><ChevronRight className="h-3.5 w-3.5 text-muted-foreground" /></button>)}</div></div></div></div>; }

function AssetLibrary({ go, onCreate }: { go: (view: View) => void; onCreate: () => void }) { const [tab, setTab] = useState("All"); const filtered = tab === "All" ? assets : assets.filter((item) => item.type === tab.slice(0, -1) || item.type === tab); return <div><PageHeader eyebrow="Production world" title="Assets" description="Everything your production knows about." action={<Button onClick={onCreate} className="bg-cyan text-primary-foreground hover:bg-cyan-strong"><Plus className="h-4 w-4" />Add asset</Button>} /><div className="mb-6 flex flex-wrap items-center justify-between gap-3"><div className="flex flex-wrap gap-1 rounded-lg border border-border bg-card p-1">{["All", "Characters", "Locations", "Props", "Wardrobe"].map((item) => <button key={item} onClick={() => setTab(item)} className={`rounded-md px-3 py-1.5 text-xs font-medium transition-colors ${tab === item ? "bg-foreground text-background" : "text-muted-foreground hover:text-foreground"}`}>{item}</button>)}</div><div className="flex items-center gap-2"><Button variant="outline" size="sm"><span className="h-1.5 w-1.5 rounded-full bg-cyan" />Recently updated <ChevronDown className="h-3.5 w-3.5" /></Button><Button variant="outline" size="sm"><Grid2X2 className="h-3.5 w-3.5" />Grid <ChevronDown className="h-3.5 w-3.5" /></Button></div></div><div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">{filtered.map((asset) => <AssetCard key={asset.name} asset={asset} onClick={() => go(asset.view)} />)}</div></div>; }

function AssetCard({ asset, onClick }: { asset: typeof assets[number]; onClick: () => void }) { return <button onClick={onClick} className="group overflow-hidden rounded-xl border border-border bg-card text-left transition-all hover:-translate-y-0.5 hover:border-cyan/40 hover:shadow-md"><div className="relative aspect-[4/3] overflow-hidden"><img src={asset.image} alt={asset.name} loading="lazy" width={1280} height={800} className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" /><div className="absolute left-3 top-3"><Badge className="border-0 bg-card/85 text-[10px] uppercase tracking-wide text-foreground backdrop-blur">{asset.type}</Badge></div><div className="absolute bottom-3 right-3 rounded-md bg-foreground/70 px-2 py-1 text-[10px] text-primary-foreground opacity-0 transition-opacity group-hover:opacity-100">Open asset <ArrowUpRight className="ml-1 inline h-3 w-3" /></div></div><div className="p-4"><div className="flex items-start justify-between gap-2"><div><div className="text-sm font-semibold">{asset.name}</div><div className="mt-1 text-xs text-muted-foreground">{asset.refs}</div></div><span className="mt-1 h-2 w-2 rounded-full bg-success" /></div><div className="mt-4 flex items-center justify-between border-t border-border pt-3 text-[10px] text-muted-foreground"><span>{asset.status}</span><span>Edited today</span></div></div></button>; }

function AssetList({ title, eyebrow, description, items, go }: { title: string; eyebrow: string; description: string; items: typeof assets; go: (view: View) => void }) { return <div><PageHeader eyebrow={eyebrow} title={title} description={description} action={<Button onClick={() => toast.success(`${title.slice(0, -1)} creation started`)} className="bg-cyan text-primary-foreground hover:bg-cyan-strong"><Plus className="h-4 w-4" />Add {title.slice(0, -1)}</Button>} /><div className="mb-5 flex items-center justify-between"><span className="text-xs text-muted-foreground">{items.length} production assets</span><div className="flex gap-2"><Button variant="outline" size="sm"><List className="h-3.5 w-3.5" />List</Button><Button variant="outline" size="sm"><Grid2X2 className="h-3.5 w-3.5" />Grid</Button></div></div><div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">{items.map((asset) => <AssetCard key={asset.name} asset={asset} onClick={() => go(asset.view)} />)}</div></div>; }