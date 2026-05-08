type ErrorMessageProps = {
	message: string;
	title?: string;
	tone?: "error" | "warning";
	onRetry?: () => void;
};

export default function ErrorMessage({
	message,
	title,
	tone = "error",
	onRetry,
}: ErrorMessageProps) {
	const styles =
		tone === "warning"
			? {
				container: "border-amber-200 bg-amber-50 text-amber-900",
				button: "border-amber-300 text-amber-800 hover:bg-amber-100",
			}
			: {
				container: "border-red-200 bg-red-50 text-red-800",
				button: "border-red-300 text-red-700 hover:bg-red-100",
			};

	return (
		<div className={`rounded-xl border p-4 ${styles.container}`}>
			{title ? <p className="text-sm font-semibold">{title}</p> : null}
			<p className="text-sm font-medium">{message}</p>
			{onRetry ? (
				<button
					type="button"
					onClick={onRetry}
					className={`mt-3 rounded-md border bg-white px-3 py-1.5 text-sm ${styles.button}`}
				>
					Try again
				</button>
			) : null}
		</div>
	);
}
