// @ts-check
/** @import {Vector3} from "../../../types/data.mts" */
import { Instance } from "./Instance.mjs"

/** I am a collectible in the form of a red sphere. I was probably called a gem before. Can't remember. */
export class Sphere extends Instance {
	/** Creates an instance of a {@link Sphere}. */
	constructor() {
		super()
	}
	/** @returns {1} */
	get instanceId() {
		return 1
	}
}

export default Sphere
