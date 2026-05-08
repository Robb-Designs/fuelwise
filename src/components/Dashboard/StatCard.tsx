type StatCardProps = {
	title: string;
	value: string | number;
	subtitle: string;
};

export default function StatCard({ title, value, subtitle }: StatCardProps) {
	return (
		<article className="rounded-2xl border border-stone-200 bg-white p-5 shadow-sm">
			<p className="text-xs uppercase tracking-wide text-stone-500">{title}</p>
			<p className="mt-3 text-3xl font-semibold tracking-tight text-stone-900">{value}</p>
			<p className="mt-1 text-sm text-stone-600">{subtitle}</p>
		</article>
	);
}
