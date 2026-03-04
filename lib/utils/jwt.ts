import { cookies } from "next/headers";
import { JWTPayload, jwtVerify, SignJWT } from "jose";
import { Admin } from "@prisma/client";

export interface Payload extends JWTPayload {
	id: number;
	email: string;
	name: string;
}

const secretText =
	process.env.JWT_SECRET_KEY ??
	process.env.JWT_SECRET ??
	"change-this-in-production";

export const secretKey = new TextEncoder().encode(secretText);
export const expiration = Number(process.env.COOKIES_EXP ?? "24");

export const getAuthData = async (): Promise<Payload | null> => {
	const cookieStore = await cookies();
	const token = cookieStore.get("token")?.value ?? "";

	try {
		const { payload } = await jwtVerify(token, secretKey);
		return payload as Payload;
	} catch {
		return null;
	}
};

export const generateAdminAuthToken = (admin: Admin): Promise<string> => {
	const exp = Number(process.env.COOKIES_EXP ?? "24");

	return new SignJWT({
		id: admin.id,
		email: admin.email,
		name: admin.name,
	})
		.setProtectedHeader({ alg: "HS256" })
		.setIssuedAt()
		.setExpirationTime(`${exp}h`)
		.sign(secretKey);
};
