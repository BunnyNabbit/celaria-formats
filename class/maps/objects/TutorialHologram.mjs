// @ts-check
/** @import {Vector3} from "../../../types/data.mts" */
import Instance from "./Instance.mjs"

/** @todo Yet to be documented. */
export class TutorialHologram extends Instance {
	/**@todo Yet to be documented.
	 *
	 * @param {number} type
	 */
	constructor(type) {
		super()
		/** @type {number} */
		this.type = type
		/** @type {Vector3} */
		this.scale = [0, 0, 0]
		/** @type {number} */
		this.rotation = 0
	}
	/** @returns {128} */
	get instanceId() {
		return 128
	}
}
