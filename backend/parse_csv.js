export function parseCSV(csv) {
    const [headerLine, ...rows] = csv.trim().split('\n');
    const headers = headerLine.split(',');
  
    return rows.map(row => {
      const values = row.split(',');
      return Object.fromEntries(
        headers.map((h, i) => [h, values[i]])
      );
    });
  }
