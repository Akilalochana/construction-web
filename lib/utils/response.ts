import { NextResponse } from "next/server";

export class ApiResponse {
	public static success(message: string, data?: unknown) {
		return NextResponse.json(
			{
				message,
				error: null,
				data: data ?? {},
			},
			{ status: 200 }
		);
	}

	public static successWithAuth(
		message: string,
		token: string,
		expirationHours: number,
		data?: unknown
	) {
		const response = NextResponse.json(
			{
				message,
				error: null,
				data: data ?? {},
			},
			{ status: 200 }
		);

		response.cookies.set("token", token, {
			httpOnly: true,
			secure: process.env.NODE_ENV === "production",
			sameSite: "lax",
			path: "/",
			maxAge: expirationHours * 60 * 60,
		});

		return response;
	}

	public static failed(
		message = "Provided some invalid details, please check and submit again.",
		validations: Record<string, unknown> | null = null
	) {
		return NextResponse.json(
			{
				message,
				error: null,
				validations,
			},
			{ status: 400 }
		);
	}

	public static unauthorized(message?: string) {
		return NextResponse.json(
			{
				message: message ?? "You must be authenticated to access this resource.",
				error: null,
			},
			{ status: 401 }
		);
	}

	public static forbidden(message?: string) {
		return NextResponse.json(
			{
				message: message ?? "You do not have permission to access this resource.",
				error: null,
			},
			{ status: 403 }
		);
	}

	public static notFound(message?: string) {
		return NextResponse.json(
			{
				message:
					message ?? "The requested resource could not be found on this server.",
				error: null,
			},
			{ status: 404 }
		);
	}

	public static serverError(error: unknown) {
		const message = error instanceof Error ? error.message : "Something went wrong.";
		return NextResponse.json(
			{
				message: "We encountered an unexpected issue, please try again later.",
				error: message,
			},
			{ status: 500 }
		);
	}

	public static error(message?: string) {
		return NextResponse.json(
			{
				message: message ?? "An error occurred while processing your request.",
				error: null,
			},
			{ status: 500 }
		);
	}
}
