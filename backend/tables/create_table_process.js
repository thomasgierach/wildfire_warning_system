import { bad_addresses } from "./bad_addresses.js";
import { maps_lookup } from "./maps_lookup.js";

export async function create_table_process(pool) {
    //console.log("In create_table_process");
    await bad_addresses(pool);
    await maps_lookup(pool);

    return true;
}

