// We will create a bad_addresses table if it doesn't exist.
import { create_table } from './create_table.js';

export async function bad_addresses(pool) {
    //console.log("In bad_addresses");
    const st = `CREATE TABLE invalid_address_lookup (
                    search_term TEXT PRIMARY KEY,
                    rechecked_invalidness BOOLEAN NOT NULL DEFAULT FALSE
                );`
    await create_table(pool, "invalid_address_lookup", st);
    return true;
}