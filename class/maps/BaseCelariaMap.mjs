// @ts-check
import { OrderedSet } from "../OrderedSet.mjs"
/** @import {Vector3} from "../../types/data.mts" */
/** @import {Block} from "./objects/Block.mjs" */
/** @import {Sphere} from "./objects/Sphere.mjs" */
/** @import {PlayerSpawnPoint} from "./objects/PlayerSpawnPoint.mjs" */
/** @import {Barrier} from "./objects/Barrier.mjs" */
/** @import {TutorialHologram} from "./objects/TutorialHologram.mjs" */

/** I'm a base class for Celaria files and their file formats. I define attributes shared between the editable and finalized formats. */
export class BaseCelariaMap {
	/**/
	constructor() {
		/**The object instances in the map.
		 *
		 * @type {(Block | Sphere | PlayerSpawnPoint | Barrier | TutorialHologram)[]}
		 */
		this.instances = []
		/** @type {number} */
		this.sunRotationHorizontal = 45
		/** @type {number} */
		this.sunRotationVertical = 55
		/** @type {{ from: Vector3; to: Vector3 }} */
		this.previewCamera = {
			from: [0, 0, 0],
			to: [0, 0, 0],
		}
		/**The order of checkpoint blocks in the map.
		 *
		 * @type {OrderedSet<Block>}
		 */
		this.checkpointOrder = new OrderedSet()
		/** @type {number} */
		this.version
	}
	/** @type {string} */
	#name = ""
	/** @type {string} */
	static fileSignature = ""

	set name(newName) {
		// TODO: validate string length (256)
		this.#name = newName
	}

	get name() {
		return this.#name
	}
	/** @type {string} */
	static formatMagicString
}
