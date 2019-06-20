import xlsx from 'node-xlsx';
import { writeFileSync, mkdirSync } from 'fs';
import { join } from 'path';

export interface ISheetbuilder {
    /**
     * Build a worksheet, from an array of objects. Simply provide a worksheet name,
     * and an array of objects.
     *
     * Returns the path to the newly created file.
     *
     * @memberof ISheetbuilder
     */
    buildSheet: (sheetname: string, items: any[]) => string;
}

/**
 * Build a worksheet, from an array of objects. Simply provide a worksheet name,
 * and an array of objects
 *
 * @export
 * @param {string} sheetname - name of your work sheet
 * @param {any[]} items - an array of objects to build sheet from
 * @returns
 */
export function buildSheet(sheetname: string, items: any[]) {
    if (!items.length) {
        return '';
    }

    const rows = [...Array(items.length).keys()].map(a => a + 1);

    const headers = [];

    for (const key of Object.keys(items[0])) {
        headers.push(key.slice(0, 1).toUpperCase() + key.slice(1));
    }

    const dataRows = [];

    for (const value of items) {
        dataRows.push(Object.values(value));
    }

    const data = [/* rows, */ headers, ...dataRows];

    const [columnsWidth, rowsWidth] = [[], []];

    headers.forEach(() => {
        columnsWidth.push({ wpx: 150 });
        rowsWidth.push({ hpx: 60 });
    });

    const options = { '!cols': columnsWidth, '!rows': rowsWidth };

    const buffer = xlsx.build([{ name: sheetname, data }], options);

    mkdirSync(join(__dirname, '..', '..', `files6729gs`), { recursive: true });

    const path = join(__dirname, '..', '..', 'files6729gs', `${sheetname}.xlsx`);

    writeFileSync(path, buffer);

    return path;
}
