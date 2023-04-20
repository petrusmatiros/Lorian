const Database = require('better-sqlite3');
import { join } from 'path';
import { Event, Author, Spreadsheet, Guild } from './types';

const db = new Database('../data/data.db', { verbose: console.log });


function getAuthorById(id: string): Author | null {
    const stmt = db.prepare('SELECT * FROM authors WHERE id = ?');
    return stmt.get(id);
}

function getAuthorByRoleId(id: string): Author | null {
    const stmt = db.prepare('SELECT * FROM authors WHERE role_id = ?');
    return stmt.get(id);
}

