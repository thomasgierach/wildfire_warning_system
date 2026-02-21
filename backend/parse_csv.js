export function parseCSV(csv) {
    if (!csv.trim()) {
      return [];
    }
    const [headerLine, ...rows] = csv.trim().split('\n');
    const headers = headerLine.split(',');
  
    return rows.map(row => {
      const values = row.split(',');
      return Object.fromEntries(
        headers.map((h, i) => [h, values[i]])
      );
    });
  }
