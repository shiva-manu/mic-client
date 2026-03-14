import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '@/lib/supabase';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Skeleton } from '@/components/ui/skeleton';
import {
    ChevronUp,
    ChevronDown,
    Lightbulb,
    LogIn,
    LogOut,
    Send,
    TrendingUp,
    Clock,
    Flame,
    UserPlus,
    User as UserIcon,
    AlertCircle,
    CheckCircle2,
    Github,
    MessageSquare,
    ShieldCheck,
} from 'lucide-react';
import type { User } from '@supabase/supabase-js';
import { api } from '@/lib/api';

// ─── Types ───────────────────────────────────────────────────────
interface Idea {
    id: string;
    title: string;
    description: string;
    author_name: string;
    author_avatar: string | null;
    author_id: string;
    created_at: string;
    upvotes: number;
    downvotes: number;
    tags: string[];
    github_link?: string;
    board_response?: string;
}

interface Vote {
    idea_id: string;
    vote_type: 'up' | 'down';
}

type SortMode = 'hot' | 'new' | 'top';

// ─── Time Ago Helper ─────────────────────────────────────────────
const timeAgo = (date: string) => {
    const seconds = Math.floor((Date.now() - new Date(date).getTime()) / 1000);
    if (seconds < 60) return 'just now';
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h ago`;
    const days = Math.floor(hours / 24);
    if (days < 30) return `${days}d ago`;
    return new Date(date).toLocaleDateString();
};

const formatUrl = (url: string) => {
    if (!url) return null;
    let formattedUrl = url.trim();
    if (formattedUrl && !/^https?:\/\//i.test(formattedUrl)) {
        formattedUrl = `https://${formattedUrl}`;
    }
    return formattedUrl;
};

// ─── Skeleton Loader ─────────────────────────────────────────────
const IdeaSkeleton = () => (
    <Card className="bg-white/[0.02] border-white/10">
        <CardContent className="p-6">
            <div className="flex gap-4">
                <div className="flex flex-col items-center gap-1">
                    <Skeleton className="h-8 w-8 rounded-lg" />
                    <Skeleton className="h-5 w-6" />
                    <Skeleton className="h-8 w-8 rounded-lg" />
                </div>
                <div className="flex-1 space-y-3">
                    <Skeleton className="h-5 w-3/4" />
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-2/3" />
                    <div className="flex gap-2 mt-3">
                        <Skeleton className="h-5 w-16 rounded-full" />
                        <Skeleton className="h-5 w-20 rounded-full" />
                    </div>
                </div>
            </div>
        </CardContent>
    </Card>
);

// ═══════════════════════════════════════════════════════════════════
// Main Component
// ═══════════════════════════════════════════════════════════════════
const IdeasPage = () => {
    const [user, setUser] = useState<User | null>(null);
    const [ideas, setIdeas] = useState<Idea[]>([]);
    const [userVotes, setUserVotes] = useState<Vote[]>([]);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [showForm, setShowForm] = useState(false);
    const [sortMode, setSortMode] = useState<SortMode>('hot');
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [tagsInput, setTagsInput] = useState('');
    const [githubInput, setGithubInput] = useState('');

    // Board Member detection
    const [isBoardMember, setIsBoardMember] = useState(false);
    const [respondingToId, setRespondingToId] = useState<string | null>(null);
    const [boardResponseText, setBoardResponseText] = useState('');

    // Idea editing
    const [editingGithubId, setEditingGithubId] = useState<string | null>(null);
    const [editingGithubUrl, setEditingGithubUrl] = useState('');

    // Description expanding
    const [expandedIdeas, setExpandedIdeas] = useState<Set<string>>(new Set());

    // Auth state
    const [showAuth, setShowAuth] = useState(false);
    const [authMode, setAuthMode] = useState<'signin' | 'signup'>('signin');
    const [authEmail, setAuthEmail] = useState('');
    const [authPassword, setAuthPassword] = useState('');
    const [authName, setAuthName] = useState('');
    const [authLoading, setAuthLoading] = useState(false);
    const [authError, setAuthError] = useState('');
    const [authSuccess, setAuthSuccess] = useState('');
    const [votingIds, setVotingIds] = useState<Set<string>>(new Set());

    // ─── Auth listener ───────────────────────────────────────────
    useEffect(() => {
        supabase.auth.getSession().then(({ data: { session } }) => {
            setUser(session?.user ?? null);
        });

        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            setUser(session?.user ?? null);
        });

        return () => subscription.unsubscribe();
    }, []);

    // ─── Fetch ideas ─────────────────────────────────────────────
    const fetchIdeas = useCallback(async () => {
        try {
            const { data, error } = await supabase
                .from('ideas')
                .select('*')
                .order('created_at', { ascending: false });

            if (error) throw error;
            setIdeas(data || []);
        } catch (err) {
            console.error('Error fetching ideas:', err);
        } finally {
            setLoading(false);
        }
    }, []);

    // ─── Fetch user votes ────────────────────────────────────────
    const fetchUserVotes = useCallback(async () => {
        if (!user) { setUserVotes([]); return; }
        try {
            const { data, error } = await supabase
                .from('idea_votes')
                .select('idea_id, vote_type')
                .eq('user_id', user.id);

            if (error) throw error;
            setUserVotes(data || []);
        } catch (err) {
            console.error('Error fetching votes:', err);
        }
    }, [user]);

    useEffect(() => { fetchIdeas(); }, [fetchIdeas]);
    useEffect(() => { fetchUserVotes(); }, [fetchUserVotes]);

    // Check if user is board member
    useEffect(() => {
        const checkBoardStatus = async () => {
            if (!user) {
                setIsBoardMember(false);
                return;
            }
            try {
                const boardMembers = await api.getBoardMembers();
                const userName = user.user_metadata?.full_name || user.user_metadata?.name || '';
                const isMember = boardMembers.some((m: any) =>
                    m.name.toLowerCase() === userName.toLowerCase() ||
                    (m.github && user.user_metadata?.user_name === m.github)
                );
                setIsBoardMember(isMember);
            } catch (err) {
                console.error('Error checking board status:', err);
            }
        };
        checkBoardStatus();
    }, [user]);

    // ─── Auth Methods ────────────────────────────────────────────
    const handleAuth = async (e: React.FormEvent) => {
        e.preventDefault();
        setAuthLoading(true);
        setAuthError('');
        setAuthSuccess('');

        try {
            if (authMode === 'signup') {
                const { error } = await supabase.auth.signUp({
                    email: authEmail,
                    password: authPassword,
                    options: {
                        data: { full_name: authName || authEmail.split('@')[0] },
                    },
                });
                if (error) throw error;
                setAuthSuccess('Account created! You can now sign in immediately.');
                setAuthMode('signin');
                setAuthPassword(''); // Clear password for security
            } else {
                const { error } = await supabase.auth.signInWithPassword({
                    email: authEmail,
                    password: authPassword,
                });
                if (error) throw error;
                setShowAuth(false);
                setAuthEmail('');
                setAuthPassword('');
                setAuthName('');
            }
        } catch (err: any) {
            setAuthError(err.message || 'Authentication failed');
        } finally {
            setAuthLoading(false);
        }
    };

    const signOut = async () => {
        await supabase.auth.signOut();
        setUser(null);
        setUserVotes([]);
    };

    // ─── Submit Idea ─────────────────────────────────────────────
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!user || !title.trim()) return;

        setSubmitting(true);
        try {
            const tags = tagsInput.split(',').map(t => t.trim()).filter(Boolean);
            const authorName = user.user_metadata?.full_name || user.user_metadata?.name || user.email?.split('@')[0] || 'Anonymous';
            const authorAvatar = user.user_metadata?.avatar_url || null;

            const { error } = await supabase.from('ideas').insert({
                title: title.trim(),
                description: description.trim(),
                author_name: authorName,
                author_avatar: authorAvatar,
                author_id: user.id,
                upvotes: 0,
                downvotes: 0,
                tags,
                github_link: formatUrl(githubInput),
            });

            if (error) throw error;

            setTitle('');
            setDescription('');
            setTagsInput('');
            setGithubInput('');
            setShowForm(false);
            await fetchIdeas();
        } catch (err) {
            console.error('Error submitting idea:', err);
            alert('Failed to submit idea. Please try again.');
        } finally {
            setSubmitting(false);
        }
    };

    // ─── Vote ────────────────────────────────────────────────────
    const handleVote = async (ideaId: string, voteType: 'up' | 'down') => {
        if (!user) return;

        // Prevent concurrent votes on the same idea
        if (votingIds.has(ideaId)) return;
        setVotingIds(prev => new Set(prev).add(ideaId));

        const existingVote = userVotes.find(v => v.idea_id === ideaId);

        // Optimistic UI update
        setIdeas(prev => prev.map(idea => {
            if (idea.id !== ideaId) return idea;
            if (existingVote) {
                if (existingVote.vote_type === voteType) {
                    // Removing vote
                    return voteType === 'up'
                        ? { ...idea, upvotes: Math.max(0, idea.upvotes - 1) }
                        : { ...idea, downvotes: Math.max(0, idea.downvotes - 1) };
                } else {
                    // Switching vote
                    return voteType === 'up'
                        ? { ...idea, upvotes: idea.upvotes + 1, downvotes: Math.max(0, idea.downvotes - 1) }
                        : { ...idea, downvotes: idea.downvotes + 1, upvotes: Math.max(0, idea.upvotes - 1) };
                }
            } else {
                // New vote
                return voteType === 'up'
                    ? { ...idea, upvotes: idea.upvotes + 1 }
                    : { ...idea, downvotes: idea.downvotes + 1 };
            }
        }));

        // Optimistic votes update
        setUserVotes(prev => {
            if (existingVote) {
                if (existingVote.vote_type === voteType) {
                    return prev.filter(v => v.idea_id !== ideaId);
                } else {
                    return prev.map(v => v.idea_id === ideaId ? { ...v, vote_type: voteType } : v);
                }
            } else {
                return [...prev, { idea_id: ideaId, vote_type: voteType }];
            }
        });

        try {
            if (existingVote) {
                if (existingVote.vote_type === voteType) {
                    // Remove vote from DB
                    await supabase.from('idea_votes').delete()
                        .eq('user_id', user.id)
                        .eq('idea_id', ideaId);
                } else {
                    // Switch vote in DB
                    await supabase.from('idea_votes').update({ vote_type: voteType })
                        .eq('user_id', user.id)
                        .eq('idea_id', ideaId);
                }
            } else {
                // Insert new vote
                await supabase.from('idea_votes').insert({
                    user_id: user.id,
                    idea_id: ideaId,
                    vote_type: voteType,
                });
            }

            // Recalculate the true count from votes table
            const { count: upCount } = await supabase
                .from('idea_votes')
                .select('*', { count: 'exact', head: true })
                .eq('idea_id', ideaId)
                .eq('vote_type', 'up');

            const { count: downCount } = await supabase
                .from('idea_votes')
                .select('*', { count: 'exact', head: true })
                .eq('idea_id', ideaId)
                .eq('vote_type', 'down');

            // Update idea with accurate counts
            await supabase.from('ideas').update({
                upvotes: upCount ?? 0,
                downvotes: downCount ?? 0,
            }).eq('id', ideaId);

            // Update local state with accurate counts
            setIdeas(prev => prev.map(idea =>
                idea.id === ideaId
                    ? { ...idea, upvotes: upCount ?? 0, downvotes: downCount ?? 0 }
                    : idea
            ));
        } catch (err) {
            console.error('Error voting:', err);
            // Revert on error
            await fetchIdeas();
            await fetchUserVotes();
        } finally {
            setVotingIds(prev => {
                const next = new Set(prev);
                next.delete(ideaId);
                return next;
            });
        }
    };

    // ─── Board Response ──────────────────────────────
    const handleBoardResponse = async (ideaId: string) => {
        if (!isBoardMember || !boardResponseText.trim()) return;

        try {
            const { error } = await supabase
                .from('ideas')
                .update({ board_response: boardResponseText.trim() })
                .eq('id', ideaId);

            if (error) throw error;

            setBoardResponseText('');
            setRespondingToId(null);
            await fetchIdeas();
        } catch (err) {
            console.error('Error adding board response:', err);
            alert('Failed to add response.');
        }
    };

    // ─── Update Github Link ─────────────────────────────────────
    const handleUpdateGithub = async (ideaId: string) => {
        try {
            const { error } = await supabase
                .from('ideas')
                .update({ github_link: formatUrl(editingGithubUrl) })
                .eq('id', ideaId);

            if (error) throw error;

            setEditingGithubId(null);
            setEditingGithubUrl('');
            await fetchIdeas();
        } catch (err) {
            console.error('Error updating github link:', err);
            alert('Failed to update repository link.');
        }
    };

    // ─── Sort Ideas ──────────────────────────────────────────────
    const sortedIdeas = [...ideas].sort((a, b) => {
        switch (sortMode) {
            case 'top':
                return (b.upvotes - b.downvotes) - (a.upvotes - a.downvotes);
            case 'new':
                return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
            case 'hot': {
                const scoreA = (a.upvotes - a.downvotes);
                const scoreB = (b.upvotes - b.downvotes);
                const ageA = (Date.now() - new Date(a.created_at).getTime()) / 3600000;
                const ageB = (Date.now() - new Date(b.created_at).getTime()) / 3600000;
                return (scoreB / Math.pow(ageB + 2, 1.5)) - (scoreA / Math.pow(ageA + 2, 1.5));
            }
            default: return 0;
        }
    });

    // ═════════════════════════════════════════════════════════════
    // Render
    // ═════════════════════════════════════════════════════════════
    return (
        <div className="pt-28 pb-16 min-h-screen relative overflow-hidden bg-transparent text-white">
            {/* Background effects — matches BoardPage */}
            <div className="absolute inset-0 z-0 bg-[linear-gradient(to_right,#8080801a_1px,transparent_1px),linear-gradient(to_bottom,#8080801a_1px,transparent_1px)] bg-[size:24px_24px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] pointer-events-none" />
            <div className="absolute top-[-5%] left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-primary/20 opacity-40 blur-[100px] rounded-full z-0 pointer-events-none" />

            <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* ─── Header ──────────────────────────────────── */}
                <motion.div
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="mb-4"
                >
                    <p className="text-xs font-medium text-primary mb-2 uppercase tracking-wider">Community</p>
                    <h1 className="text-3xl sm:text-5xl font-bold tracking-tight mb-3">Idea Board</h1>
                    <p className="text-muted-foreground max-w-lg">
                        Share your project ideas, workshop proposals, or anything that could make MIC better.
                    </p>
                </motion.div>

                {/* ─── Auth Bar (compact inline) ──────────────── */}
                <AnimatePresence>
                    {!user && showAuth && (
                        <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            transition={{ duration: 0.25 }}
                            className="overflow-hidden mb-4"
                        >
                            <div className="rounded-2xl border border-border/50 bg-card/50 backdrop-blur-xl p-4">
                                {authError && (
                                    <div className="flex items-center gap-2 p-2.5 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-xs mb-3">
                                        <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                                        {authError}
                                    </div>
                                )}
                                {authSuccess && (
                                    <div className="flex items-center gap-2 p-2.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs mb-3">
                                        <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                                        {authSuccess}
                                    </div>
                                )}
                                <form onSubmit={handleAuth} className="flex flex-wrap items-end gap-3">
                                    {authMode === 'signup' && (
                                        <div className="flex-1 min-w-[140px]">
                                            <label className="text-[11px] text-muted-foreground mb-1 block">Name</label>
                                            <Input
                                                value={authName}
                                                onChange={e => setAuthName(e.target.value)}
                                                placeholder="Your name"
                                                className="bg-white/5 border-white/10 h-9 rounded-lg text-sm placeholder:text-muted-foreground/40"
                                            />
                                        </div>
                                    )}
                                    <div className="flex-1 min-w-[180px]">
                                        <label className="text-[11px] text-muted-foreground mb-1 block">Email</label>
                                        <Input
                                            type="email"
                                            value={authEmail}
                                            onChange={e => setAuthEmail(e.target.value)}
                                            placeholder="you@example.com"
                                            required
                                            className="bg-white/5 border-white/10 h-9 rounded-lg text-sm placeholder:text-muted-foreground/40"
                                        />
                                    </div>
                                    <div className="flex-1 min-w-[160px]">
                                        <label className="text-[11px] text-muted-foreground mb-1 block">Password</label>
                                        <Input
                                            type="password"
                                            value={authPassword}
                                            onChange={e => setAuthPassword(e.target.value)}
                                            placeholder={authMode === 'signup' ? 'Min 6 chars' : '••••••••'}
                                            required
                                            minLength={6}
                                            className="bg-white/5 border-white/10 h-9 rounded-lg text-sm placeholder:text-muted-foreground/40"
                                        />
                                    </div>
                                    <Button
                                        type="submit"
                                        disabled={authLoading}
                                        size="sm"
                                        className="bg-primary hover:bg-primary/90 text-white font-medium rounded-lg h-9 px-4 text-xs gap-1.5"
                                    >
                                        {authLoading ? (
                                            <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                        ) : authMode === 'signin' ? (
                                            <LogIn className="w-3.5 h-3.5" />
                                        ) : (
                                            <UserPlus className="w-3.5 h-3.5" />
                                        )}
                                        {authMode === 'signin' ? 'Sign In' : 'Sign Up'}
                                    </Button>
                                </form>
                                <div className="mt-2 flex items-center justify-between">
                                    <button
                                        type="button"
                                        onClick={() => { setAuthMode(authMode === 'signin' ? 'signup' : 'signin'); setAuthError(''); setAuthSuccess(''); }}
                                        className="text-[11px] text-primary/70 hover:text-primary transition-colors"
                                    >
                                        {authMode === 'signin' ? "Don't have an account? Sign up" : 'Already have an account? Sign in'}
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setShowAuth(false)}
                                        className="text-[11px] text-muted-foreground hover:text-foreground transition-colors"
                                    >
                                        Cancel
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* ─── Controls Bar ────────────────────────────── */}
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1, duration: 0.4 }}
                    className="flex items-center justify-between gap-3 mb-5"
                >
                    {/* Sort Tabs */}
                    <div className="flex items-center gap-1 p-1 rounded-xl bg-white/[0.03] border border-white/10">
                        {([
                            { key: 'hot' as SortMode, icon: Flame, label: 'Hot' },
                            { key: 'new' as SortMode, icon: Clock, label: 'New' },
                            { key: 'top' as SortMode, icon: TrendingUp, label: 'Top' },
                        ]).map(s => (
                            <button
                                key={s.key}
                                onClick={() => setSortMode(s.key)}
                                className={cn(
                                    "flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all",
                                    sortMode === s.key
                                        ? "bg-white/10 text-white shadow-sm"
                                        : "text-muted-foreground hover:text-white"
                                )}
                            >
                                <s.icon className="w-3.5 h-3.5" /> {s.label}
                            </button>
                        ))}
                    </div>

                    {/* Right controls */}
                    <div className="flex items-center gap-2">
                        {user ? (
                            <>
                                <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-white/5 border border-white/10 text-xs text-muted-foreground">
                                    <div className="w-5 h-5 rounded-full bg-primary/20 flex items-center justify-center">
                                        <UserIcon className="w-3 h-3 text-primary" />
                                    </div>
                                    <span className="truncate max-w-[100px] font-medium">
                                        {user.user_metadata?.full_name || user.email?.split('@')[0]}
                                    </span>
                                    <button onClick={signOut} className="text-muted-foreground/50 hover:text-red-400 ml-1 transition-colors" title="Sign out">
                                        <LogOut className="w-3 h-3" />
                                    </button>
                                </div>
                                <Button
                                    size="sm"
                                    onClick={() => setShowForm(!showForm)}
                                    className="bg-primary hover:bg-primary/90 text-white font-semibold rounded-xl h-9 px-4 text-xs gap-1.5"
                                >
                                    <Lightbulb className="w-4 h-4" />
                                    {showForm ? 'Cancel' : 'Share Idea'}
                                </Button>
                            </>
                        ) : (
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => { setShowAuth(!showAuth); setAuthError(''); setAuthSuccess(''); }}
                                className="text-xs gap-1.5 rounded-xl border-primary/30 bg-primary/5 hover:bg-primary/10 text-primary h-9"
                            >
                                <LogIn className="w-3.5 h-3.5" /> Sign in to post
                            </Button>
                        )}
                    </div>
                </motion.div>

                {/* ─── New Idea Form ──────────────────────────── */}
                <AnimatePresence>
                    {showForm && user && (
                        <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            transition={{ duration: 0.3 }}
                            className="overflow-hidden mb-5"
                        >
                            <div className="rounded-2xl border border-border/50 bg-card/50 backdrop-blur-xl p-5">
                                <form onSubmit={handleSubmit} className="space-y-3">
                                    <Input
                                        value={title}
                                        onChange={e => setTitle(e.target.value)}
                                        placeholder="Your idea in a sentence..."
                                        required
                                        className="bg-white/5 border-white/10 text-base font-medium placeholder:text-muted-foreground/50 h-11 rounded-xl"
                                    />
                                    <Textarea
                                        value={description}
                                        onChange={e => setDescription(e.target.value)}
                                        placeholder="Describe your idea in detail..."
                                        rows={3}
                                        className="bg-white/5 border-white/10 placeholder:text-muted-foreground/50 rounded-xl resize-none"
                                    />
                                    <div className="flex gap-3">
                                        <Input
                                            value={tagsInput}
                                            onChange={e => setTagsInput(e.target.value)}
                                            placeholder="Tags: AI, Workshop, Project"
                                            className="bg-white/5 border-white/10 placeholder:text-muted-foreground/50 rounded-xl flex-1"
                                        />
                                    </div>
                                    <div className="flex gap-3">
                                        <div className="relative flex-1">
                                            <Github className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                                            <Input
                                                value={githubInput}
                                                onChange={e => setGithubInput(e.target.value)}
                                                placeholder="GitHub Repository URL (optional)"
                                                className="bg-white/5 border-white/10 placeholder:text-muted-foreground/50 rounded-xl pl-10"
                                            />
                                        </div>
                                        <Button
                                            type="submit"
                                            disabled={submitting || !title.trim()}
                                            className="bg-primary hover:bg-primary/90 text-white font-semibold rounded-xl h-10 px-5 text-sm gap-2"
                                        >
                                            {submitting ? (
                                                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                            ) : (
                                                <Send className="w-4 h-4" />
                                            )}
                                            {submitting ? 'Posting...' : 'Post'}
                                        </Button>
                                    </div>
                                </form>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* ─── Ideas List ─────────────────────────────── */}
                <div className="space-y-3">
                    {loading ? (
                        <>
                            <IdeaSkeleton />
                            <IdeaSkeleton />
                            <IdeaSkeleton />
                        </>
                    ) : sortedIdeas.length === 0 ? (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="py-20 text-center"
                        >
                            <div className="w-16 h-16 rounded-2xl bg-secondary/30 flex items-center justify-center mx-auto mb-4">
                                <Lightbulb className="w-8 h-8 text-muted-foreground" />
                            </div>
                            <h3 className="text-xl font-semibold mb-2">No ideas yet</h3>
                            <p className="text-muted-foreground max-w-xs mx-auto">
                                Be the first to share an idea! Sign in and start a conversation.
                            </p>
                        </motion.div>
                    ) : (
                        sortedIdeas.map((idea, idx) => {
                            const currentVote = userVotes.find(v => v.idea_id === idea.id);
                            const score = idea.upvotes - idea.downvotes;

                            return (
                                <motion.div
                                    key={idea.id}
                                    initial={{ opacity: 0, y: 12 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: idx * 0.04, duration: 0.35 }}
                                >
                                    <Card className="group bg-card/50 border-border/50 hover:bg-card/80 hover:border-border transition-all duration-300">
                                        <CardContent className="p-4 sm:p-5">
                                            <div className="flex gap-3 sm:gap-4">
                                                {/* Vote Column */}
                                                <div className="flex flex-col items-center gap-0.5 pt-0.5">
                                                    <button
                                                        onClick={() => handleVote(idea.id, 'up')}
                                                        disabled={!user || votingIds.has(idea.id)}
                                                        className={cn(
                                                            "p-1.5 rounded-lg transition-all hover:scale-110",
                                                            currentVote?.vote_type === 'up'
                                                                ? "bg-primary/20 text-primary"
                                                                : "text-muted-foreground hover:text-primary hover:bg-primary/10",
                                                            (!user || votingIds.has(idea.id)) && "opacity-40 cursor-not-allowed hover:scale-100"
                                                        )}
                                                        title={!user ? "Sign in to vote" : "Upvote"}
                                                    >
                                                        <ChevronUp className="w-5 h-5" />
                                                    </button>
                                                    <span className={cn(
                                                        "text-sm font-bold min-w-[20px] text-center tabular-nums",
                                                        score > 0 ? "text-primary" : score < 0 ? "text-red-400" : "text-muted-foreground"
                                                    )}>
                                                        {score}
                                                    </span>
                                                    <button
                                                        onClick={() => handleVote(idea.id, 'down')}
                                                        disabled={!user || votingIds.has(idea.id)}
                                                        className={cn(
                                                            "p-1.5 rounded-lg transition-all hover:scale-110",
                                                            currentVote?.vote_type === 'down'
                                                                ? "bg-red-500/20 text-red-400"
                                                                : "text-muted-foreground hover:text-red-400 hover:bg-red-500/10",
                                                            (!user || votingIds.has(idea.id)) && "opacity-40 cursor-not-allowed hover:scale-100"
                                                        )}
                                                        title={!user ? "Sign in to vote" : "Downvote"}
                                                    >
                                                        <ChevronDown className="w-5 h-5" />
                                                    </button>
                                                </div>

                                                {/* Content */}
                                                <div className="flex-1 min-w-0">
                                                    <h3 className="font-bold text-lg text-foreground group-hover:text-primary transition-colors mb-2">
                                                        {idea.title}
                                                    </h3>
                                                    {idea.description && (
                                                        <div className="mb-4">
                                                            <p className={cn(
                                                                "text-base text-muted-foreground leading-relaxed",
                                                                !expandedIdeas.has(idea.id) && "line-clamp-4"
                                                            )}>
                                                                {idea.description}
                                                            </p>
                                                            {idea.description.length > 100 && (
                                                                <button
                                                                    onClick={() => {
                                                                        setExpandedIdeas(prev => {
                                                                            const next = new Set(prev);
                                                                            if (next.has(idea.id)) next.delete(idea.id);
                                                                            else next.add(idea.id);
                                                                            return next;
                                                                        });
                                                                    }}
                                                                    className="text-sm text-primary font-semibold hover:underline mt-2"
                                                                >
                                                                    {expandedIdeas.has(idea.id) ? 'Show less' : 'Read more'}
                                                                </button>
                                                            )}
                                                        </div>
                                                    )}

                                                    {/* GitHub Link Entry/Display */}
                                                    {editingGithubId === idea.id ? (
                                                        <div className="flex items-center gap-2 max-w-sm mb-4">
                                                            <div className="relative flex-1">
                                                                <Github className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
                                                                <Input
                                                                    value={editingGithubUrl}
                                                                    onChange={e => setEditingGithubUrl(e.target.value)}
                                                                    placeholder="Repository URL"
                                                                    className="bg-white/5 border-white/10 h-8 pl-9 text-xs rounded-lg"
                                                                />
                                                            </div>
                                                            <Button size="sm" onClick={() => handleUpdateGithub(idea.id)} className="h-8 text-[11px] bg-primary text-white rounded-lg px-3">Save</Button>
                                                            <Button size="sm" variant="ghost" onClick={() => { setEditingGithubId(null); setEditingGithubUrl(''); }} className="h-8 text-[11px] px-2 rounded-lg">Cancel</Button>
                                                        </div>
                                                    ) : (
                                                        idea.github_link ? (
                                                            <div className="flex items-center gap-2 mb-4">
                                                                <a href={idea.github_link} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-xs text-primary hover:bg-white/10 transition-colors font-medium">
                                                                    <Github className="w-3.5 h-3.5" />
                                                                    Project Repository
                                                                </a>
                                                                {user?.id === idea.author_id && (
                                                                    <button onClick={() => { setEditingGithubId(idea.id); setEditingGithubUrl(idea.github_link || ''); }} className="text-[10px] text-muted-foreground hover:text-white transition-colors uppercase tracking-wider font-bold px-2">Edit</button>
                                                                )}
                                                            </div>
                                                        ) : (
                                                            user?.id === idea.author_id && (
                                                                <button onClick={() => { setEditingGithubId(idea.id); setEditingGithubUrl(''); }} className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/5 border border-dashed border-white/20 text-[11px] font-medium text-muted-foreground hover:text-primary hover:border-primary/30 transition-colors mb-4">
                                                                    <Github className="w-3.5 h-3.5" />
                                                                    Add Repository Link
                                                                </button>
                                                            )
                                                        )
                                                    )}

                                                    {/* Board Response Display */}
                                                    {idea.board_response && (
                                                        <div className="relative p-4 rounded-xl bg-primary/5 border border-primary/20 mb-4 overflow-hidden group/response">
                                                            <div className="absolute top-0 right-0 p-2 opacity-10">
                                                                <ShieldCheck className="w-12 h-12 text-primary" />
                                                            </div>
                                                            <div className="flex items-center gap-2 mb-1.5">
                                                                <ShieldCheck className="w-3.5 h-3.5 text-primary" />
                                                                <span className="text-[10px] font-black uppercase tracking-widest text-primary">Official Response</span>
                                                            </div>
                                                            <p className="text-sm text-foreground/90 leading-relaxed italic">
                                                                "{idea.board_response}"
                                                            </p>
                                                        </div>
                                                    )}

                                                    {/* Tags */}
                                                    {idea.tags && idea.tags.length > 0 && (
                                                        <div className="flex flex-wrap gap-1.5 mb-3">
                                                            {idea.tags.map((tag, i) => (
                                                                <span
                                                                    key={i}
                                                                    className="px-2 py-0.5 rounded-full text-[11px] font-medium bg-primary/10 text-primary/80 border border-primary/10"
                                                                >
                                                                    {tag}
                                                                </span>
                                                            ))}
                                                        </div>
                                                    )}

                                                    {/* Meta */}
                                                    <div className="flex items-center gap-3 text-[11px] text-muted-foreground">
                                                        <div className="flex items-center gap-1.5">
                                                            <div className="w-4 h-4 rounded-full bg-primary/20 flex items-center justify-center">
                                                                <UserIcon className="w-2.5 h-2.5 text-primary" />
                                                            </div>
                                                            <span className="font-medium">{idea.author_name}</span>
                                                        </div>
                                                        <span className="opacity-30">·</span>
                                                        <span>{timeAgo(idea.created_at)}</span>
                                                        <span className="opacity-30">·</span>
                                                        <span className="flex items-center gap-0.5">
                                                            <ChevronUp className="w-3 h-3" />{idea.upvotes}
                                                        </span>
                                                        <span className="flex items-center gap-0.5">
                                                            <ChevronDown className="w-3 h-3" />{idea.downvotes}
                                                        </span>
                                                    </div>

                                                    {/* Board Responder Action */}
                                                    {isBoardMember && (
                                                        <div className="mt-4 pt-4 border-t border-white/5">
                                                            {respondingToId === idea.id ? (
                                                                <div className="space-y-3">
                                                                    <Textarea
                                                                        value={boardResponseText}
                                                                        onChange={e => setBoardResponseText(e.target.value)}
                                                                        placeholder="Add an official response..."
                                                                        className="bg-white/5 border-white/10 text-sm rounded-xl resize-none"
                                                                        rows={2}
                                                                    />
                                                                    <div className="flex gap-2">
                                                                        <Button
                                                                            size="sm"
                                                                            onClick={() => handleBoardResponse(idea.id)}
                                                                            className="h-8 text-[11px] bg-primary text-white"
                                                                        >
                                                                            Post Response
                                                                        </Button>
                                                                        <Button
                                                                            size="sm"
                                                                            variant="ghost"
                                                                            onClick={() => { setRespondingToId(null); setBoardResponseText(''); }}
                                                                            className="h-8 text-[11px]"
                                                                        >
                                                                            Cancel
                                                                        </Button>
                                                                    </div>
                                                                </div>
                                                            ) : (
                                                                <button
                                                                    onClick={() => {
                                                                        setRespondingToId(idea.id);
                                                                        setBoardResponseText(idea.board_response || '');
                                                                    }}
                                                                    className="flex items-center gap-1.5 text-[11px] font-bold text-primary/70 hover:text-primary uppercase tracking-wider transition-colors"
                                                                >
                                                                    <MessageSquare className="w-3.5 h-3.5" />
                                                                    {idea.board_response ? 'Clarify Response' : 'Official Response'}
                                                                </button>
                                                            )}
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>
                                </motion.div>
                            );
                        })
                    )}
                </div>
            </div>
        </div>
    );
};

export default IdeasPage;
