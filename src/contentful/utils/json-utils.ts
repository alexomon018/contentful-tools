type JSONValue = string | number | boolean | null | JSONObject | JSONArray;
interface JSONObject { [key: string]: JSONValue; }
interface JSONArray extends Array<JSONValue> {}

/**
 * Traverses a JSON object and calls the matchPredicate on each key-value pair.
 * @param obj - The JSON object to traverse.
 * @param matchPredicate - A function that takes a key and a value, and returns true if a match is found.
 * @returns An array of matching key-value pairs as tuples: [key, value].
 */
export function traverseJson(
    obj: JSONValue,
    matchPredicate: (key: string, value: JSONValue) => boolean
): JSONValue[] {
    const matches: JSONValue[] = [];

    function recurse(current: JSONValue): void {
        if (Array.isArray(current)) {
            for (const item of current) {
                recurse(item);
            }
        } else if (typeof current === 'object' && current !== null) {
            for (const [key, value] of Object.entries(current)) {
                if (matchPredicate(key, value)) {
                    matches.push(value);
                }
                recurse(value);
            }
        }
    }

    recurse(obj);
    return matches;
}