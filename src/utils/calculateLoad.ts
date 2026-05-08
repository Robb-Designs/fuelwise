// Import types from types folder
import { Activity, WeeklySummary, RiskLevel, FuelWiseResult } from "../types/strava";

// Helper function to determine intensity score based on pace 
// Faster pace = higher intensity
export function getIntensity(pace: number): number {
  if (pace <= 8) return 8;     // fast run
  if (pace <= 10) return 6;    // moderate run
  if (pace <= 12) return 4;    // easy run
  return 3;                    // very easy / recovery
}

// Calculate load for a single workout
// Load = duration × intensity
export function calculateWorkoutLoad(activity: Activity): number {
  return activity.durationMinutes * getIntensity(activity.averagePace);
}


// Get the start of the week (Sunday)
// Used to group workouts into weeks
export function getWeekStart(dateString: string): string {
  const date = new Date(dateString);
  const day = date.getDay(); // 0 = Sunday
  date.setDate(date.getDate() - day);
  return date.toISOString().split("T")[0];
}



// Group activities by week and calculate totals
export function calculateWeeklyLoad(
  activities: Activity[]
): WeeklySummary[] {

  // Store weekly data using a dictionary
  const weeks: Record<string, WeeklySummary> = {};

  // Only include runs (ignore other activity types)
  activities
    .filter((activity) => activity.activityType === "Run")
    .forEach((activity) => {

      const week = getWeekStart(activity.date);

      // Calculate load for this workout
      const load = calculateWorkoutLoad(activity);

      // Initialize week if it doesn’t exist
      if (!weeks[week]) {
        weeks[week] = {
          week,
          totalLoad: 0,
          totalMiles: 0,
          workouts: 0,
        };
      }

      // Accumulate weekly totals
      weeks[week].totalLoad += load;
      weeks[week].totalMiles += activity.distanceMiles;
      weeks[week].workouts += 1;
    });

  // Convert object → array and sort by date
  return Object.values(weeks).sort(
    (a, b) =>
      new Date(a.week).getTime() - new Date(b.week).getTime()
  );
}



// =========================
// ANALYSIS FUNCTIONS
// =========================

// Calculate % change between two weeks
export function calculateLoadChange(
  previousLoad: number,
  currentLoad: number
): number {
  if (previousLoad === 0) return 0;

  return ((currentLoad - previousLoad) / previousLoad) * 100;
}



// Determine injury risk based on load increase
export function getRiskLevel(
  loadChangePercent: number
): RiskLevel {

  if (loadChangePercent >= 25) return "High";
  if (loadChangePercent >= 10) return "Moderate";

  return "Low";
}



// Recommend next week’s mileage based on risk
export function getRecommendedMileage(
  currentMiles: number,
  risk: RiskLevel
): number {

  if (risk === "High") {
    return Number((currentMiles * 0.8).toFixed(1));
  }

  if (risk === "Moderate") {
    return Number((currentMiles * 0.9).toFixed(1));
  }

  // Safe to increase slightly
  return Number((currentMiles * 1.05).toFixed(1));
}



// Training advice shown to the user
export function getTrainingRecommendation(
  risk: RiskLevel
): string {

  if (risk === "High") {
    return "Reduce mileage by 15–20% next week and add at least one recovery day.";
  }

  if (risk === "Moderate") {
    return "Slightly reduce intensity and monitor fatigue, soreness, and sleep quality.";
  }

  return "Training load is progressing safely. You may increase mileage slightly if recovery feels good.";
}



// Nutrition guidance based on load + risk
export function getNutritionGuidance(
  weeklyLoad: number,
  risk: RiskLevel
): string {

  if (risk === "High") {
    return "Prioritize recovery meals with protein, complex carbohydrates, hydration, and electrolytes.";
  }

  if (weeklyLoad > 700) {
    return "Increase carbohydrates before harder workouts and include protein after training.";
  }

  return "Maintain balanced meals with hydration, protein, and carbohydrates to support recovery.";
}



// =========================
// FINAL AGGREGATION FUNCTION
// =========================

// This is the MAIN function your UI will call
export function generateFuelWiseResult(
  weeklySummaries: WeeklySummary[]
): FuelWiseResult | null {

  if (weeklySummaries.length === 0) return null;

  const currentWeek = weeklySummaries[weeklySummaries.length - 1];
  const previousWeek = weeklySummaries[weeklySummaries.length - 2];

  // Calculate week-over-week change
  const loadChangePercent = previousWeek
    ? calculateLoadChange(
        previousWeek.totalLoad,
        currentWeek.totalLoad
      )
    : 0;

  // Determine risk level
  const risk = getRiskLevel(loadChangePercent);

  return {
    weeklyLoad: Number(currentWeek.totalLoad.toFixed(0)),
    loadChangePercent: Number(loadChangePercent.toFixed(1)),
    risk,

    // Recommendations
    recommendedMileage: getRecommendedMileage(
      currentWeek.totalMiles,
      risk
    ),
    trainingRecommendation: getTrainingRecommendation(risk),
    nutritionGuidance: getNutritionGuidance(
      currentWeek.totalLoad,
      risk
    ),
  };
}