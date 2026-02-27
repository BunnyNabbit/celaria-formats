import { OrderedSet } from "../class/OrderedSet.mjs"

describe("OrderedSet", () => {
	it("should output entries in order", () => {
		const dogNames = new OrderedSet()
		dogNames.add("Rover")
		dogNames.add("Jackson")
		dogNames.add("Chase")
		dogNames.add("Zoey")
		dogNames.add("Rover")
		dogNames.delete("Jackson")
		const ordered = dogNames.toArray()
		expect(ordered).toEqual(["Rover", "Chase", "Zoey"])
		expect(dogNames.indexOf("Zoey")).toBe(2)
		expect(dogNames.indexOf("Jackson")).toBe(-1)
	})
})
