export interface IObjectdiff {
    compareObjects: (expected: {}, supplied: {}) => { required: any[]; supplied: any[]; error: any[] };
}

/**
 * Compares expected object keys and supplied keys. Returns truthy on pass and falsy on fail.
 *
 * On fail, the difference between object keys is returned.
 *
 */
export function compareObjects(expected: {}, supplied: {}) {
    if (!supplied) {
        return { error: [0] };
    }

    const [required, incoming, error] = [Object.keys(expected), Object.keys(supplied), []];

    for (const value of required) {
        const index = incoming.findIndex(a => a === value);

        if (index < 0) {
            error.push(value);
        } else {
            incoming.slice(index, 1);
        }
    }

    return { required, supplied: incoming, error };
}
