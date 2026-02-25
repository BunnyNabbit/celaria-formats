//@ts-check
/** I'm a lazy implementation of an ordered set. */
export class OrderedSet {
	/** Increments {@link next} and returns its previous value. */
	#increment() {
		return this.#next++
	}
	/**@todo Yet to be documented.
	 *
	 * @param {any} element
	 */
	delete(element) {
		this.#map.delete(element)
	}
	/**@todo Yet to be documented.
	 *
	 * @param {any} element
	 */
	add(element) {
		if (this.#map.has(element) == false) this.#map.set(element, this.#increment())
	}
	/**@todo Yet to be documented.
	 *
	 * @returns {any[]}
	 */
	toArray() {
		const entries = []
		for (const entry of this.#map.entries()) {
			entries.push(entry)
		}
		return entries.sort((a, b) => a[1] - b[1]).map((entry) => entry[0])
	}
	/** @type {Map<any, number>} */
	#map = new Map()
	/** @type {number} */
	#next = 0
}

export default OrderedSet
