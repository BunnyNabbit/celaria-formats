// @ts-check
import { SmartBuffer } from "smart-buffer"
/** @import {UvData} from "../types/data.mts" */
/** @todo Yet to be documented. */
export class CelariaUvMap {
	/**Parse the given {@link buffer} to uv data.
	 *
	 * @param {Buffer<ArrayBufferLike>} buffer
	 * @returns {UvData[]}
	 * @throws {Error} On magic mismatch.
	 * @throws {Error} On unsupported versions. Only version 0 is supported.
	 */
	static parse(buffer) {
		const readBuffer = SmartBuffer.fromBuffer(buffer)
		if (readBuffer.readString(7, "ascii") !== CelariaUvMap.fileSignature) throw new Error("Magic mismatch.")
		const version = readBuffer.readUInt8()
		if (version !== 0) throw new Error(`Unsupported version ${version}.`)
		const blockCount = readBuffer.readUInt32LE()
		const faceCount = readBuffer.readUInt32LE()
		/** @type {UvData[]} */
		let uvs = []
		for (let i = 0; i < faceCount; i++) {
			uvs.push({
				blockId: readBuffer.readUInt32LE(),
				faceId: readBuffer.readUInt8(),
				startX: readBuffer.readFloatLE(),
				startY: readBuffer.readFloatLE(),
				endX: readBuffer.readFloatLE(),
				endY: readBuffer.readFloatLE(),
			})
		}
		return uvs
	}

	static fileSignature = "cuvdata"
}

export default CelariaUvMap
