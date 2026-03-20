"use client"

import { useState, useEffect } from "react"
import {
  DndContext, DragOverlay, PointerSensor,
  useSensor, useSensors, closestCorners,
} from "@dnd-kit/core"
import {
  SortableContext, useSortable,
  verticalListSortingStrategy, arrayMove,
} from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"
import {
  AreaChart, Area, BarChart, Bar,
  CartesianGrid, XAxis, YAxis,
} from "recharts"
import {
  Play, Pause, SkipBack, SkipForward,
  Shuffle, Repeat2, Volume2, BadgeCheck,
  Heart, MoreHorizontal, Disc3,
  Plus, Minus, ShoppingCart, X, ChevronUp,
} from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
import { Slider } from "@/components/ui/slider"
import {
  TooltipProvider, Tooltip, TooltipContent, TooltipTrigger,
} from "@/components/ui/tooltip"
import {
  Card, CardHeader, CardTitle, CardDescription,
  CardContent, CardFooter,
} from "@/components/ui/card"
import {
  Dialog, DialogTrigger, DialogContent,
  DialogHeader, DialogTitle, DialogDescription, DialogFooter,
} from "@/components/ui/dialog"
import {
  ChartContainer, ChartTooltip, ChartTooltipContent,
} from "@/components/ui/chart"
import {
  Accordion, AccordionItem, AccordionTrigger, AccordionContent,
} from "@/components/ui/accordion"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"

// ─────────────────────────────────────────────────────────
// Analytics data
// ─────────────────────────────────────────────────────────

const userGrowthData = [
  { month: "Jan", users: 1200 }, { month: "Feb", users: 1900 },
  { month: "Mar", users: 2400 }, { month: "Apr", users: 2200 },
  { month: "May", users: 3100 }, { month: "Jun", users: 3800 },
  { month: "Jul", users: 4200 }, { month: "Aug", users: 4900 },
  { month: "Sep", users: 5300 }, { month: "Oct", users: 5800 },
  { month: "Nov", users: 6400 }, { month: "Dec", users: 7100 },
]
const signupsByDay = [
  { day: "Mon", signups: 420 }, { day: "Tue", signups: 380 },
  { day: "Wed", signups: 510 }, { day: "Thu", signups: 470 },
  { day: "Fri", signups: 390 }, { day: "Sat", signups: 210 },
  { day: "Sun", signups: 180 },
]
const areaChartConfig = { users:   { label: "Users",   color: "var(--chart-1)" } }
const barChartConfig  = { signups: { label: "Signups", color: "var(--chart-2)" } }
const ACTIVITY_FEED = [
  { id: 1, initials: "AL", name: "Alice Lee",   action: "signed up",          time: "2m ago" },
  { id: 2, initials: "BK", name: "Bob Kim",     action: "upgraded to Pro",    time: "14m ago" },
  { id: 3, initials: "CJ", name: "Clara Jones", action: "invited 3 members",  time: "1h ago" },
  { id: 4, initials: "DM", name: "Dan Moore",   action: "submitted a report", time: "2h ago" },
  { id: 5, initials: "EW", name: "Eva Wang",    action: "signed up",          time: "3h ago" },
  { id: 6, initials: "FP", name: "Frank Park",  action: "cancelled account",  time: "5h ago" },
]

// ─────────────────────────────────────────────────────────
// Artist data
// ─────────────────────────────────────────────────────────

const ARTIST = { name: "The Midnight", followers: "2.4M", monthlyListeners: "3.1M" }

const TOP_TRACKS = [
  { id: "t1", rank: 1, title: "Los Angeles",    album: "Monsters",       duration: "4:32", plays: "45.2M", color: "#c94040" },
  { id: "t2", rank: 2, title: "Monsters",       album: "Monsters",       duration: "3:58", plays: "38.7M", color: "#c94040" },
  { id: "t3", rank: 3, title: "Sunset",         album: "Endless Summer", duration: "5:12", plays: "31.4M", color: "#d4854a" },
  { id: "t4", rank: 4, title: "Jason",          album: "Kids",           duration: "4:18", plays: "28.9M", color: "#4a72d4" },
  { id: "t5", rank: 5, title: "Crystalline",    album: "Nocturnal",      duration: "4:45", plays: "24.1M", color: "#8b5cf6" },
  { id: "t6", rank: 6, title: "America Online", album: "Kids",           duration: "3:52", plays: "21.7M", color: "#4a72d4" },
  { id: "t7", rank: 7, title: "Analog",         album: "Nocturnal",      duration: "4:29", plays: "19.3M", color: "#8b5cf6" },
]

const ALBUMS = [
  { id: "a1", title: "Monsters",        year: 2022, type: "Album",  tracks: 12, color: "#c94040" },
  { id: "a2", title: "Endless Summer",  year: 2021, type: "Album",  tracks: 10, color: "#d4854a" },
  { id: "a3", title: "Kids",            year: 2019, type: "Album",  tracks: 11, color: "#4a72d4" },
  { id: "a4", title: "Nocturnal",       year: 2017, type: "Album",  tracks: 10, color: "#8b5cf6" },
  { id: "a5", title: "Days of Thunder", year: 2018, type: "EP",     tracks: 5,  color: "#3a9e8c" },
  { id: "a6", title: "Burn",            year: 2023, type: "Single", tracks: 1,  color: "#b8962a" },
]

// ─────────────────────────────────────────────────────────
// Kanban data
// ─────────────────────────────────────────────────────────

const COLUMNS = ["todo", "in-progress", "done"]
const COLUMN_LABELS = { "todo": "Todo", "in-progress": "In Progress", "done": "Done" }
const PRIORITY_STYLES = {
  high:   { variant: "destructive", label: "High" },
  medium: { variant: "secondary",   label: "Medium" },
  low:    { variant: "outline",     label: "Low" },
}
const INITIAL_CARDS = {
  "todo": [
    { id: "1", title: "Design onboarding flow",   priority: "high",   assignee: "AL" },
    { id: "2", title: "Write API documentation",  priority: "medium", assignee: "BK" },
    { id: "3", title: "Set up CI/CD pipeline",    priority: "low",    assignee: "CJ" },
  ],
  "in-progress": [
    { id: "4", title: "Implement auth middleware", priority: "high",   assignee: "DM" },
    { id: "5", title: "Refactor database models", priority: "medium", assignee: "AL" },
  ],
  "done": [
    { id: "6", title: "Fix login page layout",    priority: "low",    assignee: "BK" },
    { id: "7", title: "Add unit tests for utils", priority: "medium", assignee: "CJ" },
  ],
}

// ─────────────────────────────────────────────────────────
// Kanban components
// ─────────────────────────────────────────────────────────

function KanbanCard({ card, isDragging }) {
  const priority = PRIORITY_STYLES[card.priority]
  return (
    <div className={cn("flex flex-col gap-3 rounded-lg border bg-card p-3 ring-1 ring-foreground/5 transition-shadow", isDragging ? "opacity-50" : "shadow-sm")}>
      <p className="text-sm font-medium leading-snug">{card.title}</p>
      <div className="flex items-center justify-between">
        <Badge variant={priority.variant}>{priority.label}</Badge>
        <Avatar size="sm"><AvatarFallback>{card.assignee}</AvatarFallback></Avatar>
      </div>
    </div>
  )
}

function SortableCard({ card }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: card.id })
  return (
    <div ref={setNodeRef} style={{ transform: CSS.Transform.toString(transform), transition, cursor: isDragging ? "grabbing" : "grab" }} {...attributes} {...listeners}>
      <KanbanCard card={card} isDragging={isDragging} />
    </div>
  )
}

function KanbanColumn({ id, cards }) {
  return (
    <div className="flex w-56 flex-col gap-3 shrink-0">
      <div className="flex items-center justify-between px-1">
        <span className="text-sm font-semibold">{COLUMN_LABELS[id]}</span>
        <Badge variant="outline">{cards.length}</Badge>
      </div>
      <div className="rounded-xl bg-muted/50 p-2 ring-1 ring-foreground/5 min-h-32">
        <SortableContext items={cards.map((c) => c.id)} strategy={verticalListSortingStrategy}>
          <div className="flex flex-col gap-2">
            {cards.map((card) => <SortableCard key={card.id} card={card} />)}
          </div>
        </SortableContext>
      </div>
    </div>
  )
}

function KanbanBoard() {
  const [columns, setColumns] = useState(INITIAL_CARDS)
  const [activeCard, setActiveCard] = useState(null)
  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 5 } }))

  function findColumn(cardId) { return COLUMNS.find((col) => columns[col].some((c) => c.id === cardId)) }
  function handleDragStart({ active }) {
    const col = findColumn(active.id)
    setActiveCard(columns[col]?.find((c) => c.id === active.id) ?? null)
  }
  function handleDragOver({ active, over }) {
    if (!over) return
    const fromCol = findColumn(active.id)
    const toCol = findColumn(over.id) ?? (COLUMNS.includes(over.id) ? over.id : null)
    if (!fromCol || !toCol || fromCol === toCol) return
    setColumns((prev) => {
      const card = prev[fromCol].find((c) => c.id === active.id)
      const toCards = prev[toCol]
      const overIndex = toCards.findIndex((c) => c.id === over.id)
      const insertAt = overIndex === -1 ? toCards.length : overIndex
      return { ...prev, [fromCol]: prev[fromCol].filter((c) => c.id !== active.id), [toCol]: [...toCards.slice(0, insertAt), card, ...toCards.slice(insertAt)] }
    })
  }
  function handleDragEnd({ active, over }) {
    setActiveCard(null)
    if (!over) return
    const col = findColumn(active.id)
    if (!col) return
    const oldIndex = columns[col].findIndex((c) => c.id === active.id)
    const newIndex = columns[col].findIndex((c) => c.id === over.id)
    if (oldIndex !== newIndex && newIndex !== -1) setColumns((prev) => ({ ...prev, [col]: arrayMove(prev[col], oldIndex, newIndex) }))
  }

  return (
    <DndContext id="kanban-dnd" sensors={sensors} collisionDetection={closestCorners} onDragStart={handleDragStart} onDragOver={handleDragOver} onDragEnd={handleDragEnd}>
      <div className="flex gap-3">
        {COLUMNS.map((col) => <KanbanColumn key={col} id={col} cards={columns[col]} />)}
      </div>
      <DragOverlay>{activeCard && <KanbanCard card={activeCard} />}</DragOverlay>
    </DndContext>
  )
}

// ─────────────────────────────────────────────────────────
// Login form
// ─────────────────────────────────────────────────────────

function LoginForm() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  return (
    <Card className="w-72 shrink-0">
      <CardHeader>
        <CardTitle>Sign in</CardTitle>
        <CardDescription>Enter your credentials to access your account.</CardDescription>
      </CardHeader>
      <CardContent>
        <form id="login-form" onSubmit={(e) => e.preventDefault()} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" placeholder="you@example.com" value={email} onChange={(e) => setEmail(e.target.value)} required />
          </div>
          <div className="flex flex-col gap-1.5">
            <div className="flex items-center justify-between">
              <Label htmlFor="password">Password</Label>
              <a href="#" className="text-xs text-muted-foreground underline-offset-4 hover:underline">Forgot password?</a>
            </div>
            <Input id="password" type="password" placeholder="••••••••" value={password} onChange={(e) => setPassword(e.target.value)} required />
          </div>
        </form>
      </CardContent>
      <CardFooter className="flex flex-col gap-3">
        <Button type="submit" form="login-form" className="w-full">Sign in</Button>
        <p className="text-center text-xs text-muted-foreground">
          Don&apos;t have an account?{" "}
          <a href="#" className="text-foreground underline-offset-4 hover:underline">Sign up</a>
        </p>
      </CardFooter>
    </Card>
  )
}

// ─────────────────────────────────────────────────────────
// Dialog showcase
// ─────────────────────────────────────────────────────────

function DialogShowcase() {
  return (
    <div className="flex w-72 shrink-0 flex-col gap-2">
      <Dialog>
        <DialogTrigger asChild><Button variant="outline" className="w-full">Open basic dialog</Button></DialogTrigger>
        <DialogContent>
          <DialogHeader><DialogTitle>About this page</DialogTitle><DialogDescription>This is a basic dialog for additional information or secondary actions.</DialogDescription></DialogHeader>
          <DialogFooter showCloseButton><Button>Got it</Button></DialogFooter>
        </DialogContent>
      </Dialog>
      <Dialog>
        <DialogTrigger asChild><Button variant="outline" className="w-full">Open confirmation dialog</Button></DialogTrigger>
        <DialogContent>
          <DialogHeader><DialogTitle>Delete account</DialogTitle><DialogDescription>Are you sure? This action is permanent and cannot be undone.</DialogDescription></DialogHeader>
          <DialogFooter><Button variant="destructive">Delete account</Button><Button variant="outline">Cancel</Button></DialogFooter>
        </DialogContent>
      </Dialog>
      <Dialog>
        <DialogTrigger asChild><Button variant="outline" className="w-full">Open form dialog</Button></DialogTrigger>
        <DialogContent>
          <DialogHeader><DialogTitle>Edit profile</DialogTitle><DialogDescription>Update your display name and email address.</DialogDescription></DialogHeader>
          <div className="flex flex-col gap-4 py-2">
            <div className="flex flex-col gap-1.5"><Label htmlFor="dialog-name">Display name</Label><Input id="dialog-name" placeholder="Jane Doe" /></div>
            <div className="flex flex-col gap-1.5"><Label htmlFor="dialog-email">Email</Label><Input id="dialog-email" type="email" placeholder="jane@example.com" /></div>
          </div>
          <DialogFooter showCloseButton><Button>Save changes</Button></DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

// ─────────────────────────────────────────────────────────
// Analytics dashboard
// ─────────────────────────────────────────────────────────

function StatCard({ label, value, sub, subPositive }) {
  return (
    <Card className="flex-1 min-w-0">
      <CardHeader><CardDescription>{label}</CardDescription><CardTitle className="text-2xl font-bold tabular-nums">{value}</CardTitle></CardHeader>
      <CardContent><p className={cn("text-xs", subPositive ? "text-green-600 dark:text-green-400" : "text-muted-foreground")}>{sub}</p></CardContent>
    </Card>
  )
}

function AnalyticsDashboard() {
  return (
    <div className="flex flex-col gap-4 w-full min-w-[700px]">
      <div className="flex gap-3">
        <StatCard label="Total Users"  value="7,100"  sub="+18% from last month"    subPositive />
        <StatCard label="Active Users" value="4,830"  sub="68% of total" />
        <StatCard label="Growth"       value="+24.3%" sub="+6.1pp from last quarter" subPositive />
      </div>
      <div className="flex gap-3">
        <Card className="flex-1 min-w-0">
          <CardHeader><CardTitle>User Growth</CardTitle><CardDescription>Cumulative users over 12 months</CardDescription></CardHeader>
          <CardContent>
            <ChartContainer config={areaChartConfig} className="min-h-[180px] w-full">
              <AreaChart data={userGrowthData} margin={{ top: 4, right: 8, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="fillUsers" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%"  stopColor="var(--color-users)" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="var(--color-users)" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid vertical={false} strokeDasharray="3 3" />
                <XAxis dataKey="month" tickLine={false} axisLine={false} tick={{ fontSize: 11 }} />
                <YAxis tickLine={false} axisLine={false} tick={{ fontSize: 11 }} />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Area type="monotone" dataKey="users" stroke="var(--color-users)" strokeWidth={2} fill="url(#fillUsers)" dot={false} />
              </AreaChart>
            </ChartContainer>
          </CardContent>
        </Card>
        <Card className="w-64 shrink-0">
          <CardHeader><CardTitle>Signups by Day</CardTitle><CardDescription>Average signups per weekday</CardDescription></CardHeader>
          <CardContent>
            <ChartContainer config={barChartConfig} className="min-h-[180px] w-full">
              <BarChart data={signupsByDay} margin={{ top: 4, right: 8, left: -20, bottom: 0 }}>
                <CartesianGrid vertical={false} strokeDasharray="3 3" />
                <XAxis dataKey="day" tickLine={false} axisLine={false} tick={{ fontSize: 11 }} />
                <YAxis tickLine={false} axisLine={false} tick={{ fontSize: 11 }} />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Bar dataKey="signups" fill="var(--color-signups)" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>
      <Card>
        <CardHeader><CardTitle>Recent Activity</CardTitle><CardDescription>Latest user actions across the platform</CardDescription></CardHeader>
        <CardContent>
          <div className="flex flex-col">
            {ACTIVITY_FEED.map((item, i) => (
              <div key={item.id}>
                <div className="flex items-center gap-3 py-2.5">
                  <Avatar size="sm"><AvatarFallback>{item.initials}</AvatarFallback></Avatar>
                  <div className="flex flex-1 items-center justify-between gap-2">
                    <p className="text-sm"><span className="font-medium">{item.name}</span><span className="text-muted-foreground"> {item.action}</span></p>
                    <span className="shrink-0 text-xs text-muted-foreground">{item.time}</span>
                  </div>
                </div>
                {i < ACTIVITY_FEED.length - 1 && <Separator />}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

// ─────────────────────────────────────────────────────────
// Artist page
// ─────────────────────────────────────────────────────────

function AlbumArt({ color, className }) {
  return (
    <div
      className={cn("shrink-0 rounded-md", className)}
      style={{ background: `linear-gradient(145deg, ${color}cc 0%, ${color}66 60%, ${color}22 100%)` }}
    />
  )
}

function formatTime(pct, totalSec = 272) {
  const s = Math.round((pct / 100) * totalSec)
  return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`
}

function ArtistHero({ currentTrack, isPlaying, onPlayPause, onShuffle }) {
  return (
    <div className="relative overflow-hidden rounded-t-xl">
      {/* Blurred album-color backdrop */}
      <div
        className="absolute inset-0 transition-all duration-700"
        style={{ background: `linear-gradient(160deg, ${currentTrack.color}30 0%, transparent 60%)` }}
      />
      <div className="relative flex flex-col gap-3 p-5 pb-4">
        <div className="flex items-center gap-1.5">
          <BadgeCheck className="size-4 text-primary" />
          <span className="text-xs font-medium text-muted-foreground">Verified Artist</span>
        </div>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">{ARTIST.name}</h1>
          <p className="mt-0.5 text-sm text-muted-foreground">{ARTIST.monthlyListeners} monthly listeners · {ARTIST.followers} followers</p>
        </div>
        <div className="flex items-center gap-2">
          <Button onClick={onPlayPause} size="sm" className="gap-1.5">
            {isPlaying ? <Pause className="size-3.5" /> : <Play className="size-3.5" />}
            {isPlaying ? "Pause" : "Play"}
          </Button>
          <Button onClick={onShuffle} variant="outline" size="sm" className="gap-1.5">
            <Shuffle className="size-3.5" />
            Shuffle
          </Button>
          <Button variant="ghost" size="icon-sm">
            <MoreHorizontal className="size-4" />
          </Button>
        </div>
      </div>
    </div>
  )
}

function TopTracksList({ currentTrack, isPlaying, onPlay }) {
  const [hovered, setHovered] = useState(null)

  return (
    <CardContent className="pb-2">
      <h2 className="mb-2 text-sm font-semibold">Popular</h2>
      <div className="flex flex-col">
        {TOP_TRACKS.map((track) => {
          const isActive = currentTrack.id === track.id
          return (
            <div
              key={track.id}
              onMouseEnter={() => setHovered(track.id)}
              onMouseLeave={() => setHovered(null)}
              onClick={() => onPlay(track)}
              className={cn(
                "flex cursor-pointer items-center gap-3 rounded-md px-2 py-1.5 transition-colors hover:bg-accent",
                isActive && "bg-accent/50"
              )}
            >
              {/* Rank / play icon */}
              <div className="flex size-5 shrink-0 items-center justify-center">
                {hovered === track.id
                  ? <Play className="size-3 fill-current text-foreground" />
                  : isActive && isPlaying
                    ? <Disc3 className="size-4 animate-spin text-primary" style={{ animationDuration: "3s" }} />
                    : <span className={cn("text-xs tabular-nums text-muted-foreground", isActive && "text-primary")}>{track.rank}</span>
                }
              </div>

              <AlbumArt color={track.color} className="size-8" />

              <div className="flex min-w-0 flex-1 flex-col">
                <span className={cn("truncate text-sm font-medium", isActive && "text-primary")}>{track.title}</span>
                <span className="truncate text-xs text-muted-foreground">{track.album}</span>
              </div>

              <span className="shrink-0 text-xs tabular-nums text-muted-foreground">{track.plays}</span>
              <span className="w-8 shrink-0 text-right text-xs tabular-nums text-muted-foreground">{track.duration}</span>
            </div>
          )
        })}
      </div>
    </CardContent>
  )
}

function AlbumsGrid({ onPlay }) {
  return (
    <CardContent className="pb-4">
      <h2 className="mb-3 text-sm font-semibold">Discography</h2>
      <div className="grid grid-cols-2 gap-2">
        {ALBUMS.map((album) => (
          <div
            key={album.id}
            onClick={() => onPlay({ ...(TOP_TRACKS.find(t => t.album === album.title) ?? TOP_TRACKS[0]), color: album.color })}
            className="group cursor-pointer rounded-lg p-2.5 transition-colors hover:bg-accent"
          >
            <div className="relative mb-2.5">
              <AlbumArt color={album.color} className="aspect-square w-full" />
              <div className="absolute right-1.5 bottom-1.5 flex size-8 items-center justify-center rounded-full bg-primary text-primary-foreground opacity-0 shadow-md transition-all translate-y-1 group-hover:opacity-100 group-hover:translate-y-0">
                <Play className="size-3.5 fill-current translate-x-px" />
              </div>
            </div>
            <p className="truncate text-sm font-medium">{album.title}</p>
            <div className="flex items-center gap-1.5 mt-0.5">
              <span className="text-xs text-muted-foreground">{album.year}</span>
              <Badge variant="outline" className="h-4 text-[10px] px-1">{album.type}</Badge>
            </div>
          </div>
        ))}
      </div>
    </CardContent>
  )
}

function MiniPlayer({ track, isPlaying, onPlayPause, progress, onSeek, volume, onVolume }) {
  return (
    <div className="shrink-0 border-t bg-card px-4 py-3">
      {/* Progress */}
      <div className="mb-2 flex items-center gap-2">
        <span className="w-7 text-right text-[10px] tabular-nums text-muted-foreground">{formatTime(progress)}</span>
        <Slider value={[progress]} onValueChange={(v) => onSeek(v[0])} max={100} className="flex-1" />
        <span className="w-7 text-[10px] tabular-nums text-muted-foreground">{formatTime(100)}</span>
      </div>

      <div className="flex items-center gap-3">
        {/* Track info */}
        <div className="flex min-w-0 flex-1 items-center gap-2">
          <AlbumArt color={track.color} className="size-8" />
          <div className="min-w-0">
            <p className="truncate text-xs font-semibold">{track.title}</p>
            <p className="truncate text-[11px] text-muted-foreground">{ARTIST.name}</p>
          </div>
          <Button variant="ghost" size="icon-sm" className="ml-auto shrink-0">
            <Heart className="size-3.5" />
          </Button>
        </div>

        {/* Controls */}
        <div className="flex shrink-0 items-center gap-0.5">
          <Button variant="ghost" size="icon-sm">
            <SkipBack className="size-3.5 fill-current" />
          </Button>
          <Button size="icon-sm" onClick={onPlayPause}>
            {isPlaying ? <Pause className="size-3.5 fill-current" /> : <Play className="size-3.5 fill-current" />}
          </Button>
          <Button variant="ghost" size="icon-sm">
            <SkipForward className="size-3.5 fill-current" />
          </Button>
        </div>

        {/* Volume */}
        <div className="flex shrink-0 items-center gap-1.5">
          <Volume2 className="size-3.5 shrink-0 text-muted-foreground" />
          <Slider value={[volume]} onValueChange={(v) => onVolume(v[0])} max={100} className="w-14" />
        </div>
      </div>
    </div>
  )
}

function ArtistPage() {
  const [currentTrack, setCurrentTrack] = useState(TOP_TRACKS[0])
  const [isPlaying, setIsPlaying]       = useState(false)
  const [progress, setProgress]         = useState(18)
  const [volume, setVolume]             = useState(72)

  useEffect(() => {
    if (!isPlaying) return
    const id = setInterval(() => setProgress((p) => (p >= 100 ? 0 : p + 0.3)), 300)
    return () => clearInterval(id)
  }, [isPlaying])

  function playTrack(track) {
    if (currentTrack.id === track.id) {
      setIsPlaying((p) => !p)
    } else {
      setCurrentTrack(track)
      setIsPlaying(true)
      setProgress(0)
    }
  }

  return (
    <TooltipProvider>
      <Card className="flex h-[640px] w-[400px] shrink-0 flex-col overflow-hidden p-0">
        {/* Scrollable content */}
        <div className="flex-1 overflow-y-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          <ArtistHero
            currentTrack={currentTrack}
            isPlaying={isPlaying}
            onPlayPause={() => setIsPlaying((p) => !p)}
            onShuffle={() => playTrack(TOP_TRACKS[Math.floor(Math.random() * TOP_TRACKS.length)])}
          />
          <Separator />
          <TopTracksList currentTrack={currentTrack} isPlaying={isPlaying} onPlay={playTrack} />
          <Separator />
          <AlbumsGrid onPlay={playTrack} />
        </div>

        {/* Sticky mini player */}
        <MiniPlayer
          track={currentTrack}
          isPlaying={isPlaying}
          onPlayPause={() => setIsPlaying((p) => !p)}
          progress={progress}
          onSeek={setProgress}
          volume={volume}
          onVolume={setVolume}
        />
      </Card>
    </TooltipProvider>
  )
}

// ─────────────────────────────────────────────────────────
// Restaurant menu
// ─────────────────────────────────────────────────────────

const DIETARY_STYLES = {
  vegan:       { label: "Vegan",        className: "border-green-300 bg-green-50 text-green-700 dark:bg-green-950 dark:text-green-400 dark:border-green-800" },
  vegetarian:  { label: "Vegetarian",   className: "border-lime-300 bg-lime-50 text-lime-700 dark:bg-lime-950 dark:text-lime-400 dark:border-lime-800" },
  glutenFree:  { label: "Gluten-free",  className: "border-amber-300 bg-amber-50 text-amber-700 dark:bg-amber-950 dark:text-amber-400 dark:border-amber-800" },
  spicy:       { label: "Spicy 🌶",    className: "border-red-300 bg-red-50 text-red-700 dark:bg-red-950 dark:text-red-400 dark:border-red-800" },
  new:         { label: "New",          className: "border-blue-300 bg-blue-50 text-blue-700 dark:bg-blue-950 dark:text-blue-400 dark:border-blue-800" },
}

const MENU = {
  starters: [
    { id: "s1", name: "Burrata & Heirloom Tomatoes", desc: "Creamy burrata, rainbow tomatoes, basil oil, flaked sea salt", price: 14, emoji: "🧀", bg: "#fef3c7", dietary: ["vegetarian", "glutenFree"] },
    { id: "s2", name: "Crispy Calamari",             desc: "Flash-fried squid, lemon aioli, pickled chilli, fresh herbs", price: 13, emoji: "🦑", bg: "#fef9c3", dietary: ["spicy"] },
    { id: "s3", name: "Wild Mushroom Crostini",      desc: "Sourdough, whipped ricotta, truffle, aged parmesan", price: 11, emoji: "🍄", bg: "#f3f4f6", dietary: ["vegetarian"] },
    { id: "s4", name: "Spiced Lentil Soup",          desc: "Red lentils, cumin, coriander, coconut cream, crusty bread", price: 10, emoji: "🥣", bg: "#fde8cc", dietary: ["vegan", "glutenFree"] },
  ],
  mains: [
    { id: "m1", name: "Wagyu Beef Burger",           desc: "200g wagyu patty, aged cheddar, truffle mayo, brioche bun", price: 24, emoji: "🍔", bg: "#fef3c7", dietary: ["new"] },
    { id: "m2", name: "Grilled Sea Bass",            desc: "Whole sea bass, lemon butter, capers, green beans, new potatoes", price: 28, emoji: "🐟", bg: "#dbeafe", dietary: ["glutenFree"] },
    { id: "m3", name: "Spicy Nduja Pasta",           desc: "Spaghetti, nduja, San Marzano tomatoes, pecorino, chilli oil", price: 19, emoji: "🍝", bg: "#fee2e2", dietary: ["spicy"] },
    { id: "m4", name: "Aubergine Parmigiana",        desc: "Slow-roasted aubergine, mozzarella, heritage tomato, basil", price: 17, emoji: "🍆", bg: "#ede9fe", dietary: ["vegan", "glutenFree"] },
    { id: "m5", name: "Confit Duck Leg",             desc: "Duck confit, cherry jus, dauphinoise potatoes, wilted greens", price: 26, emoji: "🍗", bg: "#fde8cc", dietary: ["glutenFree"] },
  ],
  desserts: [
    { id: "d1", name: "Tiramisu",                    desc: "Savoiardi, espresso, mascarpone, cocoa dusting, Marsala", price: 9,  emoji: "🍮", bg: "#fef3c7", dietary: ["vegetarian"] },
    { id: "d2", name: "Dark Chocolate Fondant",      desc: "70% cacao, molten centre, vanilla bean ice cream, praline",  price: 10, emoji: "🍫", bg: "#1c1917", emojiSize: "text-3xl", dietary: ["vegetarian", "new"] },
    { id: "d3", name: "Lemon Posset",                desc: "Set cream, lemon curd, shortbread, candied zest, meringue", price: 8,  emoji: "🍋", bg: "#fef9c3", dietary: ["vegetarian", "glutenFree"] },
  ],
  drinks: [
    { id: "dr1", name: "Aperol Spritz",              desc: "Aperol, Prosecco, soda, orange slice, Aperol foam",          price: 12, emoji: "🍊", bg: "#fed7aa", dietary: [] },
    { id: "dr2", name: "Espresso Martini",           desc: "Vodka, Kahlúa, fresh espresso, coffee bean garnish",         price: 13, emoji: "☕", bg: "#292524", emojiSize: "text-3xl", dietary: [] },
    { id: "dr3", name: "Elderflower Lemonade",       desc: "House-pressed lemon, elderflower cordial, sparkling water",  price: 5,  emoji: "🍹", bg: "#ecfccb", dietary: ["vegan", "glutenFree"] },
    { id: "dr4", name: "Mango Lassi",                desc: "Alphonso mango, whole-milk yoghurt, cardamom, rose water",   price: 6,  emoji: "🥭", bg: "#fde68a", dietary: ["vegetarian", "glutenFree"] },
  ],
}

const CATEGORIES = [
  { id: "starters", label: "Starters" },
  { id: "mains",    label: "Mains" },
  { id: "desserts", label: "Desserts" },
  { id: "drinks",   label: "Drinks" },
]

function DishCard({ dish, qty, onAdd, onRemove }) {
  return (
    <Card className="overflow-hidden p-0">
      {/* Image area */}
      <div
        className="relative flex h-40 w-full items-center justify-center"
        style={{ background: dish.bg }}
      >
        <span className={dish.emojiSize ?? "text-6xl"}>{dish.emoji}</span>
        {dish.dietary.length > 0 && (
          <div className="absolute right-2.5 top-2.5 flex flex-wrap justify-end gap-1">
            {dish.dietary.map(d => (
              <span
                key={d}
                className={cn("rounded-full border px-2 py-0.5 text-[10px] font-semibold leading-none", DIETARY_STYLES[d].className)}
              >
                {DIETARY_STYLES[d].label}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Body */}
      <CardContent className="flex flex-col gap-3 p-4">
        <div className="flex flex-col gap-1">
          <p className="text-sm font-semibold leading-snug">{dish.name}</p>
          <p className="line-clamp-2 text-xs leading-relaxed text-muted-foreground">{dish.desc}</p>
        </div>

        <div className="flex items-center justify-between">
          <span className="text-base font-bold">${dish.price}</span>

          {qty === 0 ? (
            <Button size="sm" className="gap-1.5" onClick={onAdd}>
              <Plus className="size-3.5" />
              Add
            </Button>
          ) : (
            <div className="flex items-center gap-1.5">
              <Button variant="outline" size="icon-sm" onClick={onRemove}>
                <Minus className="size-3" />
              </Button>
              <span className="w-5 text-center text-sm font-semibold tabular-nums">{qty}</span>
              <Button variant="outline" size="icon-sm" onClick={onAdd}>
                <Plus className="size-3" />
              </Button>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

function CartDrawer({ cart, menu, onClose }) {
  const items = Object.entries(cart).filter(([, q]) => q > 0).map(([id, qty]) => {
    const dish = Object.values(menu).flat().find(d => d.id === id)
    return { dish, qty }
  })
  const subtotal = items.reduce((s, { dish, qty }) => s + dish.price * qty, 0)

  return (
    <div className="flex flex-col">
      <div className="flex items-center justify-between border-b px-4 py-3">
        <div className="flex items-center gap-2">
          <ShoppingCart className="size-4" />
          <span className="font-semibold">Your order</span>
        </div>
        <Button variant="ghost" size="icon-sm" onClick={onClose}>
          <X className="size-4" />
        </Button>
      </div>

      <div className="flex flex-col gap-2 overflow-y-auto px-4 py-3" style={{ maxHeight: 220 }}>
        {items.map(({ dish, qty }) => (
          <div key={dish.id} className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="flex size-5 items-center justify-center rounded bg-muted text-[10px] font-bold">{qty}</span>
              <span className="text-sm">{dish.name}</span>
            </div>
            <span className="text-sm font-medium tabular-nums">${(dish.price * qty).toFixed(2)}</span>
          </div>
        ))}
      </div>

      <div className="border-t px-4 py-3">
        <div className="flex items-center justify-between mb-3">
          <span className="text-sm text-muted-foreground">Subtotal</span>
          <span className="text-sm font-bold">${subtotal.toFixed(2)}</span>
        </div>
        <Button className="w-full">Checkout · ${subtotal.toFixed(2)}</Button>
      </div>
    </div>
  )
}

function RestaurantMenuPage() {
  const [cart, setCart] = useState({})
  const [cartOpen, setCartOpen] = useState(false)

  const totalItems = Object.values(cart).reduce((s, q) => s + q, 0)
  const totalPrice = Object.entries(cart).reduce((s, [id, qty]) => {
    const dish = Object.values(MENU).flat().find(d => d.id === id)
    return s + (dish?.price ?? 0) * qty
  }, 0)

  function add(id) {
    setCart(prev => ({ ...prev, [id]: (prev[id] ?? 0) + 1 }))
    setCartOpen(false) // keep closed while browsing; user opens manually
  }
  function remove(id) {
    setCart(prev => {
      const next = { ...prev, [id]: Math.max(0, (prev[id] ?? 0) - 1) }
      if (next[id] === 0) delete next[id]
      return next
    })
  }

  return (
    <Card className="relative flex h-[720px] w-[480px] shrink-0 flex-col overflow-hidden p-0">

      {/* ── Header ── */}
      <CardHeader className="border-b pt-5">
        <div className="flex items-center justify-between gap-4">
          <div className="flex flex-col gap-0.5">
            <CardTitle>Bella Napoli</CardTitle>
            <CardDescription>Italian · Pasta · Pizza · ⭐ 4.8 (320+)</CardDescription>
          </div>
          <Badge variant="secondary" className="shrink-0">Open now</Badge>
        </div>
      </CardHeader>

      {/* ── Category tabs + dish grid ── */}
      <div className="flex-1 overflow-hidden">
        <Tabs defaultValue="starters" className="flex h-full flex-col gap-0">
          <div className="border-b px-4 pt-1">
            <TabsList variant="line" className="w-full justify-start gap-0 h-auto">
              {CATEGORIES.map(cat => (
                <TabsTrigger key={cat.id} value={cat.id} className="px-5 pb-2.5 pt-1 text-sm font-medium">
                  {cat.label}
                </TabsTrigger>
              ))}
            </TabsList>
          </div>

          {CATEGORIES.map(cat => (
            <TabsContent
              key={cat.id}
              value={cat.id}
              className="flex-1 overflow-y-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
            >
              <div className="grid grid-cols-2 gap-4 p-4">
                {MENU[cat.id].map(dish => (
                  <DishCard
                    key={dish.id}
                    dish={dish}
                    qty={cart[dish.id] ?? 0}
                    onAdd={() => add(dish.id)}
                    onRemove={() => remove(dish.id)}
                  />
                ))}
              </div>
              {totalItems > 0 && <div className="h-20" />}
            </TabsContent>
          ))}
        </Tabs>
      </div>

      {/* ── Floating cart summary — slides up from bottom ── */}
      {totalItems > 0 && (
        <div
          className={cn(
            "absolute inset-x-0 bottom-0 rounded-b-xl border-t bg-card shadow-lg transition-all duration-300",
            cartOpen ? "translate-y-0" : "translate-y-0"
          )}
        >
          {cartOpen ? (
            <CartDrawer cart={cart} menu={MENU} onClose={() => setCartOpen(false)} />
          ) : (
            <button
              onClick={() => setCartOpen(true)}
              className="flex w-full items-center justify-between px-4 py-3 transition-colors hover:bg-muted/40"
            >
              <div className="flex items-center gap-2.5">
                <div className="relative">
                  <ShoppingCart className="size-5" />
                  <span className="absolute -right-1.5 -top-1.5 flex size-4 items-center justify-center rounded-full bg-primary text-[9px] font-bold text-primary-foreground">
                    {totalItems}
                  </span>
                </div>
                <span className="text-sm font-semibold">View cart</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="text-sm font-bold">${totalPrice.toFixed(2)}</span>
                <ChevronUp className="size-4 text-muted-foreground" />
              </div>
            </button>
          )}
        </div>
      )}
    </Card>
  )
}

// ─────────────────────────────────────────────────────────
// Section wrapper
// ─────────────────────────────────────────────────────────

function Section({ label, children }) {
  return (
    <section className="flex shrink-0 flex-col gap-4">
      <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">{label}</p>
      {children}
    </section>
  )
}

// ─────────────────────────────────────────────────────────
// Page — 3 sections per row, each row scrolls horizontally
// ─────────────────────────────────────────────────────────

const SECTIONS = [
  { label: "Login form",           content: <LoginForm /> },
  { label: "Dialog",               content: <DialogShowcase /> },
  { label: "Kanban board",         content: <KanbanBoard /> },
  { label: "Analytics dashboard",  content: <AnalyticsDashboard /> },
  { label: "Artist page",          content: <ArtistPage /> },
  { label: "Restaurant menu",       content: <RestaurantMenuPage /> },
]

export default function ShowcasePage() {
  const rows = []
  for (let i = 0; i < SECTIONS.length; i += 3) rows.push(SECTIONS.slice(i, i + 3))

  return (
    <div className="min-h-screen overflow-x-auto bg-background">
      <div className="flex w-max flex-col gap-10 px-12 py-16">
        {rows.map((row, ri) => (
          <div key={ri} className="flex gap-10">
            {row.map((s) => (
              <Section key={s.label} label={s.label}>{s.content}</Section>
            ))}
          </div>
        ))}
      </div>
    </div>
  )
}
