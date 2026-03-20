export type Vector3 = [number, number, number]
export type Vector2 = [number, number]
export type XYRestrainedVector3 = [number, number, 0]
export type XZRestrainedVector3 = [number, 0, number]
export type FlatVector3 = XYRestrainedVector3 | XZRestrainedVector3
/** I represent the medal times (in ticks). */
export interface MedalTimes {
	platinum: number
	gold: number
	silver: number
	bronze: number
}
export interface UvData {
	blockId: number
	faceId: number
	startX: number
	startY: number
	endX: number
	endY: number
}
