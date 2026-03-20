// @ts-check
import { SmartBuffer } from "smart-buffer"
/** @import {UvData} from "../types/data.mts" */
/** @todo Yet to be documented. */
export class CelariaUvMap {
	/**Parse the given {@link buffer} to uv data.
	 *
	 * @param {Buffer<ArrayBufferLike>} buffer
	 * @returns {UvData[]}
	 */
	static parse(buffer) {
		const buff = SmartBuffer.fromBuffer(buffer)
		if (buff.readString(7, "ascii") !== CelariaUvMap.fileSignature) throw new Error("Magic mismatch.")
		const version = buff.readUInt8() // Version
		if (version !== 0) throw new Error(`Unsupported version ${version}.`)
		const blockCount = buff.readUInt32LE()
		const faceCount = buff.readUInt32LE()
		/** @type {UvData[]} */
		let uvs = []
		for (let i = 0; i < faceCount; i++) {
			uvs.push({
				blockId: buff.readUInt32LE(),
				faceId: buff.readUInt8(),
				startX: buff.readFloatLE(),
				startY: buff.readFloatLE(),
				endX: buff.readFloatLE(),
				endY: buff.readFloatLE(),
			})
		}
		return uvs
	}

	static fileSignature = "cuvdata"
}

export default CelariaUvMap
