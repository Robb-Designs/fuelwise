import { useCallback, useEffect, useState } from "react";
import type { Dispatch, SetStateAction } from "react";
import type { Activity } from "../types/strava";

type FetchFailureKind = "config" | "network" | "http" | "json" | "empty";

type FetchDiagnostic = {
	kind: FetchFailureKind;
	message: string;
	endpoint?: string;
	status?: number;
	usedAuthorizationHeader: boolean;
};

type UseActivityFeedResult = {
	activities: Activity[];
	isLoading: boolean;
	error: string | null;
	isUsingMockData: boolean;
	dataSourceLabel: string;
	diagnostic: FetchDiagnostic | null;
	reload: () => Promise<void>;
};

type UnknownRecord = Record<string, unknown>;

const MOCK_ACTIVITIES: Activity[] = [
	{
		id: 9001,
		date: "2026-05-07T06:35:00Z",
		activityName: "Morning Tempo Run",
		activityType: "Run",
		distanceMiles: 5.4,
		durationMinutes: 41.8,
		averagePace: 7.74,
	},
	{
		id: 9002,
		date: "2026-05-06T18:10:00Z",
		activityName: "Easy Recovery Jog",
		activityType: "Run",
		distanceMiles: 3.2,
		durationMinutes: 29.4,
		averagePace: 9.19,
	},
	{
		id: 9003,
		date: "2026-05-05T17:45:00Z",
		activityName: "Track Intervals",
		activityType: "Run",
		distanceMiles: 6.1,
		durationMinutes: 46.3,
		averagePace: 7.59,
	},
	{
		id: 9004,
		date: "2026-05-03T07:10:00Z",
		activityName: "Long Run",
		activityType: "Run",
		distanceMiles: 10.8,
		durationMinutes: 87.4,
		averagePace: 8.09,
	},
	{
		id: 9005,
		date: "2026-04-30T18:00:00Z",
		activityName: "Steady State Run",
		activityType: "Run",
		distanceMiles: 4.9,
		durationMinutes: 39.1,
		averagePace: 7.98,
	},
	{
		id: 9006,
		date: "2026-04-28T06:50:00Z",
		activityName: "Hill Repeats",
		activityType: "Run",
		distanceMiles: 4.1,
		durationMinutes: 35.6,
		averagePace: 8.68,
	},
];

function readNumber(value: unknown): number | null {
	if (typeof value === "number" && Number.isFinite(value)) {
		return value;
	}

	if (typeof value === "string") {
		const parsed = Number(value);
		return Number.isFinite(parsed) ? parsed : null;
	}

	return null;
}

function readString(value: unknown): string | null {
	if (typeof value === "string" && value.trim().length > 0) {
		return value;
	}

	return null;
}

function normalizeActivity(record: UnknownRecord): Activity | null {
	const id = readNumber(record.id ?? record.activity_id);
	const date =
		readString(record.date) ??
		readString(record.start_date) ??
		readString(record.startDate);

	const activityName =
		readString(record.activityName) ??
		readString(record.activity_name) ??
		readString(record.name) ??
		"Activity";

	const activityType =
		readString(record.activityType) ??
		readString(record.activity_type) ??
		readString(record.type) ??
		"Run";

	const distanceMilesDirect =
		readNumber(record.distanceMiles) ?? readNumber(record.distance_miles);
	const distanceKm = readNumber(record.distanceKm) ?? readNumber(record.distance_km);
	const distanceRaw = readNumber(record.distance);

	let distanceMiles = distanceMilesDirect;
	if (distanceMiles == null && distanceKm != null) {
		distanceMiles = distanceKm / 1.60934;
	}
	if (distanceMiles == null && distanceRaw != null) {
		distanceMiles = distanceRaw > 200 ? distanceRaw / 1609.34 : distanceRaw;
	}

	const durationMinutesDirect =
		readNumber(record.durationMinutes) ?? readNumber(record.duration_minutes);
	const movingTime = readNumber(record.moving_time);
	const elapsedTime = readNumber(record.elapsed_time);
	const durationRaw = readNumber(record.duration);

	let durationMinutes = durationMinutesDirect;
	if (durationMinutes == null && movingTime != null) {
		durationMinutes = movingTime / 60;
	}
	if (durationMinutes == null && elapsedTime != null) {
		durationMinutes = elapsedTime / 60;
	}
	if (durationMinutes == null && durationRaw != null) {
		durationMinutes = durationRaw > 240 ? durationRaw / 60 : durationRaw;
	}

	const averagePaceDirect =
		readNumber(record.averagePace) ?? readNumber(record.average_pace) ?? readNumber(record.pace);

	const averagePace =
		averagePaceDirect ??
		(durationMinutes && distanceMiles && distanceMiles > 0
			? durationMinutes / distanceMiles
			: null);

	if (
		id == null ||
		date == null ||
		distanceMiles == null ||
		durationMinutes == null ||
		averagePace == null
	) {
		return null;
	}

	return {
		id,
		date,
		activityName,
		activityType,
		distanceMiles: Number(distanceMiles.toFixed(2)),
		durationMinutes: Number(durationMinutes.toFixed(1)),
		averagePace: Number(averagePace.toFixed(2)),
	};
}

function extractActivityArray(payload: unknown): unknown[] {
	if (Array.isArray(payload)) {
		return payload;
	}

	if (payload && typeof payload === "object") {
		const candidate = payload as UnknownRecord;
		const nested = candidate.activities ?? candidate.data;

		if (Array.isArray(nested)) {
			return nested;
		}

		if (nested && typeof nested === "object") {
			const deeper = (nested as UnknownRecord).activities;
			if (Array.isArray(deeper)) {
				return deeper;
			}
		}
	}

	return [];
}

function createDiagnostic(
	kind: FetchFailureKind,
	message: string,
	usedAuthorizationHeader: boolean,
	endpoint?: string,
	status?: number,
): FetchDiagnostic {
	return {
		kind,
		message,
		endpoint,
		status,
		usedAuthorizationHeader,
	};
}

function applyMockFallback(
	setActivities: Dispatch<SetStateAction<Activity[]>>,
	setError: Dispatch<SetStateAction<string | null>>,
	setIsUsingMockData: Dispatch<SetStateAction<boolean>>,
	setDataSourceLabel: Dispatch<SetStateAction<string>>,
	setDiagnostic: Dispatch<SetStateAction<FetchDiagnostic | null>>,
	diagnostic: FetchDiagnostic,
	errorMessage: string,
) {
	console.warn("[FuelWise experimental fetch fallback]", diagnostic);
	setActivities(MOCK_ACTIVITIES);
	setError(errorMessage);
	setIsUsingMockData(true);
	setDataSourceLabel("Mock fallback data");
	setDiagnostic(diagnostic);
}

export function useActivityFeed(accessToken: string | null): UseActivityFeedResult {
	const [activities, setActivities] = useState<Activity[]>([]);
	const [isLoading, setIsLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);
	const [isUsingMockData, setIsUsingMockData] = useState(false);
	const [dataSourceLabel, setDataSourceLabel] = useState("Live API data");
	const [diagnostic, setDiagnostic] = useState<FetchDiagnostic | null>(null);

	const reload = useCallback(async () => {
		const baseUrl = import.meta.env.VITE_API_BASE_URL;
		const configuredPath = import.meta.env.VITE_ACTIVITIES_PATH;
		const devBypassAuth = import.meta.env.VITE_DEV_BYPASS_AUTH === "true";
		const shouldSendAuthorizationHeader = Boolean(accessToken) && !devBypassAuth;
		const endpointCandidates = [
			configuredPath,
			"/api/hefit/activities",
			"/api/activities",
			"/api/strava/activities",
		].filter((value): value is string => Boolean(value));

		if (!baseUrl) {
			const missingConfigDiagnostic = createDiagnostic(
				"config",
				"VITE_API_BASE_URL is not configured.",
				shouldSendAuthorizationHeader,
			);
			setIsLoading(false);
			applyMockFallback(
				setActivities,
				setError,
				setIsUsingMockData,
				setDataSourceLabel,
				setDiagnostic,
				missingConfigDiagnostic,
				"Using mock activities because the API base URL is not configured.",
			);
			return;
		}

		setIsLoading(true);
		setError(null);
		setDiagnostic(null);
		setIsUsingMockData(false);
		setDataSourceLabel("Live API data");

		let latestDiagnostic: FetchDiagnostic | null = null;

		for (const path of endpointCandidates) {
			const endpoint = `${baseUrl}${path}`;

			try {
				const response = await fetch(endpoint, {
					headers: shouldSendAuthorizationHeader
						? { Authorization: `Bearer ${accessToken}` }
						: undefined,
				});

				if (!response.ok) {
					latestDiagnostic = createDiagnostic(
						"http",
						`Request failed with status ${response.status}.`,
						shouldSendAuthorizationHeader,
						endpoint,
						response.status,
					);
					console.warn("[FuelWise experimental fetch] HTTP failure", latestDiagnostic);
					continue;
				}

				let payload: unknown;

				try {
					payload = (await response.json()) as unknown;
				} catch {
					latestDiagnostic = createDiagnostic(
						"json",
						"Response body was not valid JSON.",
						shouldSendAuthorizationHeader,
						endpoint,
						response.status,
					);
					console.warn("[FuelWise experimental fetch] JSON failure", latestDiagnostic);
					continue;
				}

				const records = extractActivityArray(payload);

				if (records.length === 0) {
					latestDiagnostic = createDiagnostic(
						"empty",
						"Response succeeded but returned no activity records.",
						shouldSendAuthorizationHeader,
						endpoint,
						response.status,
					);
					console.info("[FuelWise experimental fetch] Empty activity payload", latestDiagnostic);
					continue;
				}

				const normalized = records
					.map((record) =>
						record && typeof record === "object"
							? normalizeActivity(record as UnknownRecord)
							: null,
					)
					.filter((record): record is Activity => Boolean(record));

				if (normalized.length === 0) {
					latestDiagnostic = createDiagnostic(
						"empty",
						"Activity records were returned but none matched the current schema mapping.",
						shouldSendAuthorizationHeader,
						endpoint,
						response.status,
					);
					console.info("[FuelWise experimental fetch] Schema mismatch while normalizing", latestDiagnostic);
					continue;
				}

				setActivities(normalized);
				setIsLoading(false);
				setError(null);
				setIsUsingMockData(false);
				setDataSourceLabel(path === configuredPath ? "Configured live API data" : "Live API data");
				setDiagnostic(null);
				return;
			} catch (error) {
				latestDiagnostic = createDiagnostic(
					"network",
					error instanceof Error ? error.message : "Unexpected network error.",
					shouldSendAuthorizationHeader,
					endpoint,
				);
				console.warn("[FuelWise experimental fetch] Network failure", latestDiagnostic);
			}
		}

		const fallbackDiagnostic =
			latestDiagnostic ??
			createDiagnostic(
				"empty",
				"No working activity endpoint was found.",
				shouldSendAuthorizationHeader,
			);

		applyMockFallback(
			setActivities,
			setError,
			setIsUsingMockData,
			setDataSourceLabel,
			setDiagnostic,
			fallbackDiagnostic,
			`Using mock activities for testing. Last fetch issue: ${fallbackDiagnostic.message}`,
		);
		setIsLoading(false);
	}, [accessToken]);

	useEffect(() => {
		reload();
	}, [reload]);

	return {
		activities,
		isLoading,
		error,
		isUsingMockData,
		dataSourceLabel,
		diagnostic,
		reload,
	};
}

export const useStrava = useActivityFeed;
