// @ts-check
import { Instance } from "./Instance.mjs"

/** @todo Yet to be documented. */
export class PlayerSpawnPoint extends Instance {
	/** @todo Yet to be documented. */
	constructor() {
		super()
		/**The rotation of the object I represent.
		 *
		 * @type {number}
		 */
		this.rotation = 0
	}
	/** @returns {2} */
	get instanceId() {
		return 2
	}
}

export default PlayerSpawnPoint
