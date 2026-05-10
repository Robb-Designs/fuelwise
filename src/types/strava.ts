// Types for load calculator utilities
export type Activity = {
	id: number;
	date: string;
	activityName: string;
	activityType: "Run" | "Ride" | "Walk" | string;
	distanceMiles: number;
	durationMinutes: number;
	averagePace: number;
};

export type WeeklySummary = {
	week: string;
	totalLoad: number;
	totalMiles: number;
	workouts: number;
};

export type RiskLevel = "Low" | "Moderate" | "High";

export type FuelWiseResult = {
	weeklyLoad: number;
	loadChangePercent: number;
	risk: RiskLevel;
	recommendedMileage: number;
	trainingRecommendation: string;
	nutritionGuidance: string;
};
