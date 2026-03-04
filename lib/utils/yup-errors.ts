import * as yup from "yup";

const getYupErrors = <T extends Record<string, unknown>>(
	error: yup.ValidationError
): Partial<T> => {
	const errors = error.inner.reduce((acc, curr: yup.ValidationError) => {
		if (curr.path) {
			acc[curr.path as keyof T] = curr.message as T[keyof T];
		}
		return acc;
	}, {} as Partial<T>);
	return errors;
};

export const getYupErrorsUF = (error: yup.ValidationError) => {
	const formattedErrors = error.inner.reduce(
		(acc: Record<string, string>, curr) => {
			if (curr.path && !acc[curr.path]) {
				acc[curr.path] = curr.message;
			}
			return acc;
		},
		{}
	);
	return formattedErrors;
};

export default getYupErrors;
