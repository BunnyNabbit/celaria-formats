//@ts-check
/** I'm a lazy implementation of an ordered set.
 * 
 * @template Value
*/
export class OrderedSet {
	/** Increments {@link next} and returns its previous value. */
	#increment() {
		return this.#next++
	}
	/**@todo Yet to be documented.
	 *
	 * @param {Value} element
	 */
	delete(element) {
		return this.#map.delete(element)
	}
	/**@todo Yet to be documented.
	 *
	 * @param {Value} element
	 */
	add(element) {
		if (this.#map.has(element) == false) this.#map.set(element, this.#increment())
	}
	/**@todo Yet to be documented.
	 *
	 * @returns {Value[]}
	 */
	toArray() {
		const entries = []
		for (const entry of this.#map.entries()) {
			entries.push(entry)
		}
		return entries.sort((a, b) => a[1] - b[1]).map((entry) => entry[0])
	}
	/** @type {Map<Value, number>} */
	#map = new Map()
	/**Return the position of the given {@link element} in the set. -1 if not present.
	 *
	 * @param {any} element
	 * @returns {number}
	 */
	indexOf(element) {
		return this.toArray().indexOf(element)
	}
	/** @type {number} */
	#next = 0
}

export default OrderedSet
