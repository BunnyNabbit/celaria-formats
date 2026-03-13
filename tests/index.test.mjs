import { CelariaMap} from "../index.mjs"
import { describe, expect, it } from "@jest/globals"

describe("index", () => {
	it("should import", () => {
		expect(typeof CelariaMap).toBe("function")
	})
})
