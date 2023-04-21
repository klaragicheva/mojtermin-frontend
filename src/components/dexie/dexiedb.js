import Dexie from 'dexie';

export const db = new Dexie('dexieDB');
db.version(1).stores({
    zdravstvenZavodData: '++id, naziv, lokacija',
});

export const db2 = new Dexie('dexieDB2');
db2.version(1).stores({
    zdravstvenZavodDataAddNew: '++id, naziv, lokacija',
});

// Dexie instance called dexiedb
// Define schema for a table called zdravstvenZavodData
// Primary key auto-incrementing
// Indexed props: naziv, lokacija