// @ts-check
import { Instance } from "./Instance.mjs"

/** I mark the lizard spawn. */
export class PlayerSpawnPoint extends Instance {
	/** Creates an instance of a {@link PlayerSpawnPoint}. */
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
