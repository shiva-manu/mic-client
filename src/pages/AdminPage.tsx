import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Plus,
    Trash2,
    Users,
    Calendar,
    Award,
    Loader2,
    LogOut,
    MapPin,
    Clock,
    ShieldCheck,
    Github,
    Linkedin,
    MessageSquare
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { api } from '@/lib/api';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/lib/AuthContext';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';
import { uploadImage } from '@/lib/supabase';
import { useRef } from 'react';
import { toast } from 'sonner';

const AdminPage = () => {
    const { token, logout, user } = useAuth();
    const [loading, setLoading] = useState(false);
    const [boardMembers, setBoardMembers] = useState<any[]>([]);
    const [advisory, setAdvisory] = useState<any[]>([]);
    const [events, setEvents] = useState<any[]>([]);

    const [boardForm, setBoardForm] = useState({ name: '', role: '', image: '', github: '', linkedin: '', discord: '' });
    const [advisoryForm, setAdvisoryForm] = useState({ name: '', role: '', image: '', github: '', linkedin: '', discord: '' });
    const [eventForm, setEventForm] = useState({ title: '', description: '', date: '', location: '', time: '', image: '', tags: '', status: 'UPCOMING' });

    const [boardFile, setBoardFile] = useState<File | null>(null);
    const [advisoryFile, setAdvisoryFile] = useState<File | null>(null);
    const [eventFile, setEventFile] = useState<File | null>(null);

    // Input refs to clear file selections
    const boardFileRef = useRef<HTMLInputElement>(null);
    const advisoryFileRef = useRef<HTMLInputElement>(null);
    const eventFileRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        setLoading(true);
        try {
            const [boardData, advisoryData, eventsData] = await Promise.all([
                api.getBoardMembers(),
                api.getAdvisory(),
                api.getEvents()
            ]);
            setBoardMembers(Array.isArray(boardData) ? boardData : []);
            setAdvisory(Array.isArray(advisoryData) ? advisoryData : []);
            setEvents(Array.isArray(eventsData) ? eventsData : []);
        } catch (error) {
            console.error('Error fetching data:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmitBoard = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!token) return;

        const promise = (async () => {
            let imageUrl = boardForm.image;
            if (boardFile) {
                imageUrl = await uploadImage(boardFile);
            }
            await api.createBoardMember({ ...boardForm, image: imageUrl }, token);
            setBoardForm({ name: '', role: '', image: '', github: '', linkedin: '', discord: '' });
            setBoardFile(null);
            if (boardFileRef.current) boardFileRef.current.value = '';
            fetchData();
        })();

        setLoading(true);
        toast.promise(promise, {
            loading: 'Uploading image and publishing profile...',
            success: 'Board member published successfully!',
            error: (err) => err.message || 'Failed to create board member'
        });

        try {
            await promise;
        } finally {
            setLoading(false);
        }
    };

    const handleSubmitAdvisory = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!token) return;

        const promise = (async () => {
            let imageUrl = advisoryForm.image;
            if (advisoryFile) {
                imageUrl = await uploadImage(advisoryFile);
            }
            await api.createAdvisory({ ...advisoryForm, image: imageUrl }, token);
            setAdvisoryForm({ name: '', role: '', image: '', github: '', linkedin: '', discord: '' });
            setAdvisoryFile(null);
            if (advisoryFileRef.current) advisoryFileRef.current.value = '';
            fetchData();
        })();

        setLoading(true);
        toast.promise(promise, {
            loading: 'Uploading image and registering advisor...',
            success: 'Advisor registered successfully!',
            error: (err) => err.message || 'Failed to create advisor'
        });

        try {
            await promise;
        } finally {
            setLoading(false);
        }
    };

    const handleSubmitEvent = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!token) return;

        const promise = (async () => {
            let imageUrl = eventForm.image;
            if (eventFile) {
                imageUrl = await uploadImage(eventFile);
            }
            const tagsArray = eventForm.tags.split(',').map(tag => tag.trim()).filter(tag => tag !== '');
            const data = { ...eventForm, image: imageUrl, tags: tagsArray };
            await api.createEvent(data, token);
            setEventForm({ title: '', description: '', date: '', location: '', time: '', image: '', tags: '', status: 'UPCOMING' });
            setEventFile(null);
            if (eventFileRef.current) eventFileRef.current.value = '';
            fetchData();
        })();

        setLoading(true);
        toast.promise(promise, {
            loading: 'Uploading poster and publishing event...',
            success: 'Event published successfully!',
            error: (err) => err.message || 'Failed to create event'
        });

        try {
            await promise;
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (type: 'board' | 'advisory' | 'event', id: string) => {
        if (!confirm('Are you sure you want to delete this?')) return;
        if (!token) return;

        const promise = (async () => {
            if (type === 'board') await api.deleteBoardMember(id, token);
            if (type === 'advisory') await api.deleteAdvisory(id, token);
            if (type === 'event') await api.deleteEvent(id, token);
            fetchData();
        })();

        setLoading(true);
        toast.promise(promise, {
            loading: 'Deleting item...',
            success: 'Item deleted successfully',
            error: (err) => err.message || 'Failed to delete item'
        });

        try {
            await promise;
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-black/40 pt-24 pb-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-6xl mx-auto space-y-8">
                {/* Header */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white/5 p-6 rounded-2xl border border-white/10 backdrop-blur-xl">
                    <div className="flex flex-col gap-2">
                        <div className="flex items-center gap-3">
                            <motion.h1
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                className="text-3xl font-bold bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent"
                            >
                                Admin Dashboard
                            </motion.h1>
                            <Badge className="border-emerald-500/30 text-emerald-400 bg-emerald-500/10">
                                <ShieldCheck className="w-3 h-3 mr-1" /> Authenticated
                            </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">Admin: <span className="text-foreground">{user?.email}</span></p>
                    </div>
                    <Button
                        variant="outline"
                        onClick={logout}
                        className="border-white/10 hover:bg-red-500/10 hover:text-red-400 transition-all active:scale-95"
                    >
                        <LogOut className="w-4 h-4 mr-2" /> Sign Out
                    </Button>
                </div>

                <Tabs defaultValue="board" className="w-full">
                    <TabsList className="grid w-full grid-cols-3 bg-secondary/30 backdrop-blur-md border border-white/5 h-14 mb-8 p-1.5 rounded-xl">
                        <TabsTrigger value="board" className="flex items-center gap-2 data-[state=active]:bg-emerald-500/10 data-[state=active]:text-emerald-400 transition-all rounded-lg text-sm font-medium h-full">
                            <Users className="w-4 h-4" /> Board Members
                        </TabsTrigger>
                        <TabsTrigger value="advisory" className="flex items-center gap-2 data-[state=active]:bg-cyan-500/10 data-[state=active]:text-cyan-400 transition-all rounded-lg text-sm font-medium h-full">
                            <Award className="w-4 h-4" /> Advisory Board
                        </TabsTrigger>
                        <TabsTrigger value="events" className="flex items-center gap-2 data-[state=active]:bg-purple-500/10 data-[state=active]:text-purple-400 transition-all rounded-lg text-sm font-medium h-full">
                            <Calendar className="w-4 h-4" /> Club Events
                        </TabsTrigger>
                    </TabsList>

                    <AnimatePresence mode="wait">
                        <TabsContent value="board" className="space-y-8 animate-in fade-in-0 slide-in-from-bottom-2 duration-300">
                            <div className="flex flex-col gap-10">
                                {/* Form Card */}
                                <Card className="bg-white/[0.02] border-white/10 backdrop-blur-2xl shadow-2xl">
                                    <CardHeader>
                                        <CardTitle className="text-xl flex items-center gap-2">
                                            <div className="w-8 h-8 rounded-lg bg-emerald-500/20 flex items-center justify-center">
                                                <Plus className="w-4 h-4 text-emerald-400" />
                                            </div>
                                            Add Board Member
                                        </CardTitle>
                                        <CardDescription>Fill in the profile details and social presence.</CardDescription>
                                    </CardHeader>
                                    <CardContent>
                                        <form onSubmit={handleSubmitBoard} className="space-y-5">
                                            <div className="grid grid-cols-2 gap-4">
                                                <div className="space-y-2">
                                                    <Label>Full Name</Label>
                                                    <Input value={boardForm.name} onChange={e => setBoardForm({ ...boardForm, name: e.target.value })} placeholder="Jane Doe" required />
                                                </div>
                                                <div className="space-y-2">
                                                    <Label>Designation</Label>
                                                    <Input value={boardForm.role} onChange={e => setBoardForm({ ...boardForm, role: e.target.value })} placeholder="General Secretary" required />
                                                </div>
                                            </div>
                                            <div className="space-y-2">
                                                <Label>Profile Image</Label>
                                                <Input ref={boardFileRef} type="file" accept="image/*" onChange={e => setBoardFile(e.target.files?.[0] || null)} required={!boardForm.image} />
                                            </div>
                                            <div className="space-y-4 pt-2 border-t border-white/5">
                                                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-widest">Social Network Links</p>
                                                <div className="space-y-3">
                                                    <div className="space-y-1.5">
                                                        <Label className="text-xs">GitHub Profile URL</Label>
                                                        <Input value={boardForm.github} onChange={e => setBoardForm({ ...boardForm, github: e.target.value })} placeholder="https://github.com/janedoe" />
                                                    </div>
                                                    <div className="space-y-1.5">
                                                        <Label className="text-xs">LinkedIn Profile URL</Label>
                                                        <Input value={boardForm.linkedin} onChange={e => setBoardForm({ ...boardForm, linkedin: e.target.value })} placeholder="https://linkedin.com/in/janedoe" />
                                                    </div>
                                                    <div className="space-y-1.5">
                                                        <Label className="text-xs">Discord Profile Link</Label>
                                                        <Input value={boardForm.discord} onChange={e => setBoardForm({ ...boardForm, discord: e.target.value })} placeholder="https://discordapp.com/users/..." />
                                                    </div>
                                                </div>
                                            </div>
                                            <Button type="submit" className="w-full bg-emerald-600 hover:bg-emerald-500 text-white h-11 transition-all shadow-lg shadow-emerald-600/10" disabled={loading}>
                                                {loading ? (
                                                    <div className="flex items-center gap-2">
                                                        <Loader2 className="w-4 h-4 animate-spin" />
                                                        <span>Publishing...</span>
                                                    </div>
                                                ) : "Publish Board Profile"}
                                            </Button>
                                        </form>
                                    </CardContent>
                                </Card>

                                {/* List Card */}
                                <div className="space-y-4">
                                    <div className="flex items-center justify-between px-2">
                                        <h3 className="text-lg font-semibold flex items-center gap-2">
                                            <Users className="w-5 h-5 text-emerald-400" />
                                            Directory <span className="text-muted-foreground font-normal">({boardMembers.length})</span>
                                        </h3>
                                    </div>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                                        {boardMembers.length === 0 && (
                                            <div className="p-12 text-center bg-white/5 rounded-2xl border border-dashed border-white/10">
                                                <p className="text-muted-foreground italic">No board members found. Add one to get started.</p>
                                            </div>
                                        )}
                                        {boardMembers.map((member: any) => (
                                            <motion.div
                                                key={member.id}
                                                layout
                                                initial={{ opacity: 0, scale: 0.95 }}
                                                animate={{ opacity: 1, scale: 1 }}
                                                className="group flex flex-col items-center text-center p-6 rounded-2xl bg-white/[0.03] border border-white/10 hover:bg-white/[0.06] hover:border-emerald-500/30 transition-all duration-300 relative overflow-hidden"
                                            >
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 text-red-400 hover:text-red-300 hover:bg-red-400/10 transition-all z-10 rounded-full"
                                                    onClick={() => handleDelete('board', member.id)}
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </Button>
                                                <Avatar size="lg" className="border-2 border-emerald-500/20 shadow-xl group-hover:border-emerald-500/50 transition-colors">
                                                    <AvatarImage src={member.image} alt={member.name} />
                                                    <AvatarFallback className="bg-emerald-500/10 text-emerald-400">{member.name[0]}</AvatarFallback>
                                                </Avatar>
                                                <div className="flex-1 min-w-0 w-full mt-2">
                                                    <h4 className="font-bold text-foreground truncate">{member.name}</h4>
                                                    <p className="text-[10px] text-muted-foreground truncate font-bold uppercase tracking-widest mt-1">{member.role}</p>
                                                    <div className="flex justify-center gap-2.5 mt-4">
                                                        {member.github && (
                                                            <a href={member.github} target="_blank" rel="noopener noreferrer" className="p-2 rounded-xl bg-white/5 hover:bg-emerald-500/10 transition-all text-muted-foreground hover:text-emerald-400 border border-white/5 hover:border-emerald-500/20" title="GitHub">
                                                                <Github className="w-4 h-4" />
                                                            </a>
                                                        )}
                                                        {member.linkedin && (
                                                            <a href={member.linkedin} target="_blank" rel="noopener noreferrer" className="p-2 rounded-xl bg-white/5 hover:bg-blue-500/10 transition-all text-muted-foreground hover:text-blue-400 border border-white/5 hover:border-blue-500/20" title="LinkedIn">
                                                                <Linkedin className="w-4 h-4" />
                                                            </a>
                                                        )}
                                                        {member.discord && (
                                                            <a href={member.discord} target="_blank" rel="noopener noreferrer" className="p-2 rounded-xl bg-white/5 hover:bg-purple-500/10 transition-all text-muted-foreground hover:text-purple-400 border border-white/5 hover:border-purple-500/20" title="Contact/Discord">
                                                                <MessageSquare className="w-4 h-4" />
                                                            </a>
                                                        )}
                                                    </div>
                                                </div>
                                            </motion.div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </TabsContent>

                        <TabsContent value="advisory" className="space-y-8 animate-in fade-in-0 slide-in-from-bottom-2 duration-300">
                            <div className="flex flex-col gap-10">
                                <Card className="bg-white/[0.02] border-white/10 backdrop-blur-2xl shadow-2xl">
                                    <CardHeader>
                                        <CardTitle className="text-xl flex items-center gap-2">
                                            <div className="w-8 h-8 rounded-lg bg-cyan-500/20 flex items-center justify-center">
                                                <Plus className="w-4 h-4 text-cyan-400" />
                                            </div>
                                            Add Advisor
                                        </CardTitle>
                                        <CardDescription>Register technical or professional advisors.</CardDescription>
                                    </CardHeader>
                                    <CardContent>
                                        <form onSubmit={handleSubmitAdvisory} className="space-y-5">
                                            <div className="grid grid-cols-2 gap-4">
                                                <div className="space-y-2">
                                                    <Label>Advisor Name</Label>
                                                    <Input value={advisoryForm.name} onChange={e => setAdvisoryForm({ ...advisoryForm, name: e.target.value })} placeholder="Dr. Smith" required />
                                                </div>
                                                <div className="space-y-2">
                                                    <Label>Designation</Label>
                                                    <Input value={advisoryForm.role} onChange={e => setAdvisoryForm({ ...advisoryForm, role: e.target.value })} placeholder="Senior Project Manager" required />
                                                </div>
                                            </div>
                                            <div className="space-y-2">
                                                <Label>Profile Image</Label>
                                                <Input ref={advisoryFileRef} type="file" accept="image/*" onChange={e => setAdvisoryFile(e.target.files?.[0] || null)} required={!advisoryForm.image} />
                                            </div>
                                            <div className="space-y-4 pt-2 border-t border-white/5">
                                                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-widest">Connect Links</p>
                                                <div className="space-y-3">
                                                    <div className="space-y-1.5">
                                                        <Label className="text-xs">GitHub Link</Label>
                                                        <Input value={advisoryForm.github} onChange={e => setAdvisoryForm({ ...advisoryForm, github: e.target.value })} placeholder="https://github.com/..." />
                                                    </div>
                                                    <div className="space-y-1.5">
                                                        <Label className="text-xs">LinkedIn Link</Label>
                                                        <Input value={advisoryForm.linkedin} onChange={e => setAdvisoryForm({ ...advisoryForm, linkedin: e.target.value })} placeholder="https://linkedin.com/in/..." />
                                                    </div>
                                                    <div className="space-y-1.5">
                                                        <Label className="text-xs">Other Contact Link</Label>
                                                        <Input value={advisoryForm.discord} onChange={e => setAdvisoryForm({ ...advisoryForm, discord: e.target.value })} placeholder="Personal website or Discord URL" />
                                                    </div>
                                                </div>
                                            </div>
                                            <Button type="submit" className="w-full bg-cyan-600 hover:bg-cyan-500 text-white h-11 transition-all shadow-lg shadow-cyan-600/10" disabled={loading}>
                                                {loading ? (
                                                    <div className="flex items-center gap-2">
                                                        <Loader2 className="w-4 h-4 animate-spin" />
                                                        <span>Registering...</span>
                                                    </div>
                                                ) : "Register Advisor"}
                                            </Button>
                                        </form>
                                    </CardContent>
                                </Card>

                                <div className="space-y-4">
                                    <div className="flex items-center justify-between px-2">
                                        <h3 className="text-lg font-semibold flex items-center gap-2">
                                            <Award className="w-5 h-5 text-cyan-400" />
                                            Advisory Panel <span className="text-muted-foreground font-normal">({advisory.length})</span>
                                        </h3>
                                    </div>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                                        {advisory.length === 0 && (
                                            <div className="p-12 text-center bg-white/5 rounded-2xl border border-dashed border-white/10">
                                                <p className="text-muted-foreground italic">No advisors registered yet.</p>
                                            </div>
                                        )}
                                        {advisory.map((member: any) => (
                                            <motion.div
                                                key={member.id}
                                                layout
                                                initial={{ opacity: 0, scale: 0.95 }}
                                                animate={{ opacity: 1, scale: 1 }}
                                                className="group flex flex-col items-center text-center p-6 rounded-2xl bg-white/[0.03] border border-white/10 hover:bg-white/[0.06] hover:border-cyan-500/30 transition-all duration-300 relative overflow-hidden"
                                            >
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 text-red-400 hover:text-red-300 hover:bg-red-400/10 transition-all z-10 rounded-full"
                                                    onClick={() => handleDelete('advisory', member.id)}
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </Button>
                                                <Avatar size="lg" className="border-2 border-cyan-500/20 shadow-xl group-hover:border-cyan-500/50 transition-colors">
                                                    <AvatarImage src={member.image} alt={member.name} />
                                                    <AvatarFallback className="bg-cyan-500/10 text-cyan-400">{member.name[0]}</AvatarFallback>
                                                </Avatar>
                                                <div className="flex-1 min-w-0 w-full mt-2">
                                                    <h4 className="font-bold text-foreground truncate">{member.name}</h4>
                                                    <p className="text-[10px] text-muted-foreground truncate font-bold uppercase tracking-widest mt-1">{member.role}</p>
                                                    <div className="flex justify-center gap-2.5 mt-4">
                                                        {member.github && (
                                                            <a href={member.github} target="_blank" rel="noopener noreferrer" className="p-2 rounded-xl bg-white/5 hover:bg-emerald-500/10 transition-all text-muted-foreground hover:text-emerald-400 border border-white/5 hover:border-emerald-500/20" title="GitHub">
                                                                <Github className="w-4 h-4" />
                                                            </a>
                                                        )}
                                                        {member.linkedin && (
                                                            <a href={member.linkedin} target="_blank" rel="noopener noreferrer" className="p-2 rounded-xl bg-white/5 hover:bg-blue-500/10 transition-all text-muted-foreground hover:text-blue-400 border border-white/5 hover:border-blue-500/20" title="LinkedIn">
                                                                <Linkedin className="w-4 h-4" />
                                                            </a>
                                                        )}
                                                        {member.discord && (
                                                            <a href={member.discord} target="_blank" rel="noopener noreferrer" className="p-2 rounded-xl bg-white/5 hover:bg-purple-500/10 transition-all text-muted-foreground hover:text-purple-400 border border-white/5 hover:border-purple-500/20" title="Contact">
                                                                <MessageSquare className="w-4 h-4" />
                                                            </a>
                                                        )}
                                                    </div>
                                                </div>
                                            </motion.div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </TabsContent>

                        <TabsContent value="events" className="space-y-8 animate-in fade-in-0 slide-in-from-bottom-2 duration-300">
                            <div className="flex flex-col gap-10">
                                {/* Event Creation Form */}
                                <Card className="bg-white/[0.02] border-white/10 backdrop-blur-2xl shadow-2xl">
                                    <CardHeader>
                                        <CardTitle className="text-xl flex items-center gap-2">
                                            <div className="w-8 h-8 rounded-lg bg-purple-500/20 flex items-center justify-center">
                                                <Plus className="w-4 h-4 text-purple-400" />
                                            </div>
                                            Create Club Event
                                        </CardTitle>
                                        <CardDescription>Announce a new workshop, hackathon, or meet.</CardDescription>
                                    </CardHeader>
                                    <CardContent>
                                        <form onSubmit={handleSubmitEvent} className="space-y-5">
                                            <div className="space-y-2">
                                                <Label>Event Title</Label>
                                                <Input value={eventForm.title} onChange={e => setEventForm({ ...eventForm, title: e.target.value })} placeholder="NextGen AI Hackathon" required />
                                            </div>
                                            <div className="space-y-2">
                                                <Label>Event Description</Label>
                                                <Textarea value={eventForm.description} onChange={e => setEventForm({ ...eventForm, description: e.target.value })} placeholder="A briefing about the event agenda..." className="min-h-[100px]" required />
                                            </div>
                                            <div className="grid grid-cols-2 gap-4">
                                                <div className="space-y-2">
                                                    <Label>Date Label</Label>
                                                    <Input value={eventForm.date} onChange={e => setEventForm({ ...eventForm, date: e.target.value })} placeholder="Nov 15, 2024" required />
                                                </div>
                                                <div className="space-y-2">
                                                    <Label>Vibe/Time</Label>
                                                    <Input value={eventForm.time} onChange={e => setEventForm({ ...eventForm, time: e.target.value })} placeholder="9:00 AM onwards" required />
                                                </div>
                                            </div>
                                            <div className="grid grid-cols-2 gap-4">
                                                <div className="space-y-2">
                                                    <Label>Location</Label>
                                                    <Input value={eventForm.location} onChange={e => setEventForm({ ...eventForm, location: e.target.value })} placeholder="Main Seminar Hall" required />
                                                </div>
                                                <div className="space-y-2">
                                                    <Label>Initial Status</Label>
                                                    <select
                                                        className="flex h-10 w-full rounded-md border border-input bg-background/50 px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 backdrop-blur-sm transition-all duration-200"
                                                        value={eventForm.status}
                                                        onChange={e => setEventForm({ ...eventForm, status: e.target.value })}
                                                    >
                                                        <option value="UPCOMING">Upcoming</option>
                                                        <option value="LIVE">Live Now</option>
                                                        <option value="COMPLETED">Passed (Archive)</option>
                                                    </select>
                                                </div>
                                            </div>
                                            <div className="space-y-2">
                                                <Label>Event Poster Image</Label>
                                                <Input ref={eventFileRef} type="file" accept="image/*" onChange={e => setEventFile(e.target.files?.[0] || null)} required={!eventForm.image} />
                                            </div>
                                            <div className="space-y-2">
                                                <Label>Tags (CSV Format)</Label>
                                                <Input value={eventForm.tags} onChange={e => setEventForm({ ...eventForm, tags: e.target.value })} placeholder="Artificial Intelligence, Coding, SNIST" />
                                                <p className="text-[10px] text-muted-foreground">Example: tech, ai, snist</p>
                                            </div>
                                            <Button type="submit" className="w-full bg-purple-600 hover:bg-purple-500 text-white h-11 transition-all shadow-lg shadow-purple-600/10 mb-2" disabled={loading}>
                                                {loading ? (
                                                    <div className="flex items-center gap-2">
                                                        <Loader2 className="w-4 h-4 animate-spin" />
                                                        <span>Publishing...</span>
                                                    </div>
                                                ) : "Publish Event"}
                                            </Button>
                                        </form>
                                    </CardContent>
                                </Card>

                                {/* Event Display List */}
                                <div className="space-y-4">
                                    <div className="flex items-center justify-between px-2">
                                        <h3 className="text-lg font-semibold flex items-center gap-2">
                                            <Calendar className="w-5 h-5 text-purple-400" />
                                            Event Pipeline <span className="text-muted-foreground font-normal">({events.length})</span>
                                        </h3>
                                    </div>
                                    <div className="grid gap-4">
                                        {events.length === 0 && (
                                            <div className="p-12 text-center bg-white/5 rounded-2xl border border-dashed border-white/10">
                                                <p className="text-muted-foreground italic">Pipeline is clear.</p>
                                            </div>
                                        )}
                                        {events.map((event: any) => (
                                            <motion.div
                                                key={event.id}
                                                layout
                                                initial={{ opacity: 0, scale: 0.98 }}
                                                animate={{ opacity: 1, scale: 1 }}
                                                className="group flex flex-col gap-4 p-5 rounded-2xl bg-white/[0.03] border border-white/10 hover:bg-white/[0.06] hover:border-purple-500/30 transition-all duration-300 relative overflow-hidden"
                                            >
                                                {/* Status Glow */}
                                                <div className={cn(
                                                    "absolute top-0 right-0 w-32 h-32 blur-[80px] -mr-16 -mt-16 transition-opacity opacity-20 group-hover:opacity-40",
                                                    event.status === 'LIVE' ? 'bg-green-500' :
                                                        event.status === 'UPCOMING' ? 'bg-blue-500' :
                                                            'bg-white'
                                                )} />

                                                <div className="flex items-start justify-between gap-4 relative">
                                                    <div className="flex gap-5">
                                                        <div className="w-20 h-20 rounded-xl overflow-hidden bg-secondary shrink-0 border border-white/10 shadow-lg">
                                                            <img src={event.image} alt={event.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                                                        </div>
                                                        <div className="flex-1 min-w-0">
                                                            <div className="flex items-center gap-2 mb-2 flex-wrap">
                                                                <h4 className="font-bold text-lg text-foreground truncate">{event.title}</h4>
                                                                <Badge variant="outline" className={cn(
                                                                    "text-[10px] font-bold px-2 py-0 h-5",
                                                                    event.status === 'LIVE' ? 'text-green-400 border-green-500/40 bg-green-500/10 animate-pulse' :
                                                                        event.status === 'UPCOMING' ? 'text-blue-400 border-blue-500/40 bg-blue-500/10' :
                                                                            'text-muted-foreground border-white/20 bg-white/5'
                                                                )}>
                                                                    {event.status}
                                                                </Badge>
                                                            </div>
                                                            <p className="text-sm text-muted-foreground line-clamp-2 leading-relaxed mb-3">{event.description}</p>
                                                            <div className="flex flex-wrap gap-x-4 gap-y-1.5 pt-3 border-t border-white/5">
                                                                <div className="flex items-center gap-1.5 text-[11px] text-foreground/80 font-medium">
                                                                    <Calendar className="w-3.5 h-3.5 text-purple-400" /> {event.date}
                                                                </div>
                                                                <div className="flex items-center gap-1.5 text-[11px] text-foreground/80 font-medium">
                                                                    <Clock className="w-3.5 h-3.5 text-purple-400" /> {event.time}
                                                                </div>
                                                                <div className="flex items-center gap-1.5 text-[11px] text-foreground/80 font-medium">
                                                                    <MapPin className="w-3.5 h-3.5 text-purple-400" /> {event.location}
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        className="text-red-400 hover:text-red-300 hover:bg-red-400/10 transition-all active:scale-90 relative shrink-0"
                                                        onClick={() => handleDelete('event', event.id)}
                                                    >
                                                        <Trash2 className="w-5 h-5" />
                                                    </Button>
                                                </div>
                                            </motion.div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </TabsContent>
                    </AnimatePresence>
                </Tabs>
            </div>
        </div>
    );
};

export default AdminPage;
