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

export class JwtService {
  constructor(private readonly secret: string) {}

  async sign(
    payload: string | Buffer | object,
    expiresIn?: number | string
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
      jsonwebtoken.verify(
        token,
        this.secret,
        { algorithms: ["RS256"] },
        (err, decoded) => {
          if (err) {
            reject(err);
          } else {
            resolve(decoded as JwtPayload);
          }
        }
      );
    });
  }
}

export const jwtService = new JwtService(
  "gsudykfhgbvzmaysgioufamuwhfldkcjnfstalwuvnfwegfyiuakjvapioweuropnvcifpasuhfkuhvsf"
);
