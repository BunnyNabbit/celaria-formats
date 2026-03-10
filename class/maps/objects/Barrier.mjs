// @ts-check
import { Instance } from "./Instance.mjs"
/** @import {FlatVector3} from "../../../types/data.mts" */

/** @todo Yet to be documented. */
export class Barrier extends Instance {
	/** @todo Yet to be documented. */
	constructor() {
		super()
		/**@todo Yet to be documented.
		 *
		 * @type {number}
		 */
		this.rotation = 0
		/**@todo Yet to be documented.
		 *
		 * @type {FlatVector3}
		 */
		this.scale = [1, 0, 1]
	}
	/**@returns {3 | 4}
	 * @throws {Error} If I can't decide if I am a wall or a floor.
	 */
	get instanceId() {
		if (this.scale[0] && this.scale[2]) return 3
		if (this.scale[0] && this.scale[1]) return 4
		throw new Error("I can't decide if I am a wall or a floor.")
	}
}

export default Barrier
