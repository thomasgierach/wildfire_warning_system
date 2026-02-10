
export async function create_table(pool, tablename, statement) {
    //console.log("In create_table.");
    try {
        //console.log("Checking existence");
        let res = await pool.query(
                        `
                        SELECT EXISTS (
                            SELECT FROM information_schema.tables 
                            WHERE table_schema = 'public'
                            AND table_name = $1
                        )
                        `,
                        [tablename]
                    );
        //console.log(res);
        const exists = res.rows[0].exists;
        //console.log(exists);
        if (!exists) {
            res = await pool.query(
                            `${statement}`
                        );
            console.log(`Table '${tablename}' created`);
        } else {
            console.log(`Table '${tablename}' already exists.`);
        }

        
        /*
        await pool.query(
          `${statement}`
        )
        */
        return true;
      } catch (error) {
        //console.log(error);
        console.error("Error creating table:", error);
        return false;
      }
}