import jsonwebtoken from "jsonwebtoken";

export interface JwtPayload {
	[key: string]: any;
	iss?: string | undefined;
	sub?: string | undefined;
	aud?: string | string[] | undefined;
	exp: number;
	nbf: number;
	iat?: number | undefined;
	jti?: string | undefined;
	azp: string;
}

type Unit =
	| "Years"
	| "Year"
	| "Yrs"
	| "Yr"
	| "Y"
	| "Weeks"
	| "Week"
	| "W"
	| "Days"
	| "Day"
	| "D"
	| "Hours"
	| "Hour"
	| "Hrs"
	| "Hr"
	| "H"
	| "Minutes"
	| "Minute"
	| "Mins"
	| "Min"
	| "M"
	| "Seconds"
	| "Second"
	| "Secs"
	| "Sec"
	| "s"
	| "Milliseconds"
	| "Millisecond"
	| "Msecs"
	| "Msec"
	| "Ms";

type UnitAnyCase = Unit | Uppercase<Unit> | Lowercase<Unit>;

type StringValue =
	| `${number}`
	| `${number}${UnitAnyCase}`
	| `${number} ${UnitAnyCase}`;

export class JwtService {
	constructor(private readonly secret: string) {}

	async sign(
		payload: string | object,
		expiresIn?: number | StringValue,
	): Promise<string> {
		return await new Promise((resolve, reject) => {
			jsonwebtoken.sign(payload, this.secret, { expiresIn }, (err, token) => {
				if (err || !token) {
					reject(err);
				} else {
					resolve(token);
				}
			});
		});
	}

	async verify(token: string): Promise<JwtPayload> {
		return await new Promise((resolve, reject) => {
			jsonwebtoken.verify(token, this.secret, (err, decoded) => {
				if (err) {
					reject(err);
				} else {
					resolve(decoded as JwtPayload);
				}
			});
		});
	}
}

export const jwtService = new JwtService(
	"gsudykfhgbvzmaysgioufamuwhfldkcjnfstalwuvnfwegfyiuakjvapioweuropnvcifpasuhfkuhvsf",
);
