import { create_table } from './create_table.js';

export async function maps_lookup (pool) {
    //console.log("In maps_lookup");
    const st = `CREATE TABLE maps_lookup (
                m_pk SERIAL PRIMARY KEY, 
                search_term TEXT NOT NULL,
                google_address TEXT NOT NULL,
                northeast_lat NUMERIC(8,2),
                northeast_lng NUMERIC(8,3),
                southwest_lat NUMERIC(8,2)
                ,southwest_lng NUMERIC(8,3))`;
    await create_table(pool, "maps_lookup", st);
    return true;
}
