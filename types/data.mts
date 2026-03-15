export type Vector3 = [number, number, number]
export type Vector2 = [number, number]
export type XYRestrainedVector3 = [number, number, 0]
export type XZRestrainedVector3 = [number, 0, number]
export type FlatVector3 = XYRestrainedVector3 | XZRestrainedVector3
/** The rotation of the object I represent. */
export type RotationPropertyDocumentation = number
/** The scale of the object I represent. */
export type ScalePropertyDocumentation = Vector3
/** I represent the medal times (in ticks). */
export interface MedalTimes {
	platinum: number
	gold: number
	silver: number
	bronze: number
}
