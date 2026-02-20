import { SmartBuffer } from "smart-buffer"

export class EditableCelariaMap {
	/**/
	parseEditableCelariaMap(buffer) {
		const map = {}
		buffer = SmartBuffer.fromBuffer(buffer)
		const magic = buffer.readString(11)
		if (magic !== "celaria_edi") throw new Error("Magic mismatch.")
		map.version = buffer.readUInt8() // Version

		map.name = buffer.readString(buffer.readUInt8())

		buffer.readUInt8() // unused byte
		buffer.readUInt8() // unused byte
		//if (map.version == 0) buff.readUInt8() // unused byte

		map.sunRotationHorizontal = buffer.readFloatLE()
		map.sunRotationVertical = buffer.readFloatLE()

		map.previewCamFromX = buffer.readDoubleLE()
		map.previewCamFromY = buffer.readDoubleLE()
		map.previewCamFromZ = buffer.readDoubleLE()

		map.previewCamToX = buffer.readDoubleLE()
		map.previewCamToY = buffer.readDoubleLE()
		map.previewCamToZ = buffer.readDoubleLE()

		const instanceCount = buffer.readUInt32LE()
		console.log(instanceCount)
		map.instances = []

		for (var i = 0; i < instanceCount; i++) {
			const instance = {}
			instance.instanceType = buffer.readUInt8()
			switch (instance.instanceType) {
				case 0: // block
					instance.blockType = buffer.readUInt8()
					if (map.version == 0) buffer.readUInt8() // unused byte

					if (map.version <= 1) {
						instance.position = {
							x: buffer.readInt32LE() / 10,
							y: buffer.readInt32LE() / 10,
							z: buffer.readUInt32LE() / 10,
						}

						instance.scale = {
							x: buffer.readUInt32LE() / 10,
							y: buffer.readUInt32LE() / 10,
							z: buffer.readUInt32LE() / 10,
						}
					} else {
						instance.position = {
							x: buffer.readDoubleLE(),
							y: buffer.readDoubleLE(),
							z: buffer.readDoubleLE(),
						}

						instance.scale = {
							x: buffer.readDoubleLE(),
							y: buffer.readDoubleLE(),
							z: buffer.readDoubleLE(),
						}
					}

					instance.rotation = {
						x: 0,
						y: 0,
						z: buffer.readFloatLE(),
					}

					if (instance.blockType === 5) instance.checkpointId = buffer.readUInt8()
					break

				case 1: // Sphere/gem
					if (map.version <= 1) {
						instance.position = {}
						instance.position.x = buffer.readInt32LE()
						instance.position.y = buffer.readInt32LE()
						if (map.version == 0) {
							instance.position.z = buffer.readInt32LE()
						} else {
							instance.position.z = buffer.readUInt32LE()
						}
					} else {
						instance.position = {
							x: buffer.readDoubleLE(),
							y: buffer.readDoubleLE(),
							z: buffer.readDoubleLE(),
						}
					}
					break
				case 2: // Player spawn
					buffer.readUInt8() // unused byte

					if (map.version <= 1) {
						instance.position = {}
						instance.position.x = buffer.readInt32LE()
						instance.position.y = buffer.readInt32LE()
						if (map.version == 0) {
							instance.position.z = buffer.readInt32LE()
						} else {
							instance.position.z = buffer.readUInt32LE()
						}
					} else {
						instance.position = {
							x: buffer.readDoubleLE(),
							y: buffer.readDoubleLE(),
							z: buffer.readDoubleLE(),
						}
					}

					instance.rotation = {
						x: 0,
						y: 0,
						z: buffer.readFloatLE(),
					}
					break

				case 3: // Barrier (wall)
					buffer.readUInt8() // unused byte

					if (map.version === 3) {
						instance.position = {
							x: buffer.readInt32LE() / 10,
							y: buffer.readInt32LE() / 10,
							z: buffer.readUInt32LE() / 10,
						}

						instance.scale = {
							x: buffer.readUInt32LE() / 10,
							y: 0,
							z: buffer.readUInt32LE() / 10,
						}
					} else {
						instance.position = {
							x: buffer.readDoubleLE(),
							y: buffer.readDoubleLE(),
							z: buffer.readDoubleLE(),
						}

						instance.scale = {
							x: buffer.readDoubleLE(),
							y: 0,
							z: buffer.readDoubleLE(),
						}
					}

					instance.rotation = {
						x: 0,
						y: 0,
						z: buffer.readFloatLE(),
					}
					break
				case 4: // Barrier (floor)
					buffer.readUInt8() // unused byte

					if (map.version === 3) {
						instance.position = {
							x: buffer.readInt32LE() / 10,
							y: buffer.readInt32LE() / 10,
							z: buffer.readUInt32LE() / 10,
						}

						instance.scale = {
							x: buffer.readUInt32LE() / 10,
							y: buffer.readUInt32LE() / 10,
							z: 0,
						}
					} else {
						instance.position = {
							x: buffer.readDoubleLE(),
							y: buffer.readDoubleLE(),
							z: buffer.readDoubleLE(),
						}

						instance.scale = {
							x: buffer.readDoubleLE(),
							y: buffer.readDoubleLE(),
							z: 0,
						}
					}

					instance.rotation = {
						x: 0,
						y: 0,
						z: buffer.readFloatLE(),
					}
					break
				case 128: // Special
					throw "Sorry, but the use of dummy objects (Instance ID: 128) isn't supported by ecmapLib.js. Come bug me if this error comes to you."
					buffer.readUInt8()

					if (map.version <= 1) {
						var xPos = buffer.readInt32LE()
						var yPos = buffer.readInt32LE()
						var zPos = buffer.readUInt32LE()

						var xScale = buffer.readUInt32LE()
						var yScale = buffer.readUInt32LE()
						var zScale = buffer.readUInt32LE()
					} else {
						var xPos = buffer.readDoubleLE()
						var yPos = buffer.readDoubleLE()
						var zPos = buffer.readDoubleLE()

						var xScale = buffer.readDoubleLE()
						var yScale = buffer.readDoubleLE()
						var zScale = buffer.readDoubleLE()
					}

					var rotation = buffer.readFloatLE()
					break

				default:
					break
			}
			map.instances.push(instance)
		}
		return map
	}

	writeEditableCelariaMap(map, version) {
		if (typeof version === "undefined") throw "No version defined"
		output = new SmartBuffer()
		output.writeString("celaria_edi")
		output.writeUInt8(version) // Version

		output.writeUInt8(map.name.length)
		output.writeString(map.name)

		output.writeUInt8(0) // unused byte
		output.writeUInt8(1) // unused byte
		//if (version == 0) output.writeUInt8(0) // unused byte

		output.writeFloatLE(map.sunRotationHorizontal)
		output.writeFloatLE(map.sunRotationVertical)

		output.writeDoubleLE(map.previewCamFromX)
		output.writeDoubleLE(map.previewCamFromY)
		output.writeDoubleLE(map.previewCamFromZ)

		output.writeDoubleLE(map.previewCamToX)
		output.writeDoubleLE(map.previewCamToY)
		output.writeDoubleLE(map.previewCamToZ)

		output.writeUInt32LE(map.instances.length)

		let checkpoints = 0
		// check for checkpoints
		map.instances
			.filter((instance) => instance.instanceType === 0 && instance.blockType === 5)
			.forEach((brick) => {
				if (checkpoints !== 257) {
					checkpoints++
				} else {
					brick.color = instance.blockType = 5
				}
			})

		currentCheckpoint = 0
		// write data
		map.instances.forEach((instance) => {
			if (!instanceTypeIsSupported(instance.instanceType, version)) return
			output.writeUInt8(instance.instanceType)
			switch (instance.instanceType) {
				case 0: // block
					output.writeUInt8(instance.blockType)
					if (version == 0) output.writeUInt8(0) // unused byte

					if (version <= 1) {
						output.writeInt32LE(instance.position.x * 10)
						output.writeInt32LE(instance.position.y * 10)
						output.writeUInt32LE(instance.position.z * 10)

						output.writeUInt32LE(instance.scale.x * 10)
						output.writeUInt32LE(instance.scale.y * 10)
						output.writeUInt32LE(instance.scale.z * 10)
					} else {
						output.writeDoubleLE(instance.position.x)
						output.writeDoubleLE(instance.position.y)
						output.writeDoubleLE(instance.position.z)

						output.writeDoubleLE(instance.scale.x)
						output.writeDoubleLE(instance.scale.y)
						output.writeDoubleLE(instance.scale.z)
					}

					output.writeFloatLE(instance.rotation.z)

					if (instance.blockType === 5) output.writeUInt8(instance.checkpointId)
					break

				case 1: // Sphere/gem
					if (version <= 1) {
						output.writeInt32LE(instance.position.x * 10)
						output.writeInt32LE(instance.position.y * 10)
						if (version == 0) {
							output.writeInt32LE(instance.position.z * 10)
						} else {
							output.writeUInt32LE(instance.position.z * 10)
						}
					} else {
						output.writeDoubleLE(instance.position.x)
						output.writeDoubleLE(instance.position.y)
						output.writeDoubleLE(instance.position.z)
					}
					break
				case 2: // Player spawn
					output.writeUInt8(0) // unused byte

					if (version <= 1) {
						output.writeInt32LE(instance.position.x * 10)
						output.writeInt32LE(instance.position.y * 10)
						if (version == 0) {
							output.writeInt32LE(instance.position.z * 10)
						} else {
							output.writeUInt32LE(instance.position.z * 10)
						}
					} else {
						output.writeDoubleLE(instance.position.x)
						output.writeDoubleLE(instance.position.y)
						output.writeDoubleLE(instance.position.z)
					}

					output.writeFloatLE(instance.rotation.z)
					break

				case 3: // Barrier (wall)
					output.writeUInt8(0) // unused byte

					if (version === 3) {
						output.writeInt32LE(instance.position * 10)
						output.writeInt32LE(instance.position * 10)
						output.writeUInt32LE(instance.position * 10)

						output.writeUInt32LE(instance.scale.x * 10)
						output.writeUInt32LE(instance.scale.z * 10)
					} else {
						output.writeDoubleLE(instance.position.x)
						output.writeDoubleLE(instance.position.y)
						output.writeDoubleLE(instance.position.z)

						output.writeDoubleLE(instance.scale.x)
						output.writeDoubleLE(instance.scale.z)
					}

					output.writeFloatLE(instance.rotation.z)
					break
				case 4: // Barrier (floor)
					output.writeUInt8(0) // unused byte

					if (version === 3) {
						output.writeInt32LE(instance.position * 10)
						output.writeInt32LE(instance.position * 10)
						output.writeUInt32LE(instance.position * 10)

						output.writeUInt32LE(instance.scale.x * 10)
						output.writeUInt32LE(instance.scale.y * 10)
					} else {
						output.writeDoubleLE(instance.position.x)
						output.writeDoubleLE(instance.position.y)
						output.writeDoubleLE(instance.position.z)

						output.writeDoubleLE(instance.scale.x)
						output.writeDoubleLE(instance.scale.y)
					}

					output.writeFloatLE(instance.rotation.z)
					break
				default:
					break
			}
		})

		return output.toBuffer()
	}
}

function instanceTypeIsSupported(instanceType, version) {
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
