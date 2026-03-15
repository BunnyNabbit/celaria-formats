// @ts-check
import { Instance } from "./Instance.mjs"
/**@import {
 *   MedalTimes,
 *   Vector3
 * } from "../../../types/data.mts"
 */
/** @import {CelariaMap} from "../CelariaMap.mjs" */

/** I represent solid geometry in the form of rectangular prisms. */
export class Block extends Instance {
	/**@todo Yet to be documented.
	 *
	 * @param {number} [type=Block.types.plain] Default is `Block.types.plain`
	 */
	constructor(type = Block.types.plain) {
		super()
		/**The rotation of the object I represent.
		 *
		 * @type {number}
		 */
		this.rotation = 0
		/**The scale of the object I represent.
		 *
		 * @type {Vector3}
		 */
		this.scale = [2, 2, 2]
		/**@todo Yet to be documented.
		 *
		 * @type {number}
		 */
		this.type = type
		/**The medal times associated with the goal or checkpoint. Populated and required by {@link CelariaMap}.
		 *
		 * @type {MedalTimes}
		 */
		this.medalTimes
	}
	static types = {
		/**I'm standard level geometry.
		 *
		 * @type {0}
		 */
		plain: 0,
		/**I'm red and I'm the goal of a map. Or the space above me, that is.
		 *
		 * @type {1}
		 */
		goal: 1,
		/**I'm green. I let the player jump higher if they're touching me.
		 *
		 * @type {2}
		 */
		jump: 2,
		/**I'm yellow. I speed up players who walk on me.
		 *
		 * @type {3}
		 */
		speed: 3,
		/**I'm blue. It's difficult to walk on and climb on me.
		 *
		 * @type {4}
		 */
		ice: 4,
		/**I've been purple. But lately I'm red. I represent checkpoints of a map.
		 *
		 * @type {5}
		 */
		checkpoint: 5,
	}
	/** @returns {0} */
	get instanceId() {
		return 0
	}
}

export default Block
