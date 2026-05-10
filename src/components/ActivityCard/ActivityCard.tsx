import type { Activity } from "../../types/strava";

type ActivityCardProps = {
	activity: Activity;
};

function formatDate(dateInput: string) {
	const parsedDate = new Date(dateInput);

	if (Number.isNaN(parsedDate.getTime())) {
		return dateInput;
	}

	return parsedDate.toLocaleDateString(undefined, {
		month: "short",
		day: "numeric",
		year: "numeric",
	});
}

export default function ActivityCard({ activity }: ActivityCardProps) {
	return (
		<article className="rounded-xl border border-stone-200 bg-white p-4">
			<div className="flex items-start justify-between gap-4">
				<div>
					<p className="text-sm font-semibold text-stone-900">{activity.activityName}</p>
					<p className="mt-1 text-xs uppercase tracking-wide text-stone-500">
						{activity.activityType}
					</p>
				</div>
				<p className="text-xs text-stone-500">{formatDate(activity.date)}</p>
			</div>

			<div className="mt-3 grid grid-cols-3 gap-2 text-sm text-stone-700">
				<div>
					<p className="text-xs text-stone-500">Distance</p>
					<p>{activity.distanceMiles.toFixed(2)} mi</p>
				</div>
				<div>
					<p className="text-xs text-stone-500">Duration</p>
					<p>{activity.durationMinutes.toFixed(0)} min</p>
				</div>
				<div>
					<p className="text-xs text-stone-500">Avg Pace</p>
					<p>{activity.averagePace.toFixed(2)} min/mi</p>
				</div>
			</div>
		</article>
	);
}
