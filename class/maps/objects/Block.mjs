// @ts-check
import { Instance } from "./Instance.mjs"
/** @import {Vector3} from "../../../types/data.mts" */

/** I represent a block. */
export class Block extends Instance {
	/** @todo Yet to be documented.
	 * 
	 * @param {number} [type=Block.types.plain]
	*/
	constructor(type = Block.types.plain) {
		super()
		/** @type {number} */
		this.rotation = 0
		/** @type {Vector3} */
		this.scale = [2, 2, 2]
		/**@todo Yet to be documented.
		 *
		 * @type {number}
		 */
		this.type = type
	}
	static types = {
		/**@todo Yet to be documented.
		 *
		 * @type {0}
		 */
		plain: 0,
		/**@todo Yet to be documented.
		 *
		 * @type {1}
		 */
		goal: 1,
		/**@todo Yet to be documented.
		 *
		 * @type {2}
		 */
		jump: 2,
		/**@todo Yet to be documented.
		 *
		 * @type {3}
		 */
		speed: 3,
		/**@todo Yet to be documented.
		 *
		 * @type {4}
		 */
		ice: 4,
		/**@todo Yet to be documented.
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
