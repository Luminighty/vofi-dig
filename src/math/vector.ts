export interface IVector2 {
	x: number, y: number
}

export const Vector2 = {
	new: (x: number, y: number) => ({ x, y }),

	add: (left: IVector2, right: IVector2): IVector2 => Vector2.new(left.x + right.x, left.y + right.y),
	scalar: (scale: number, self: IVector2): IVector2 => Vector2.new(self.x * scale, self.y * scale),
	
	/** (a, b) => (-a, -b) */
	neg: (self: IVector2): IVector2 => Vector2.scalar(-1, self),

	/** A - B => (A.x - B.x, A.y - B.y) */
	sub: (left: IVector2, right: IVector2): IVector2 => Vector2.add(left, Vector2.neg(right)),

	/** A · B = A.x * B.x + A.y * B.y */
	dot: (left: IVector2, right: IVector2) => left.x * right.x + left.y * right.y,

	orthogonal: (self: IVector2) => Vector2.new(-self.y, self.x),
}

