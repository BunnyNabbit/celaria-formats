// @ts-check
import { SmartBuffer } from "smart-buffer"
import { Block } from "./objects/Block.mjs"
import { PlayerSpawnPoint } from "./objects/PlayerSpawnPoint.mjs"
import { Barrier } from "./objects/Barrier.mjs"
import { Sphere } from "./objects/Sphere.mjs"
import { TutorialHologram } from "./objects/TutorialHologram.mjs"
import { BaseCelariaMap } from "./BaseCelariaMap.mjs"
/** @import {CelariaMap} from "./CelariaMap.mjs" */
/**I represent an editable Celaria map openable in the game's map editor. I am yet to be finalized into a {@link CelariaMap}.
 *
 * @example Parsing a map to turn all blocks into speed blocks.
 *
 * ```js
 * import fs from "node:fs"
 * import { Block } from "celaria-formats/class/maps/objects/Block.mjs"
 * import { EditableCelariaMap } from "celaria-formats/class/maps/EditableCelariaMap.mjs"
 *
 * const myMap = EditableCelariaMap.parse(fs.readFileSync("./myMap.cmap"))
 * myMap.instances.filter(instance => instance.instanceId == 0).forEach(block => block.type = Block.types.speed)
 * const output = myMap.serialize(4)
 * ```
 */
export class EditableCelariaMap extends BaseCelariaMap {
	/**/
	constructor() {
		super()
	}
	/** @param {Buffer<ArrayBufferLike>} buffer */
	static parse(buffer) {
		const map = new EditableCelariaMap()
		const smartBuffer = SmartBuffer.fromBuffer(buffer)
		const magic = smartBuffer.readString(11)
		if (magic !== EditableCelariaMap.fileSignature) throw new Error("Magic mismatch.")
		map.version = smartBuffer.readUInt8() // Version

		map.name = smartBuffer.readString(smartBuffer.readUInt8(), "ascii")

		smartBuffer.readUInt8() // unused byte
		smartBuffer.readUInt8() // unused byte
		//if (map.version == 0) buff.readUInt8() // unused byte

		map.sunRotationHorizontal = smartBuffer.readFloatLE()
		map.sunRotationVertical = smartBuffer.readFloatLE()

		map.previewCamera.from = [smartBuffer.readDoubleLE(), smartBuffer.readDoubleLE(), smartBuffer.readDoubleLE()]
		map.previewCamera.to = [smartBuffer.readDoubleLE(), smartBuffer.readDoubleLE(), smartBuffer.readDoubleLE()]

		const instanceCount = smartBuffer.readUInt32LE()
		/** @type {{ priority: number; block: Block }[]} */
		const checkpoints = []
		for (let i = 0; i < instanceCount; i++) {
			const instanceType = smartBuffer.readUInt8()
			switch (instanceType) {
				case 0: // block
					const block = new Block(smartBuffer.readUInt8())
					if (map.version == 0) smartBuffer.readUInt8() // unused byte

					if (map.version <= 1) {
						block.position = [smartBuffer.readInt32LE() / 10, smartBuffer.readInt32LE() / 10, smartBuffer.readUInt32LE() / 10]

						block.scale = [smartBuffer.readUInt32LE() / 10, smartBuffer.readUInt32LE() / 10, smartBuffer.readUInt32LE() / 10]
					} else {
						block.position = [smartBuffer.readDoubleLE(), smartBuffer.readDoubleLE(), smartBuffer.readDoubleLE()]

						block.scale = [smartBuffer.readDoubleLE(), smartBuffer.readDoubleLE(), smartBuffer.readDoubleLE()]
					}

					block.rotation = smartBuffer.readFloatLE()
					if (block.type === Block.types.checkpoint) {
						checkpoints.push({
							block,
							priority: smartBuffer.readUInt8(),
						})
					} else if (block.type === Block.types.goal) {
						checkpoints.push({
							block,
							priority: Number.MAX_SAFE_INTEGER,
						})
					}
					map.instances.push(block)
					break
				case 1: // Sphere/gem
					const sphere = new Sphere()
					if (map.version <= 1) {
						sphere.position[0] = smartBuffer.readInt32LE()
						sphere.position[1] = smartBuffer.readInt32LE()
						if (map.version == 0) {
							sphere.position[2] = smartBuffer.readInt32LE()
						} else {
							sphere.position[1] = smartBuffer.readUInt32LE()
						}
					} else {
						sphere.position = [smartBuffer.readDoubleLE(), smartBuffer.readDoubleLE(), smartBuffer.readDoubleLE()]
					}
					map.instances.push(sphere)
					break
				case 2: // Player spawn
					const playerSpawnPoint = new PlayerSpawnPoint()
					smartBuffer.readUInt8() // unused byte

					if (map.version <= 1) {
						playerSpawnPoint.position[0] = smartBuffer.readInt32LE()
						playerSpawnPoint.position[1] = smartBuffer.readInt32LE()
						if (map.version == 0) {
							playerSpawnPoint.position[2] = smartBuffer.readInt32LE()
						} else {
							playerSpawnPoint.position[2] = smartBuffer.readUInt32LE()
						}
					} else {
						playerSpawnPoint.position = [smartBuffer.readDoubleLE(), smartBuffer.readDoubleLE(), smartBuffer.readDoubleLE()]
					}

					playerSpawnPoint.rotation = smartBuffer.readFloatLE()
					map.instances.push(playerSpawnPoint)
					break
				case 3: {
					// Barrier (wall)
					const barrier = new Barrier()
					smartBuffer.readUInt8() // unused byte

					if (map.version === 3) {
						barrier.position = [smartBuffer.readInt32LE() / 10, smartBuffer.readInt32LE() / 10, smartBuffer.readUInt32LE() / 10]

						barrier.scale = [smartBuffer.readUInt32LE() / 10, 0, smartBuffer.readUInt32LE() / 10]
					} else {
						barrier.position = [smartBuffer.readDoubleLE(), smartBuffer.readDoubleLE(), smartBuffer.readDoubleLE()]

						barrier.scale = [smartBuffer.readDoubleLE(), 0, smartBuffer.readDoubleLE()]
					}

					barrier.rotation = smartBuffer.readFloatLE()
					map.instances.push(barrier)
					break // TODO: dedupe
				}
				case 4: {
					// Barrier (wall)
					const barrier = new Barrier()
					smartBuffer.readUInt8() // unused byte

					if (map.version === 3) {
						barrier.position = [smartBuffer.readInt32LE() / 10, smartBuffer.readInt32LE() / 10, smartBuffer.readUInt32LE() / 10]

						barrier.scale = [smartBuffer.readUInt32LE() / 10, smartBuffer.readUInt32LE() / 10, 0]
					} else {
						barrier.position = [smartBuffer.readDoubleLE(), smartBuffer.readDoubleLE(), smartBuffer.readDoubleLE()]

						barrier.scale = [smartBuffer.readDoubleLE(), smartBuffer.readDoubleLE(), 0]
					}

					barrier.rotation = smartBuffer.readFloatLE()
					map.instances.push(barrier)

					break // TODO: dedupe
				}
				case 128: // Special
					const hologram = new TutorialHologram(smartBuffer.readUInt8())

					if (map.version <= 1) {
						hologram.position = [smartBuffer.readInt32LE(), smartBuffer.readInt32LE(), smartBuffer.readUInt32LE()]

						hologram.scale = [smartBuffer.readUInt32LE(), smartBuffer.readUInt32LE(), smartBuffer.readUInt32LE()]
					} else {
						hologram.position = [smartBuffer.readDoubleLE(), smartBuffer.readDoubleLE(), smartBuffer.readDoubleLE()]
						hologram.scale = [smartBuffer.readDoubleLE(), smartBuffer.readDoubleLE(), smartBuffer.readDoubleLE()]
					}

					hologram.rotation = smartBuffer.readFloatLE()
					map.instances.push(hologram)
					break
				default:
					throw new Error(`Unknown instance type ${instanceType}.`)
			}
		}
		checkpoints.sort((a, b) => a.priority - b.priority).forEach((sortedEntry) => map.checkpointOrder.add(sortedEntry.block))
		return map
	}
	/**Serializes the map into a buffer.
	 *
	 * Checkpoints and goal blocks are modified in place if they aren't specified in my {@link checkpointOrder}. And the blocks that are will also be modified.
	 *
	 * @param {number} version
	 * @throws {Error} If a {@link Barrier} can't figure out if it's a wall or a floor.
	 */
	serialize(version) {
		if (typeof version === "undefined") throw new Error("No version defined.")
		const output = new SmartBuffer()
		output.writeString(EditableCelariaMap.fileSignature, "ascii")
		output.writeUInt8(version) // Version

		output.writeUInt8(this.name.length)
		output.writeString(this.name)

		output.writeUInt8(0) // unused byte
		output.writeUInt8(1) // unused byte
		//if (version == 0) output.writeUInt8(0) // unused byte

		output.writeFloatLE(this.sunRotationHorizontal)
		output.writeFloatLE(this.sunRotationVertical)

		output.writeDoubleLE(this.previewCamera.from[0])
		output.writeDoubleLE(this.previewCamera.from[1])
		output.writeDoubleLE(this.previewCamera.from[2])

		output.writeDoubleLE(this.previewCamera.to[0])
		output.writeDoubleLE(this.previewCamera.to[1])
		output.writeDoubleLE(this.previewCamera.to[2])

		output.writeUInt32LE(this.instances.length)

		const existingCheckpoints = new Set(this.checkpointOrder.toArray())
		this.instances.forEach((instance) => {
			// Skip over checkpoints. Write zhem later.
			if (instance.instanceId === 0 && existingCheckpoints.has(instance)) return
			output.writeUInt8(instance.instanceId)
			switch (instance.instanceId) {
				case 0: // Block
					if (instance.type === Block.types.checkpoint) instance.type = Block.types.plain
					if (instance.type === Block.types.goal) instance.type = Block.types.plain
					EditableCelariaMap.#writeBlock(instance, output, version)
					break
				case 1: // Sphere/gem
					if (version <= 1) {
						output.writeInt32LE(instance.position[0] * 10)
						output.writeInt32LE(instance.position[1] * 10)
						if (version == 0) {
							output.writeInt32LE(instance.position[2] * 10)
						} else {
							output.writeUInt32LE(instance.position[2] * 10)
						}
					} else {
						output.writeDoubleLE(instance.position[0])
						output.writeDoubleLE(instance.position[1])
						output.writeDoubleLE(instance.position[2])
					}
					break
				case 2: // Player spawn
					output.writeUInt8(0) // unused byte

					if (version <= 1) {
						output.writeInt32LE(instance.position[0] * 10)
						output.writeInt32LE(instance.position[1] * 10)
						if (version == 0) {
							output.writeInt32LE(instance.position[2] * 10)
						} else {
							output.writeUInt32LE(instance.position[2] * 10)
						}
					} else {
						output.writeDoubleLE(instance.position[0])
						output.writeDoubleLE(instance.position[1])
						output.writeDoubleLE(instance.position[2])
					}

					output.writeFloatLE(instance.rotation)
					break
				case 3: // Barrier (wall)
					output.writeUInt8(0) // unused byte

					if (version === 3) {
						output.writeInt32LE(instance.position[0] * 10)
						output.writeInt32LE(instance.position[1] * 10)
						output.writeUInt32LE(instance.position[2] * 10)

						output.writeUInt32LE(instance.scale[0] * 10)
						output.writeUInt32LE(instance.scale[2] * 10)
					} else {
						output.writeDoubleLE(instance.position[0])
						output.writeDoubleLE(instance.position[1])
						output.writeDoubleLE(instance.position[2])

						output.writeDoubleLE(instance.scale[0])
						output.writeDoubleLE(instance.scale[2])
					}

					output.writeFloatLE(instance.rotation)
					break
				case 4: // Barrier (floor)
					output.writeUInt8(0) // unused byte

					if (version === 3) {
						output.writeInt32LE(instance.position[0] * 10)
						output.writeInt32LE(instance.position[1] * 10)
						output.writeUInt32LE(instance.position[2] * 10)

						output.writeUInt32LE(instance.scale[0] * 10)
						output.writeUInt32LE(instance.scale[1] * 10)
					} else {
						output.writeDoubleLE(instance.position[0])
						output.writeDoubleLE(instance.position[1])
						output.writeDoubleLE(instance.position[2])

						output.writeDoubleLE(instance.scale[0])
						output.writeDoubleLE(instance.scale[1])
					}

					output.writeFloatLE(instance.rotation)
					break
				default:
					break
			}
		})
		const checkpoints = this.checkpointOrder.toArray()
		checkpoints.forEach((checkpoint, index) => {
			output.writeUInt8(checkpoint.instanceId)
			if (index === checkpoints.length - 1) {
				checkpoint.type = Block.types.goal
			} else {
				checkpoint.type = Block.types.checkpoint
			}
			EditableCelariaMap.#writeBlock(checkpoint, output, version, index)
		})

		return output.toBuffer()
	}
	/**@todo Yet to be documented.
	 *
	 * @param {Block} block
	 * @param {SmartBuffer} buffer
	 * @param {number} version
	 */
	static #writeBlock(block, buffer, version, checkpointId = 0) {
		buffer.writeUInt8(block.type)
		if (version == 0) buffer.writeUInt8(0) // unused byte
		if (version <= 1) {
			buffer.writeInt32LE(block.position[0] * 10)
			buffer.writeInt32LE(block.position[1] * 10)
			buffer.writeUInt32LE(block.position[2] * 10)

			buffer.writeUInt32LE(block.scale[0] * 10)
			buffer.writeUInt32LE(block.scale[1] * 10)
			buffer.writeUInt32LE(block.scale[2] * 10)
		} else {
			buffer.writeDoubleLE(block.position[0])
			buffer.writeDoubleLE(block.position[1])
			buffer.writeDoubleLE(block.position[2])

			buffer.writeDoubleLE(block.scale[0])
			buffer.writeDoubleLE(block.scale[1])
			buffer.writeDoubleLE(block.scale[2])
		}
		buffer.writeFloatLE(block.rotation)
		if (block.type === Block.types.checkpoint) buffer.writeUInt8(checkpointId)
	}
	static fileSignature = "celaria_edi"
}

export default EditableCelariaMap
