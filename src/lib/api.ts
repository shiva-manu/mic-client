const API_BASE_URL = "https://mic-server-60hf.onrender.com/api";

export const api = {
    // Auth
    login: async (data: any) => {
        console.log(`API: POST /auth/login`);
        try {
            const res = await fetch(`${API_BASE_URL}/auth/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data),
            });
            if (!res.ok) {
                const error = await res.json().catch(() => ({}));
                throw new Error(error.message || 'Login failed');
            }
            return res.json();
        } catch (e) {
            if (e instanceof TypeError && e.message === 'Failed to fetch') {
                throw new Error('Network error: Is the server running at ' + API_BASE_URL + '?');
            }
            throw e;
        }
    },
    signup: async (data: any) => {
        const res = await fetch(`${API_BASE_URL}/auth/signup`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data),
        });
        if (!res.ok) {
            const error = await res.json();
            throw new Error(error.message || 'Signup failed');
        }
        return res.json();
    },
    getMe: async (token: string) => {
        const res = await fetch(`${API_BASE_URL}/auth/me`, {
            headers: { 'Authorization': `Bearer ${token}` },
        });
        if (!res.ok) throw new Error('Failed to fetch user');
        return res.json();
    },

    // Board Members
    getBoardMembers: async () => {
        const res = await fetch(`${API_BASE_URL}/board-members`);
        if (!res.ok) throw new Error('Failed to fetch board members');
        return res.json();
    },
    createBoardMember: async (data: any, token: string) => {
        console.log(`API: POST /board-members`);
        try {
            const res = await fetch(`${API_BASE_URL}/board-members`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(data),
            });
            if (!res.ok) {
                const err = await res.json().catch(() => ({}));
                throw new Error(err.error || err.message || 'Failed to create board member');
            }
            return res.json();
        } catch (e) {
            if (e instanceof TypeError && e.message === 'Failed to fetch') {
                throw new Error('Network error: Is the server running at ' + API_BASE_URL + '?');
            }
            throw e;
        }
    },
    deleteBoardMember: async (id: string, token: string) => {
        const res = await fetch(`${API_BASE_URL}/board-members/${id}`, {
            method: 'DELETE',
            headers: { 'Authorization': `Bearer ${token}` },
        });
        if (!res.ok) throw new Error('Failed to delete board member');
        return res.json();
    },

    // Advisory
    getAdvisory: async () => {
        const res = await fetch(`${API_BASE_URL}/advisory`);
        if (!res.ok) throw new Error('Failed to fetch advisory');
        return res.json();
    },
    createAdvisory: async (data: any, token: string) => {
        console.log(`API: POST /advisory`);
        try {
            const res = await fetch(`${API_BASE_URL}/advisory`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(data),
            });
            if (!res.ok) {
                const err = await res.json().catch(() => ({}));
                throw new Error(err.error || err.message || 'Failed to create advisor');
            }
            return res.json();
        } catch (e) {
            if (e instanceof TypeError && e.message === 'Failed to fetch') {
                throw new Error('Network error: Is the server running at ' + API_BASE_URL + '?');
            }
            throw e;
        }
    },
    deleteAdvisory: async (id: string, token: string) => {
        const res = await fetch(`${API_BASE_URL}/advisory/${id}`, {
            method: 'DELETE',
            headers: { 'Authorization': `Bearer ${token}` },
        });
        if (!res.ok) throw new Error('Failed to delete advisor');
        return res.json();
    },

    // Events
    getEvents: async () => {
        const res = await fetch(`${API_BASE_URL}/events`);
        if (!res.ok) throw new Error('Failed to fetch events');
        return res.json();
    },
    createEvent: async (data: any, token: string) => {
        console.log(`API: POST /events`);
        try {
            const res = await fetch(`${API_BASE_URL}/events`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(data),
            });
            if (!res.ok) {
                const err = await res.json().catch(() => ({}));
                throw new Error(err.error || err.message || 'Failed to create event');
            }
            return res.json();
        } catch (e) {
            if (e instanceof TypeError && e.message === 'Failed to fetch') {
                throw new Error('Network error: Is the server running at ' + API_BASE_URL + '?');
            }
            throw e;
        }
    },
    deleteEvent: async (id: string, token: string) => {
        const res = await fetch(`${API_BASE_URL}/events/${id}`, {
            method: 'DELETE',
            headers: { 'Authorization': `Bearer ${token}` },
        });
        if (!res.ok) throw new Error('Failed to delete event');
        return res.json();
    },
};
