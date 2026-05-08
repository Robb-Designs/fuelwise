type SpinnerProps = {
	label?: string;
};

export default function Spinner({ label = "Loading data..." }: SpinnerProps) {
	return (
		<div className="flex min-h-50 flex-col items-center justify-center gap-3 text-stone-600">
			<div className="h-8 w-8 animate-spin rounded-full border-4 border-stone-300 border-t-[#BC6C25]" />
			<p className="text-sm">{label}</p>
		</div>
	);
}
