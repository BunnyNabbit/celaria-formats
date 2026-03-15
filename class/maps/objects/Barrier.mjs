// @ts-check
import { Instance } from "./Instance.mjs"
/** @import {FlatVector3} from "../../../types/data.mts" */

/**I slow down pesky lizards who pass me.
 *
 * I may be a wall or a floor depending on how my {@link scale} is formed. If my {@link scale} is neither and an attempt to serialize me is made, an {@link Error} is thrown.
 */
export class Barrier extends Instance {
	/** Creates an instance of a {@link Barrier}. */
	constructor() {
		super()
		/**The rotation of the object I represent.
		 *
		 * @type {number}
		 */
		this.rotation = 0
		/**The scale of the object I represent.
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
