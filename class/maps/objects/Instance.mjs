// @ts-check
/** @import {Vector3} from "../../../types/data.mts" */

/** I'm a base class for all Celaria instances. Since all objects share one thing in common which is their position, I am responsible for defining that property. */
export class Instance {
	/** Creates a new instance of an {@link Instance}. */
	constructor() {
		/**The position of where I am. Z is the gravity axis.
		 *
		 * @type {Vector3}
		 */
		this.position = [0, 0, 0]
	}
	/**Gets the instance type for serialization.
	 *
	 * @abstract
	 * @returns {number}
	 */
	get instanceId() {
		throw new Error("Instance#instanceId is abstract and must be implemented by subclasses.")
	}
}

export default Instance
