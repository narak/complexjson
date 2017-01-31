
import { each } from 'lodash';

let _index;

/**
 * Walks the object recursively and creates the index.
 * @param  {Object} o       Object to walk
 * @param  {Array}  keypath Keypath of the parent
 * @return {void}
 */
function walk(o, keypath = []) {
    each(o, (value, key) => {
        if (Array.isArray(value)) {
            walk(value, [...keypath, key]);

        } else if (value && typeof value === 'object') {
            const newKeypath = [...keypath, Array.isArray(o) ? `[${key}]` : key];
            if (value.uuid) {
                _index[value.uuid] = {
                    keypath: newKeypath,
                    value,
                };
            }
            walk(value, newKeypath);
        }
    });
}

/**
 * Returns the object belonging to the uuid reference.
 * @param  {String} uuid Uuid reference string
 * @return {Object}      Object belonging to the uuid.
 */
export function ref(uuid) {
    return _index[uuid];
}

/**
 * Parses the object and builds the associated indexes.
 * @param  {String|Object} json The object to parse
 * @return {Object}             The parsed object and indexes.
 */
export function parse(json) {
    let obj;

    if (typeof json === 'string') {
        obj = JSON.parse(json);
    } else {
        obj = json;
    }

    // reset _index
    _index = {};

    walk(obj);
    console.log(_index);

    return obj;
}
