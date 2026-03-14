// @ts-check
import { SmartBuffer } from "smart-buffer"
import { BaseCelariaMap } from "./BaseCelariaMap.mjs"
import { Block } from "./objects/Block.mjs"
import { PlayerSpawnPoint } from "./objects/PlayerSpawnPoint.mjs"
import { Barrier } from "./objects/Barrier.mjs"
import { Sphere } from "./objects/Sphere.mjs"
import { TutorialHologram } from "./objects/TutorialHologram.mjs"
/** @todo Yet to be documented. */
export class CelariaMap extends BaseCelariaMap {
	/**/
	constructor() {
		super()
		this.mode = CelariaMap.gameModes.timeTrial
	}
	static gameModes = {
		freeRoam: 0,
		timeTrial: 1,
	}
	/**@todo Yet to be documented.
	 *
	 * @param {Buffer} buffer
	 * @returns
	 */
	static parse(buffer) {
		/** @type {CelariaMap} */
		const map = new CelariaMap()
		const smartBuffer = SmartBuffer.fromBuffer(buffer)
		const magic = smartBuffer.readString(11)
		if (magic !== CelariaMap.fileSignature) throw new Error("Magic mismatch.")
		map.version = smartBuffer.readUInt8() // Version

		map.name = smartBuffer.readString(smartBuffer.readUInt8())

		if (map.version == 0) smartBuffer.readInt8() // unused byte

		map.mode = smartBuffer.readUInt8() // unused byte (is it really? it's used in validation inside the server code but not client)

		const checkpointCount = smartBuffer.readInt8()
		/** @type {{ priority: number; block: Block }[]} */
		const checkpoints = []
		// @ts-ignore see https://github.com/BunnyNabbit/celaria-formats/issues/12
		map.medalTimes = [] // TODO: refactor into medal times

		for (let i = 0; i < checkpointCount; i++) {
			// @ts-ignore see https://github.com/BunnyNabbit/celaria-formats/issues/12
			map.medalTimes.push({
				platin: smartBuffer.readUInt32LE(),
				gold: smartBuffer.readUInt32LE(),
				silver: smartBuffer.readUInt32LE(),
				bronze: smartBuffer.readUInt32LE(),
			})
		}

		map.sunRotationHorizontal = smartBuffer.readFloatLE()
		map.sunRotationVertical = smartBuffer.readFloatLE()

		map.previewCamera.from = [smartBuffer.readDoubleLE(), smartBuffer.readDoubleLE(), smartBuffer.readDoubleLE()]
		map.previewCamera.to = [smartBuffer.readDoubleLE(), smartBuffer.readDoubleLE(), smartBuffer.readDoubleLE()]

		const instanceCount = smartBuffer.readUInt32LE()

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
						sphere.position[0] = smartBuffer.readInt32LE() / 10
						sphere.position[1] = smartBuffer.readInt32LE() / 10
						if (map.version == 0) {
							sphere.position[2] = smartBuffer.readInt32LE() / 10
						} else {
							sphere.position[2] = smartBuffer.readUInt32LE() / 10
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
						playerSpawnPoint.position[0] = smartBuffer.readInt32LE() / 10
						playerSpawnPoint.position[1] = smartBuffer.readInt32LE() / 10
						if (map.version == 0) {
							playerSpawnPoint.position[2] = smartBuffer.readInt32LE() / 10
						} else {
							playerSpawnPoint.position[2] = smartBuffer.readUInt32LE() / 10
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

					barrier.position = [smartBuffer.readDoubleLE(), smartBuffer.readDoubleLE(), smartBuffer.readDoubleLE()]

					barrier.scale = [smartBuffer.readDoubleLE(), 0, smartBuffer.readDoubleLE()]

					barrier.rotation = smartBuffer.readFloatLE()
					map.instances.push(barrier)
					break
				}
				case 4: {
					// Barrier (floor)
					const barrier = new Barrier()
					smartBuffer.readUInt8() // unused byte

					barrier.position = [smartBuffer.readDoubleLE(), smartBuffer.readDoubleLE(), smartBuffer.readDoubleLE()]

					barrier.scale = [smartBuffer.readDoubleLE(), smartBuffer.readDoubleLE(), 0]

					barrier.rotation = smartBuffer.readFloatLE()
					map.instances.push(barrier)
					break
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
	/** @todo Yet to be documented. */
	serialize(version = 3) {
		const output = new SmartBuffer()
		output.writeString(CelariaMap.fileSignature)
		output.writeUInt8(version) // Version

		const mapName = this.name
		output.writeUInt8(mapName.length)
		output.writeString(mapName)

		if (version == 0) output.writeUInt8(0) // unused byte
		output.writeUInt8(this.mode) // Mode byte: Must be 1 for Celaria server (Java) to work. Otherwise doesn't matter

		const existingCheckpoints = new Set(this.checkpointOrder.toArray())
		output.writeUInt8(existingCheckpoints.size)
		for (let i = 0; i < existingCheckpoints.size; i++) {
			// Purposefully have impossible to beat times for maps written by cmapLib.js @TODO: medal times
			output.writeUInt32LE(1)
			output.writeUInt32LE(2)
			output.writeUInt32LE(3)
			output.writeUInt32LE(4)
		}

		output.writeFloatLE(this.sunRotationHorizontal)
		output.writeFloatLE(this.sunRotationVertical)

		output.writeDoubleLE(this.previewCamera.from[0])
		output.writeDoubleLE(this.previewCamera.from[1])
		output.writeDoubleLE(this.previewCamera.from[2])

		output.writeDoubleLE(this.previewCamera.to[0])
		output.writeDoubleLE(this.previewCamera.to[1])
		output.writeDoubleLE(this.previewCamera.to[2])

		output.writeUInt32LE(this.instances.length)

		// write data
		this.instances.forEach((instance) => {
			// Skip over checkpoints. Write zhem later.
			if (instance.instanceId === 0 && existingCheckpoints.has(instance)) return
			if (!CelariaMap.instanceTypeIsSupported(instance.instanceId, version)) return
			output.writeUInt8(instance.instanceId)
			switch (instance.instanceId) {
				case 0: // block
					if (instance.type === Block.types.checkpoint) instance.type = Block.types.plain
					if (instance.type === Block.types.goal) instance.type = Block.types.plain
					CelariaMap.#writeBlock(instance, output, version)
					break
				case 1: // Sphere/gem/collectible/schmilblick
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

					output.writeDoubleLE(instance.position[0])
					output.writeDoubleLE(instance.position[1])
					output.writeDoubleLE(instance.position[2])

					output.writeDoubleLE(instance.scale[0])
					output.writeDoubleLE(instance.scale[2])

					output.writeFloatLE(instance.rotation)
					break
				case 4: // Barrier (floor)
					output.writeUInt8(0) // unused byte

					output.writeDoubleLE(instance.position[0])
					output.writeDoubleLE(instance.position[1])
					output.writeDoubleLE(instance.position[2])

					output.writeDoubleLE(instance.scale[0])
					output.writeDoubleLE(instance.scale[1])

					output.writeFloatLE(instance.rotation)
					break
				default:
					break
			}
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
	// TODO: Again, this uses the .ecmap versions (0 - 4)
	/**@todo Yet to be documented.
	 *
	 * @param {any} instanceType
	 * @param {number} version
	 */
	static instanceTypeIsSupported(instanceType, version) {
		switch (instanceType) {
			case 3:
				if (version < 3) return false
				break
			case 4:
				if (version < 3) return false
				break

			default:
				break
		}

		return true
	}
	static fileSignature = "celaria_map"
}

export default CelariaMap
