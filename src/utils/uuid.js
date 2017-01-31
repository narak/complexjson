
const uuidRe = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

/**
 * Function that tests if the passed value is a uuid.
 * @param  {String} value Value to be tested.
 * @return {Boolean}      True if valid uuid.
 */
export function is(value) {
    return uuidRe.test(value);
}
