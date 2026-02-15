import { useCaseSchema } from './_schema';
import type { UseCase } from '@/types';

import healthyRecipe from './healthy-recipe.json';
import pantryMeal from './pantry-meal.json';
import difficultEmail from './difficult-email.json';
import billNegotiation from './bill-negotiation.json';
import weekendTrip from './weekend-trip.json';
import giftIdeas from './gift-ideas.json';
import contractorQuote from './contractor-quote.json';
import techExplainer from './tech-explainer.json';
import popCulture from './pop-culture.json';
import mealPlanWeek from './meal-plan-week.json';
import resumeUpdate from './resume-update.json';
import exercisePlan from './exercise-plan.json';
import conversationStarters from './conversation-starters.json';
import sideHustle from './side-hustle.json';
import vacationPacking from './vacation-packing.json';
import sympathyMessage from './sympathy-message.json';
import majorPurchase from './major-purchase.json';
import parentTeacherPrep from './parent-teacher-prep.json';
import homeEnergy from './home-energy.json';

const rawUseCases = [
  healthyRecipe,
  pantryMeal,
  difficultEmail,
  billNegotiation,
  weekendTrip,
  giftIdeas,
  contractorQuote,
  techExplainer,
  popCulture,
  mealPlanWeek,
  resumeUpdate,
  exercisePlan,
  conversationStarters,
  sideHustle,
  vacationPacking,
  sympathyMessage,
  majorPurchase,
  parentTeacherPrep,
  homeEnergy,
];

// Validate all use cases at build time
export const useCases: UseCase[] = rawUseCases.map((raw) => {
  const parsed = useCaseSchema.parse(raw);
  return parsed as UseCase;
});
