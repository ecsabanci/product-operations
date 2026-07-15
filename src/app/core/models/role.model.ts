export type Role = 'admin' | 'viewer';

const ADMIN_USERNAMES = new Set<string>(['emilys', 'michaelw']);

export function resolveRole(username: string): Role {
    return ADMIN_USERNAMES.has(username) ? 'admin' : 'viewer';
}