/**
 * Removes duplicate objects from an array by some key
 * @param array Any array
 * @param key Key to filter by
 * @returns Duplicate-free array
 */
export default function removeDuplicates(array: any[], key: string): any {
    var check = new Set()
    return array.filter(obj => !check.has(obj[key]) && check.add(obj[key]))
}