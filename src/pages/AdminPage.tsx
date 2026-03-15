import React, { useState, useEffect, useRef } from 'react';
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
    Github,
    Linkedin,
    Inbox,
    Terminal,
    LayoutDashboard,
    ChevronRight,
    Search,
    Filter
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { api } from '@/lib/api';
import { useAuth } from '@/lib/AuthContext';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';
import { uploadImage } from '@/lib/supabase';
import { toast } from 'sonner';

interface TabProps {
    id: string;
    label: string;
    icon: any;
    count: number;
    color: string;
}

const AdminPage = () => {
    const { token, logout, user } = useAuth();
    const [loading, setLoading] = useState(false);
    const [activeTab, setActiveTab] = useState('board');

    // Data states
    const [boardMembers, setBoardMembers] = useState<any[]>([]);
    const [advisory, setAdvisory] = useState<any[]>([]);
    const [events, setEvents] = useState<any[]>([]);
    const [contacts, setContacts] = useState<any[]>([]);

    // Form states
    const [boardForm, setBoardForm] = useState({ name: '', role: '', image: '', github: '', linkedin: '', discord: '' });
    const [advisoryForm, setAdvisoryForm] = useState({ name: '', role: '', image: '', github: '', linkedin: '', discord: '' });
    const [eventForm, setEventForm] = useState({ title: '', description: '', date: '', location: '', time: '', image: '', tags: '', status: 'UPCOMING' });

    const boardFileRef = useRef<HTMLInputElement>(null);
    const advisoryFileRef = useRef<HTMLInputElement>(null);
    const eventFileRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        setLoading(true);
        try {
            const [boardData, advisoryData, eventsData, contactsData] = await Promise.all([
                api.getBoardMembers(),
                api.getAdvisory(),
                api.getEvents(),
                api.getContacts(token || '')
            ]);
            setBoardMembers(Array.isArray(boardData) ? boardData : []);
            setAdvisory(Array.isArray(advisoryData) ? advisoryData : []);
            setEvents(Array.isArray(eventsData) ? eventsData : []);
            setContacts(Array.isArray(contactsData) ? contactsData : []);
        } catch (error) {
            console.error('Error fetching data:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (type: 'board' | 'advisory' | 'event' | 'contact', id: string) => {
        if (!confirm('Are you sure you want to delete this module?')) return;
        if (!token) return;

        const promise = (async () => {
            if (type === 'board') await api.deleteBoardMember(id, token);
            if (type === 'advisory') await api.deleteAdvisory(id, token);
            if (type === 'event') await api.deleteEvent(id, token);
            if (type === 'contact') await api.deleteContact(id, token);
            fetchData();
        })();

        setLoading(true);
        toast.promise(promise, {
            loading: 'Deallocating memory...',
            success: 'Module deallocated successfully',
            error: (err: any) => err.message || 'Failed to delete module'
        });

        try { await promise; } finally { setLoading(false); }
    };

    const tabs: TabProps[] = [
        { id: 'board', label: 'Board_Members.rs', icon: Users, count: boardMembers.length, color: 'text-emerald-400' },
        { id: 'advisory', label: 'Advisory_Board.rs', icon: Award, count: advisory.length, color: 'text-cyan-400' },
        { id: 'events', label: 'Event_Controller.rs', icon: Calendar, count: events.length, color: 'text-purple-400' },
        { id: 'contacts', label: 'Submission_Log.rs', icon: Inbox, count: contacts.length, color: 'text-amber-400' },
    ];

    return (
        <div className="min-h-screen bg-[#0a0a0a] font-mono text-gray-300 relative overflow-hidden">
            {/* Rust themed grid background */}
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#ce412b08_1px,transparent_1px),linear-gradient(to_bottom,#ce412b08_1px,transparent_1px)] bg-[size:4rem_4rem]"></div>

            {/* Sidebar & Main Layout */}
            <div className="relative z-10 flex flex-col md:flex-row min-h-screen pt-20">

                {/* Vertical Sidebar */}
                <aside className="w-full md:w-80 border-r border-[#ce412b]/10 bg-[#0d0d0d]/80 backdrop-blur-md p-6 flex flex-col gap-8">
                    <div className="space-y-4">
                        <div className="flex items-center gap-3 px-2 py-3 bg-[#ce412b]/5 rounded-lg border border-[#ce412b]/20">
                            <div className="w-10 h-10 rounded bg-[#ce412b] flex items-center justify-center text-white shadow-lg shadow-[#ce412b]/20">
                                <LayoutDashboard className="w-6 h-6" />
                            </div>
                            <div>
                                <h2 className="text-sm font-bold text-[#ce412b] tracking-wider uppercase">Admin_Root</h2>
                                <p className="text-[10px] text-[#ce412b]/60 font-bold truncate max-w-[150px]">{user?.email || 'authenticated_user'}</p>
                            </div>
                        </div>
                    </div>

                    <nav className="flex-1 space-y-2">
                        <p className="text-[10px] font-black text-[#ce412b]/40 uppercase tracking-[0.2em] mb-4 px-2">Navigation_Tree</p>
                        {tabs.map((tab: TabProps) => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={cn(
                                    "w-full flex items-center justify-between px-4 py-3 rounded-md transition-all group overflow-hidden relative",
                                    activeTab === tab.id
                                        ? "bg-[#ce412b]/10 text-white border border-[#ce412b]/20"
                                        : "text-gray-500 hover:bg-white/5 hover:text-gray-300"
                                )}
                            >
                                {activeTab === tab.id && <motion.div layoutId="tab-active" className="absolute left-0 w-1 h-2/3 bg-[#ce412b] rounded-r-full" />}
                                <div className="flex items-center gap-3">
                                    <tab.icon className={cn("w-4 h-4 transition-colors", activeTab === tab.id ? "text-[#ce412b]" : "group-hover:text-gray-200")} />
                                    <span className="text-xs font-bold tracking-tight">{tab.label}</span>
                                </div>
                                <span className={cn(
                                    "text-[10px] font-bold px-1.5 py-0.5 rounded border transition-all",
                                    activeTab === tab.id ? "bg-[#ce412b]/20 border-[#ce412b]/30 text-[#ce412b]" : "bg-white/5 border-white/10 text-gray-600"
                                )}>
                                    {tab.count}
                                </span>
                            </button>
                        ))}
                    </nav>

                    <div className="pt-6 border-t border-[#ce412b]/10">
                        <Button
                            onClick={logout}
                            variant="ghost"
                            className="w-full justify-start text-red-500 hover:bg-red-500/10 hover:text-red-400 font-bold text-xs"
                        >
                            <LogOut className="w-4 h-4 mr-2" /> panic!("Logout")
                        </Button>
                    </div>
                </aside>

                {/* Main Content Area */}
                <main className="flex-1 p-6 md:p-10 overflow-y-auto bg-[#080808]/50 overflow-x-hidden">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={activeTab}
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            className="max-w-5xl mx-auto space-y-8"
                        >
                            {/* Current Tab Header */}
                            <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                                <div className="space-y-1">
                                    <h1 className="text-3xl font-black text-white flex items-center gap-3 uppercase tracking-tighter">
                                        {activeTab === 'board' && 'Board_registry'}
                                        {activeTab === 'advisory' && 'Advisor_registry'}
                                        {activeTab === 'events' && 'Event_registry'}
                                        {activeTab === 'contacts' && 'User_Submissions'}
                                        <span className="text-[#ce412b] animate-pulse">_</span>
                                    </h1>
                                    <div className="flex items-center gap-2 text-[10px] font-bold text-[#ce412b]/60">
                                        <Terminal className="w-3 h-3" />
                                        <span>SYSTEM_STATUS: OK</span>
                                        <span className="w-1 h-1 rounded-full bg-green-500 animate-pulse"></span>
                                        <span className="ml-4 opacity-50 uppercase tracking-widest">compiled_at: {new Date().toLocaleTimeString()}</span>
                                    </div>
                                </div>

                                <div className="flex gap-2">
                                    <div className="relative group">
                                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-600 group-hover:text-[#ce412b] transition-colors" />
                                        <Input className="bg-white/5 border-white/10 rounded-lg pl-10 w-48 md:w-64 text-xs font-mono h-10 focus-visible:ring-[#ce412b]/30 focus-visible:border-[#ce412b]/30" placeholder="cargo search..." />
                                    </div>
                                    <Button variant="outline" size="icon" className="border-white/10 bg-white/5 hover:bg-[#ce412b]/10 hover:text-[#ce412b] hover:border-[#ce412b]/30">
                                        <Filter className="w-4 h-4" />
                                    </Button>
                                    <Button
                                        onClick={fetchData}
                                        variant="outline"
                                        size="icon"
                                        className="border-white/10 bg-white/5 hover:bg-emerald-500/10 hover:text-emerald-400 hover:border-emerald-500/30"
                                        disabled={loading}
                                    >
                                        <Loader2 className={cn("w-4 h-4", loading && "animate-spin")} />
                                    </Button>
                                </div>
                            </header>

                            {/* Content based on tab */}
                            {activeTab === 'board' && (
                                <BoardTab
                                    members={boardMembers}
                                    form={boardForm}
                                    setForm={setBoardForm}
                                    fileRef={boardFileRef}
                                    onDelete={(id: string) => handleDelete('board', id)}
                                    fetchData={fetchData}
                                    token={token}
                                    loading={loading}
                                />
                            )}

                            {activeTab === 'advisory' && (
                                <AdvisoryTab
                                    advisors={advisory}
                                    form={advisoryForm}
                                    setForm={setAdvisoryForm}
                                    fileRef={advisoryFileRef}
                                    onDelete={(id: string) => handleDelete('advisory', id)}
                                    fetchData={fetchData}
                                    token={token}
                                    loading={loading}
                                />
                            )}

                            {activeTab === 'events' && (
                                <EventsTab
                                    events={events}
                                    form={eventForm}
                                    setForm={setEventForm}
                                    fileRef={eventFileRef}
                                    onDelete={(id: string) => handleDelete('event', id)}
                                    fetchData={fetchData}
                                    token={token}
                                    loading={loading}
                                />
                            )}

                            {activeTab === 'contacts' && (
                                <ContactsTab
                                    contacts={contacts}
                                    onDelete={(id: string) => handleDelete('contact', id)}
                                />
                            )}
                        </motion.div>
                    </AnimatePresence>
                </main>
            </div>
        </div>
    );
};

/* --- TAB COMPONENTS --- */

const ModuleHeader = ({ title, icon: Icon, color = "text-[#ce412b]" }: any) => (
    <div className="bg-[#151515] px-4 py-3 border-b border-[#ce412b]/20 flex items-center justify-between rounded-t-lg">
        <div className="flex items-center gap-2">
            <Icon className={cn("w-4 h-4", color)} />
            <span className={cn("text-[11px] font-bold tracking-[0.2em] uppercase", color)}>{title}</span>
        </div>
        <div className="flex gap-1.5 opacity-60">
            <div className="w-2.5 h-2.5 rounded-full bg-red-500/50"></div>
            <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/50"></div>
            <div className="w-2.5 h-2.5 rounded-full bg-green-500/50"></div>
        </div>
    </div>
);

const BoardTab = ({ members, form, setForm, fileRef, onDelete, fetchData, token, loading }: any) => {
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!token) return;
        const submitFn = async () => {
            let imageUrl = form.image;
            if (fileRef.current?.files?.[0]) imageUrl = await uploadImage(fileRef.current.files[0]);
            await api.createBoardMember({ ...form, image: imageUrl }, token);
            setForm({ name: '', role: '', image: '', github: '', linkedin: '', discord: '' });
            if (fileRef.current) fileRef.current.value = '';
            fetchData();
        };
        toast.promise(submitFn(), {
            loading: 'Allocating memory for board_member...',
            success: 'Module successfully loaded',
            error: 'Compilation error'
        });
    };

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            <Card className="bg-[#111111] border-[#ce412b]/20 overflow-hidden">
                <ModuleHeader title="Allocate_Board_Member.rs" icon={Plus} />
                <div className="p-6">
                    <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-4">
                            <div className="space-y-1.5">
                                <Label className="text-[10px] text-gray-500 uppercase"><span className="text-[#ce412b]">let</span> member_name: <span className="text-blue-400">String</span></Label>
                                <Input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} className="bg-[#0a0a0a] border-white/5 focus-visible:border-[#ce412b]/50 h-10 text-[13px] rounded" placeholder='"Expert Coder"' required />
                            </div>
                            <div className="space-y-1.5">
                                <Label className="text-[10px] text-gray-500 uppercase"><span className="text-[#ce412b]">let</span> role: <span className="text-blue-400">String</span></Label>
                                <Input value={form.role} onChange={e => setForm({ ...form, role: e.target.value })} className="bg-[#0a0a0a] border-white/5 focus-visible:border-[#ce412b]/50 h-10 text-[13px] rounded" placeholder='"General Secretary"' required />
                            </div>
                            <div className="space-y-1.5">
                                <Label className="text-[10px] text-gray-500 uppercase"><span className="text-[#ce412b]">pub</span> profile_image: <span className="text-blue-400">Path</span></Label>
                                <Input ref={fileRef} type="file" className="bg-[#0a0a0a] border-white/5 file:bg-[#ce412b] file:text-white file:border-0 file:rounded file:text-[10px] file:uppercase file:font-black h-10" required={!form.image} />
                            </div>
                        </div>
                        <div className="space-y-4 border-l md:pl-6 border-white/5">
                            <div className="space-y-1.5">
                                <Label className="text-[10px] text-gray-500 uppercase">github_url</Label>
                                <Input value={form.github} onChange={e => setForm({ ...form, github: e.target.value })} className="bg-[#0a0a0a] border-white/5 h-10 text-[13px] rounded" placeholder='"https://..."' />
                            </div>
                            <div className="space-y-1.5">
                                <Label className="text-[10px] text-gray-500 uppercase">linkedin_url</Label>
                                <Input value={form.linkedin} onChange={e => setForm({ ...form, linkedin: e.target.value })} className="bg-[#0a0a0a] border-white/5 h-10 text-[13px] rounded" placeholder='"https://..."' />
                            </div>
                            <div className="mt-4 pt-4 border-t border-white/5">
                                <Button type="submit" disabled={loading} className="w-full bg-[#ce412b] hover:bg-[#a6301e] text-white font-black text-xs h-11 uppercase group tracking-[0.2em]">
                                    {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <>Cargo build --profile</>}
                                </Button>
                            </div>
                        </div>
                    </form>
                </div>
            </Card>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {members.map((member: any) => (
                    <motion.div
                        key={member.id}
                        layout
                        className="group bg-[#111111] border border-white/5 rounded-lg overflow-hidden hover:border-[#ce412b]/30 transition-all p-1"
                    >
                        <div className="bg-[#0a0a0a] rounded flex items-center p-4 gap-4 relative">
                            <Button
                                onClick={() => onDelete(member.id)}
                                variant="ghost" size="icon" className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 text-red-500 h-7 w-7 rounded bg-red-500/10"
                            >
                                <Trash2 className="w-3.5 h-3.5" />
                            </Button>
                            <Avatar className="rounded-lg border border-[#ce412b]/20 h-12 w-12">
                                <AvatarImage src={member.image} />
                                <AvatarFallback className="bg-[#151515] text-[#ce412b]">{member.name[0]}</AvatarFallback>
                            </Avatar>
                            <div className="flex-1 min-w-0">
                                <h4 className="text-xs font-black text-white uppercase tracking-wider truncate">{member.name}</h4>
                                <p className="text-[10px] text-[#ce412b] font-bold tracking-widest mt-0.5 truncate uppercase">{member.role}</p>
                                <div className="flex gap-2 mt-2">
                                    {member.github && <Github className="w-3 h-3 text-gray-600" />}
                                    {member.linkedin && <Linkedin className="w-3 h-3 text-gray-600" />}
                                </div>
                            </div>
                        </div>
                    </motion.div>
                ))}
            </div>
        </div>
    );
};

const AdvisoryTab = ({ advisors, form, setForm, fileRef, onDelete, fetchData, token, loading }: any) => {
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!token) return;
        const submitFn = async () => {
            let imageUrl = form.image;
            if (fileRef.current?.files?.[0]) imageUrl = await uploadImage(fileRef.current.files[0]);
            await api.createAdvisory({ ...form, image: imageUrl }, token);
            setForm({ name: '', role: '', image: '', github: '', linkedin: '', discord: '' });
            if (fileRef.current) fileRef.current.value = '';
            fetchData();
        };
        toast.promise(submitFn(), {
            loading: 'Allocating memory for advisor...',
            success: 'Module successfully loaded',
            error: 'Compilation error'
        });
    };

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            <Card className="bg-[#111111] border-[#ce412b]/20 overflow-hidden">
                <ModuleHeader title="Allocate_Advisor.rs" icon={Plus} />
                <div className="p-6">
                    <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-4">
                            <div className="space-y-1.5">
                                <Label className="text-[10px] text-gray-500 uppercase"><span className="text-[#ce412b]">let</span> advisor_name: <span className="text-blue-400">String</span></Label>
                                <Input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} className="bg-[#0a0a0a] border-white/5 focus-visible:border-[#ce412b]/50 h-10 text-[13px] rounded" placeholder='"Dr. Rustacean"' required />
                            </div>
                            <div className="space-y-1.5">
                                <Label className="text-[10px] text-gray-500 uppercase"><span className="text-[#ce412b]">let</span> expertise: <span className="text-blue-400">String</span></Label>
                                <Input value={form.role} onChange={e => setForm({ ...form, role: e.target.value })} className="bg-[#0a0a0a] border-white/5 focus-visible:border-[#ce412b]/50 h-10 text-[13px] rounded" placeholder='"Systems Engineering"' required />
                            </div>
                            <div className="space-y-1.5">
                                <Label className="text-[10px] text-gray-500 uppercase">profile_image</Label>
                                <Input ref={fileRef} type="file" className="bg-[#0a0a0a] border-white/5 file:bg-[#ce412b] file:text-white file:border-0 h-10" required={!form.image} />
                            </div>
                        </div>
                        <div className="space-y-4 border-l md:pl-6 border-white/5">
                            <div className="space-y-1.5">
                                <Label className="text-[10px] text-gray-500 uppercase">linkedin_url</Label>
                                <Input value={form.linkedin} onChange={e => setForm({ ...form, linkedin: e.target.value })} className="bg-[#0a0a0a] border-white/5 h-10 text-[13px] rounded" placeholder='"https://..."' />
                            </div>
                            <div className="mt-4 pt-4 border-t border-white/5">
                                <Button type="submit" disabled={loading} className="w-full bg-[#ce412b] hover:bg-[#a6301e] text-white font-black text-xs h-11 uppercase group tracking-[0.2em]">
                                    Cargo build --advisor
                                </Button>
                            </div>
                        </div>
                    </form>
                </div>
            </Card>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {advisors.map((member: any) => (
                    <motion.div
                        key={member.id}
                        layout
                        className="group bg-[#111111] border border-white/5 rounded-lg overflow-hidden hover:border-[#ce412b]/30 transition-all p-1"
                    >
                        <div className="bg-[#0a0a0a] rounded flex items-center p-4 gap-4 relative">
                            <Button
                                onClick={() => onDelete(member.id)}
                                variant="ghost" size="icon" className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 text-red-500 h-7 w-7 rounded bg-red-500/10"
                            >
                                <Trash2 className="w-3.5 h-3.5" />
                            </Button>
                            <Avatar className="rounded-lg border border-[#ce412b]/20 h-12 w-12">
                                <AvatarImage src={member.image} />
                                <AvatarFallback>{member.name[0]}</AvatarFallback>
                            </Avatar>
                            <div className="flex-1 min-w-0">
                                <h4 className="text-xs font-black text-white uppercase tracking-wider truncate">{member.name}</h4>
                                <p className="text-[10px] text-[#ce412b] font-bold tracking-widest mt-0.5 truncate uppercase">{member.role}</p>
                            </div>
                        </div>
                    </motion.div>
                ))}
            </div>
        </div>
    );
};

const EventsTab = ({ events, form, setForm, fileRef, onDelete, fetchData, token, loading }: any) => {
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!token) return;
        const submitFn = async () => {
            let imageUrl = form.image;
            if (fileRef.current?.files?.[0]) imageUrl = await uploadImage(fileRef.current.files[0]);
            const tagsArray = form.tags.split(',').map((tag: string) => tag.trim()).filter((tag: string) => tag !== '');
            await api.createEvent({ ...form, image: imageUrl, tags: tagsArray }, token);
            setForm({ title: '', description: '', date: '', location: '', time: '', image: '', tags: '', status: 'UPCOMING' });
            if (fileRef.current) fileRef.current.value = '';
            fetchData();
        };
        toast.promise(submitFn(), {
            loading: 'Compiling event module...',
            success: 'Event deployed to pipeline',
            error: 'Runtime error'
        });
    };

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            <Card className="bg-[#111111] border-[#ce412b]/20 overflow-hidden">
                <ModuleHeader title="Event_Registration_System.rs" icon={Calendar} />
                <div className="p-6">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-4">
                                <div className="space-y-1.5">
                                    <Label className="text-[10px] text-gray-500 uppercase">event_title</Label>
                                    <Input value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} className="bg-[#0a0a0a] border-white/5 h-10 text-[13px] rounded" placeholder='"Rust Workshop"' required />
                                </div>
                                <div className="space-y-1.5">
                                    <Label className="text-[10px] text-gray-500 uppercase">description: <span className="text-blue-400">&str</span></Label>
                                    <Textarea value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} className="bg-[#0a0a0a] border-white/5 text-[13px] rounded min-h-[100px]" placeholder='"Details about the cargo run..."' required />
                                </div>
                            </div>
                            <div className="space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-1.5">
                                        <Label className="text-[10px] text-gray-500 uppercase">date</Label>
                                        <Input value={form.date} onChange={e => setForm({ ...form, date: e.target.value })} className="bg-[#0a0a0a] border-white/5 h-10 text-[13px] rounded" placeholder='"Nov 20"' required />
                                    </div>
                                    <div className="space-y-1.5">
                                        <Label className="text-[10px] text-gray-500 uppercase">time</Label>
                                        <Input value={form.time} onChange={e => setForm({ ...form, time: e.target.value })} className="bg-[#0a0a0a] border-white/5 h-10 text-[13px] rounded" placeholder='"10:00 AM"' required />
                                    </div>
                                </div>
                                <div className="space-y-1.5">
                                    <Label className="text-[10px] text-gray-500 uppercase">location</Label>
                                    <Input value={form.location} onChange={e => setForm({ ...form, location: e.target.value })} className="bg-[#0a0a0a] border-white/5 h-10 text-[13px] rounded" placeholder='"Block 4"' required />
                                </div>
                                <div className="space-y-1.5">
                                    <Label className="text-[10px] text-gray-500 uppercase">status: <span className="text-[#ce412b]">Enum</span></Label>
                                    <select
                                        value={form.status}
                                        onChange={e => setForm({ ...form, status: e.target.value })}
                                        className="w-full bg-[#0a0a0a] border border-white/5 rounded h-10 text-xs px-3 focus:border-[#ce412b]/50 outline-none transition-all"
                                    >
                                        <option value="UPCOMING">Upcoming</option>
                                        <option value="LIVE">Live Now</option>
                                        <option value="COMPLETED">Archived</option>
                                    </select>
                                </div>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-6 border-t border-white/5">
                            <div className="space-y-1.5">
                                <Label className="text-[10px] text-gray-500 uppercase">poster_image</Label>
                                <Input ref={fileRef} type="file" className="bg-[#0a0a0a] border-white/5 file:bg-[#ce412b] file:text-white file:border-0 h-10 rounded" required={!form.image} />
                            </div>
                            <div className="flex items-end">
                                <Button type="submit" disabled={loading} className="w-full bg-[#ce412b] hover:bg-[#a6301e] text-white font-black text-xs h-10 uppercase tracking-[0.2em]">
                                    Cargo run ::deploy_event
                                </Button>
                            </div>
                        </div>
                    </form>
                </div>
            </Card>

            <div className="space-y-4">
                {events.map((event: any) => (
                    <div key={event.id} className="bg-[#111111] border border-white/5 rounded-lg p-5 flex items-start gap-4 hover:border-[#ce412b]/30 transition-all group">
                        <div className="w-20 h-20 bg-[#0a0a0a] border border-white/5 rounded-lg overflow-hidden shrink-0">
                            <img src={event.image} alt="" className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity" />
                        </div>
                        <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                                <h4 className="text-white font-black text-xs uppercase tracking-wider truncate">{event.title}</h4>
                                <span className={cn(
                                    "text-[9px] font-black px-2 py-0.5 rounded uppercase border",
                                    event.status === 'LIVE' ? "bg-green-500/10 border-green-500/30 text-green-500" : "bg-blue-500/10 border-blue-500/30 text-blue-500"
                                )}>{event.status}</span>
                            </div>
                            <p className="text-[11px] text-gray-500 line-clamp-2 mt-1">{event.description}</p>
                            <div className="flex gap-4 mt-3 text-[10px] font-bold text-[#ce412b]/60 uppercase tracking-widest">
                                <span className="flex items-center gap-1.5"><Calendar className="w-3 h-3" /> {event.date}</span>
                                <span className="flex items-center gap-1.5"><MapPin className="w-3 h-3" /> {event.location}</span>
                            </div>
                        </div>
                        <Button
                            onClick={() => onDelete(event.id)}
                            variant="ghost" size="icon" className="opacity-0 group-hover:opacity-100 text-red-500 bg-red-500/10 rounded h-8 w-8"
                        >
                            <Trash2 className="w-4 h-4" />
                        </Button>
                    </div>
                ))}
            </div>
        </div>
    );
};

const ContactsTab = ({ contacts, onDelete }: any) => (
    <div className="space-y-6 animate-in fade-in duration-500">
        <div className="grid gap-4">
            {contacts.map((contact: any) => (
                <div key={contact.id} className="bg-[#111111] border border-[#ce412b]/20 rounded-lg overflow-hidden flex flex-col hover:shadow-2xl hover:shadow-[#ce412b]/5 transition-all">
                    <div className="bg-[#ce412b]/5 px-4 py-2 border-b border-[#ce412b]/10 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <span className="text-[10px] font-black text-[#ce412b] tracking-widest uppercase flex items-center gap-1.5">
                                <ChevronRight className="w-3 h-3" /> Entry_0{contact.id.slice(-3)}
                            </span>
                            <span className="text-[9px] text-[#ce412b]/40 font-bold px-1.5 bg-[#ce412b]/10 rounded border border-[#ce412b]/10">TIMESTAMP: {new Date(contact.createdAt).getTime()}</span>
                        </div>
                        <Button
                            onClick={() => onDelete(contact.id)}
                            variant="ghost" size="icon" className="text-red-500 hover:bg-red-500/10 h-7 w-7 rounded"
                        >
                            <Trash2 className="w-3.5 h-3.5" />
                        </Button>
                    </div>
                    <div className="p-5 flex flex-col md:flex-row gap-6 md:items-center">
                        <div className="flex items-center gap-4 min-w-[200px]">
                            <div className="w-10 h-10 rounded bg-[#ce412b]/10 flex items-center justify-center border border-[#ce412b]/20">
                                <span className="text-[#ce412b] font-black">{contact.name[0]}</span>
                            </div>
                            <div>
                                <h4 className="text-sm font-black text-white uppercase tracking-tight">{contact.name}</h4>
                                <code className="text-[11px] text-[#ce412b] font-bold mt-0.5">{contact.rollnumber}</code>
                            </div>
                        </div>

                        <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-4 border-l md:pl-6 border-white/5">
                            <div className="space-y-0.5">
                                <p className="text-[9px] text-gray-600 uppercase font-black tracking-widest">Buffer_Data::Email</p>
                                <a href={`mailto:${contact.email}`} className="text-xs text-blue-400 hover:underline font-bold truncate block">{contact.email}</a>
                            </div>
                            <div className="space-y-0.5">
                                <p className="text-[9px] text-gray-600 uppercase font-black tracking-widest">Buffer_Data::Phone</p>
                                <p className="text-xs text-emerald-400 font-bold">{contact.phone}</p>
                            </div>
                        </div>

                        <div className="text-right">
                            <span className="text-[9px] font-black text-white/20 uppercase tracking-[0.2em]">{new Date(contact.createdAt).toLocaleDateString()}</span>
                        </div>
                    </div>
                    <div className="h-1 bg-[#ce412b]/5 w-full">
                        <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: '100%' }}
                            transition={{ duration: 1 }}
                            className="h-full bg-[#ce412b]/30"
                        />
                    </div>
                </div>
            ))}

            {contacts.length === 0 && (
                <div className="p-20 text-center border border-dashed border-white/5 rounded-2xl bg-white/[0.02]">
                    <Inbox className="w-12 h-12 text-gray-800 mx-auto mb-4" />
                    <p className="text-gray-600 font-bold uppercase tracking-widest text-xs">No logs found in persistent storage.</p>
                </div>
            )}
        </div>
    </div>
);

export default AdminPage;
