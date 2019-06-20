import { readFileSync, unlinkSync } from 'fs';
import axios from 'axios';

export interface ICsvparser {
    parse: (filepath: string) => Promise<any[]>;
}

/**
 * Read csv file and convert to an array of objects
 *
 * @param {string} filePath - path to csv file
 */
export async function parse(filePath: string) {
    // Read CSV
    let csvdata: string = '';
    if (filePath.includes('http')) {
        csvdata = await axios.get(filePath).then(res => res.data);
    } else {
        csvdata = readFileSync(filePath, { encoding: 'utf-8' });
    }

    // Split on row
    const splittedrows = csvdata.split('\n');

    // Get first row for column headers
    const headers = splittedrows.shift().split(',');

    const data = [];
    splittedrows.forEach((d: string) => {
        // Loop through each row
        const tmp = {};
        const row = d.split(',');
        for (let i = 0; i < headers.length; i++) {
            if (headers[i] && row[i]) {
                tmp[headers[i].replace('\r', '').replace(' ', '')] = row[i].replace('\r', '').trim();
            }
        }
        if (Object.keys(tmp).length) {
            data.push(tmp);
        }
    });

    if (!filePath.includes('http')) {
        // delete the file from local disk
        unlinkSync(filePath);
    }

    return data;
}
