//@ts-check
/**I'm a lazy implementation of an ordered set.
 *
 * @template Value
 */
export class OrderedSet {
	/** Increments {@link next} and returns its previous value. */
	#increment() {
		return this.#next++
	}
	/**Removes an {@link element} from the set.
	 *
	 * @param {Value} element
	 * @returns 
	 */
	delete(element) {
		return this.#map.delete(element)
	}
	/**Adds an {@link element} to the set. Subsequent insertions do not æffect the element's order in the set.
	 *
	 * @param {Value} element
	 */
	add(element) {
		if (this.#map.has(element) == false) this.#map.set(element, this.#increment())
	}
	/**Returns an ordered array of the set.
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
