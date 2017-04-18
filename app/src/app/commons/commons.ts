// commons functionalities

const DATE_RANGE_SEP = '- ';
const LIST_SEP = '|';
const PAIR_SEP = '@';

declare var moment: any;
declare var _: any;

/**
 * A range of two dates.
 */
export class DateRange {

  static empty() {
    return new DateRange(null, null);
  }

  /**
   * Parses a range of dates.
   * Dates must be specified as '{from}-{to}' where from and to are expressed as
   * milliseconds since the Epoch time and are separated with a dash.
   *
   * @param {string} val The string value
   * @param {boolean} useFallback Optional, if true an empty object is returned instead of null
   * @return {DateRange} A date range
   */
  static parse(val: string, useFallback: boolean) {
    if (!isString(val) || isBlank(val)) {
      return useFallback ? DateRange.empty() : null;
    }

    const i = val.indexOf(DATE_RANGE_SEP);
    const startVal = val.substr(0, i);
    const endVal = val.substr(i + 1);
    const startDate = new Date(parseInt(startVal, 10));
    const endDate = new Date(parseInt(endVal, 10));

    // if i was in a valid range, return the date range, otherwise null or fallback
    return i > 0 && i < val.length - 1 ?
      new DateRange(startDate, endDate) :
      (useFallback ? DateRange.empty() : null);
  }

  /**
   * Formats two dates of a range with the format '{from}-{to}' where from and to
   * are expressed as milliseconds since the Epoch time and are separated with a dash.
   */
  static format(start: Date, end: Date) {
    return start.getTime() + DATE_RANGE_SEP + end.getTime();
  }

  constructor(readonly startDate: Date, readonly endDate: Date) { }
}

/**
 * A pair of values.
 */
export class Pair<T, S> {

  /**
   * Parses a pair of values separated by '@'.
   *
   * @param  {string} val The string to be parsed
   * @return {Pair} A pair of strings
   */
  static parse(val: string): Pair<string, string> {
    const idAndName = val.split(PAIR_SEP);
    const tag = new Pair(idAndName[0], idAndName[1]);
    return idAndName.length === 2 ? tag : null;
  }

  /**
  * Parses a string which was made up of the concatenation of pairs.
  *
  * @param {String} val A string
  * @param {any} dflt Any default value
  * @returns {Array} An array of pairs
  */
  static parsePairs(val: string, dflt: any): Pair<string, string>[] | any {
    if (!isString(val) || isBlank(val)) {
      return dflt || null;
    }

    const tokens = val.split(LIST_SEP);
    const pairs = _(tokens)
      .filter(v => !isBlank(v) && v.indexOf(PAIR_SEP) !== -1)
      .map(v => Pair.parse(v))
      .filter(p => p !== null)
      .value();

    return pairs;
  }

  /**
   * Formats a list of pairs.
   *
   * @param pairs {Array} An array of pairs
   * @returns {string} A string made up of the concatenation of the pairs
   */
  static format(pairs): string {
    return _(pairs).map(p => p.first + PAIR_SEP + p.second).join(LIST_SEP);
  }

  constructor(readonly first: T, readonly second: S) { }
}

/**
 * A function that always returns true.
 *
 * @return {boolean}
 */
export function alwaysTrue() {
  return true;
}

/**
 * The identity function.
 *
 * @param x {any} Any value
 * @returns {any} The same input vlaue
 */
export function ident(x: any): any {
  return x;
}

/**
 * Creates a function that emits sequences of numbers when invoked.
 *
 * @param  {number} base The base of the sequence, default is 1
 * @return {function} A function that generates sequence numbers
 */
export function sequence(base = 1): () => number {
  let no = base;
  return () => no++;
}

export function isDefined(val: any): boolean {
  return val !== undefined && val !== null;
}

export function isBlank(val: string): boolean {
  return !isDefined(val) || val.length === 0 || /^\s*$/.test(val);
}

export function isString(s: any): boolean {
  return s && (typeof s === 'string' || s instanceof String);
}

export function hasElements(a) {
  return a && _.isArray(a) && a.length !== 0;
}

/**
 * Formats a string using the placeholders {n}.
 *
 * @param {string} fmt The format string
 * @param {any} args Additional parameters
 * @returns {string} The formatted string
 */
export function format(fmt: string, ...args: any[]): string {
  return fmt.replace(/\{(\d+)\}/g, function(match, capture) {
    const val = args[parseInt(capture, 10)];
    return val !== undefined ? val : match;
  });
}

export function formatList(list) {
  return list.join(LIST_SEP);
}

export function parseList(val: string, dflt): string[] {
  if (!isString(val) || isBlank(val)) {
    return dflt || null;
  }
  return val.split(LIST_SEP);
}

export function toId(v: any): any {
  return v.id;
}

export function hasSameId(val: any): (t: any) => boolean {
  return t => t.id === val.id;
}

export function tagSize(tag): number {
  const s = ~~(tag.weigth * 10) + 1,
    size = s > 10 ? 10 : s;
  return size;
}

export function splitDateTime(dt, noTime): { date: string, time: string } {
  const m = moment(dt);
  const time = noTime ? null : m.format('HH:mm');
  return {
    date: m.format(),
    time: time
  };
}

/**
 * Simplifies the call of scoped attributes that reference functions.
 *
 * @param {Function} functor A functor function
 * @return {boolean} True if the functor is really a functor, false otherwise.
 */
export function callIfFunctor(functor: any): boolean {
  if (_.isFunction(functor)) {
    const fn = functor();
    if (_.isFunction(fn)) {
      const args = _.toArray(arguments).slice(1);
      fn.apply(null, args);
      return true;
    }
  }
  return false;
}

/**
 * Use this function to customize the deep cloning of any object that might use
 * Moment values for dates and times.
 *
 * @param {any} val Any value, likely a moment object
 * @returns {any} Undefined if val is not a Moment instance, otherwise a cloned copy
 *                of the Moment value.
 */
export function cloneMoment(val) {
  if (moment.isMoment(val)) {
    return moment(val);
  }
}

/**
 * Updates or inserts a value in an array, according to the matching predicate function.
 *
 * @param {Array} arr The array of values
 * @param {Function} pred The predicate function, executed on the elements of the array
 * @param {any} val Any value to be inserted or substituted
 * @returns {Number} The index of element being updated or -1 if element was not found (and it was appended)
 */
export function upsert<T>(arr: T[], pred, val: T) {
  const i = _.findIndex(arr, pred);
  if (i >= 0) {
    arr.splice(i, 1, val);
  } else {
    arr.push(val);
  }
  return i;
}

/**
 * Finds an element that satisfies one of the selectors
 *
 * @param {jQueryElement} elem A jQuery element
 * @param {string} sels  Other arguments are expected to be selector strings
 */
export function findFirst(elem: any, ...sels: string[]): any {
  let match;

  for (let i = 0; i < sels.length && (!match || !match.length); i++) {
    match = elem.find(sels[i]);
  }

  return match && match.length ? match.first() : null;
}

/**
 * Executes the given value if it's a function or simply returns it if it's not.
 *
 * @param {Function|any} val Any value, can be a function
 * @return {any} The returned value of the execution of val if it's a function, val itself otherwise.
 */
export function execOrGet(val: any): any {
  return _.isFunction(val) ? val() : val;
}

/**
 * Finds a value within an array of values given the corresponding 'id' property.
 *
 * @param {String|Number} id The identifier
 * @param {Object} values objects with integer 'id' property
 * @returns {Object} The first value in values whose 'id' property equals the
 * numeric representation of the input id parameter.
 */
export function findByIntegerId(id: any, values: { id: any }[]) {
  if (id === null || id === null) {
    return null;
  }
  const lid = parseInt(id, 10);
  return _.find(values, v => v.id === id || v.id === lid);
}

/**
 * Creates a function that searches for a text into any value that is possibly transformed
 * by the specified selector.
 *
 * @param {String} match A text to be looked up into any value that is possibly transformed
 *                       by selector
 * @param {Function} selector A function that takes any value in input and returns an array
 *                            of string elements
 * @returns {Function} A function that searches for a text
 */
export function matches(match: string, selector: (v: any) => string[]): (v: any) => boolean {
  const needle = match.toLowerCase();
  return (val: any) => {
    const texts = selector(val);
    return _.some(texts, t => {
      const haystack = t ? t.toLowerCase() : '';
      return haystack.indexOf(needle) >= 0;
    });
  };
}

/**
 * A constructor of a function that return true if the passed value is in the specified keyset.
 *
 * @param keyset {Object}
 * @returns {Function}
 */
export function ifNotIn(keyset) {
  return val => !(val.id in keyset);
}

/**
 * A constructor of a function that return true if the passed value is NOT in the specified keyset.
 *
 * @param keyset {Object}
 * @returns {Function}
 */
export function ifIn(keyset) {
  return val => val.id in keyset;
}

/**
 * A constructor of a function that return true if calling the passed function returns false.
 * <p>
 * Returns the negated function.
 * </p>
 *
 * @param fn {Function} A function that takes a value in input and returns a boolean
 * @returns {Function}
 */
export function negate(fn) {
  return val => !fn(val);
}

/**
 * Converts an array of primitive values into a set.
 *
 * @param arr {Array} Array of primitive values that can be converted into keys.
 * @return {Object} A set with the array values as keys.
 */
export function arrayToSet(arr) {
  const s = {};
  _.forEach(arr, v => s[v] = true);
  return s;
}

/**
 * Paginates an array of values.
 *
 * @param arr {Array} Any array of values
 * @param page {Number} 1-based page number
 * @param size {Number} Number of elements to return
 * @returns {Array} A view of the given array at the specified page and with the specified number of elements
 */
export function paginate(arr, page, size) {
  // page is 1-based
  // first index is (page-1)*size
  const i = (page - 1) * size;
  const j = i + size;
  return arr.slice(i, j);
}

/**
 * Returns a function that will execute the specified function with no arguments.
 *
 * @param func {Function} Any function
 * @returns {Function} A function that wraps the given function and passes no arguments to it
 */
export function noArgs(func: (...args: any[]) => any): () => any {
  return () => func();
}

/**
 * Returns the week day label.
 * Week day is a number ranging 0 to 6 where 0 corresponds to monday and 6 to sunday.
 * Moment follows a different convention: 0 corresponds to sunday and 6 to saturday.
 *
 * @param n {Number} The day number (0-based)
 * @returns {string} The day label
 */
export function weekDay(n) {
  return moment().day((n + 1) % 7).format('dddd');
}

/**
 * Removes a character from the head of a string.
 *
 * @param  {string} str  The target string
 * @param  {string} char The single character
 * @return {string}      The beheaded string
 */
export function behead(str: string, char: string): string {
  let s = str;
  while (s && s[0] === char) {
    s = s.slice(1);
  }
  return s;
}

/**
 * Removes a character from the tail of a string.
 *
 * @param  {string} str  The target string
 * @param  {string} char The single character
 * @return {string}      The modified string
 */
export function untail(str: string, char: string): string {
  let s = str;
  while (s && s[s.length - 1] === char) {
    s = s.substr(0, s.length - 1);
  }
  return s;
}
