/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Candidate, CriteriaWeights, SubFactorScores } from '../types/matchmaking';

/**
 * Calculates domain percentages (0 - 100) and weighted overall score for a candidate
 */
export function calculateCandidateScores(
  subFactors: SubFactorScores,
  weights: CriteriaWeights,
  passedDealBreakers: boolean
): {
  overallScore: number;
  domainScores: {
    values: number;
    academic: number;
    lifestyle: number;
    emotional: number;
  };
} {
  // Domain 1: Values & Worldview (3 factors)
  const valuesAvg =
    ((subFactors.worldviewMatch + subFactors.integrity + subFactors.familyCulture) / 3) * 10;

  // Domain 2: Academic & Intellectual (3 factors)
  const academicAvg =
    ((subFactors.phdUnderstanding + subFactors.intellectualSynergy + subFactors.careerAmbition) / 3) * 10;

  // Domain 3: Lifestyle (3 factors)
  const lifestyleAvg =
    ((subFactors.workLifeBalance + subFactors.interestsAlignment + subFactors.relocationFlexibility) / 3) * 10;

  // Domain 4: Emotional & Relational (3 factors)
  const emotionalAvg =
    ((subFactors.emotionalMaturity + subFactors.communicationStyle + subFactors.conflictResolution) / 3) * 10;

  // Normalize weights so they sum to 1.0 even if adjusted
  const totalWeight =
    (weights.valuesWeight || 1) +
    (weights.academicWeight || 1) +
    (weights.lifestyleWeight || 1) +
    (weights.emotionalWeight || 1);

  const wValues = (weights.valuesWeight || 0) / totalWeight;
  const wAcademic = (weights.academicWeight || 0) / totalWeight;
  const wLifestyle = (weights.lifestyleWeight || 0) / totalWeight;
  const wEmotional = (weights.emotionalWeight || 0) / totalWeight;

  const rawWeightedScore =
    valuesAvg * wValues +
    academicAvg * wAcademic +
    lifestyleAvg * wLifestyle +
    emotionalAvg * wEmotional;

  // If candidate fails critical non-negotiable deal-breakers, apply heavy penalty or cap
  const adjustedScore = passedDealBreakers
    ? Math.round(rawWeightedScore)
    : Math.round(Math.min(rawWeightedScore * 0.5, 45));

  return {
    overallScore: Math.max(0, Math.min(100, adjustedScore)),
    domainScores: {
      values: Math.round(valuesAvg),
      academic: Math.round(academicAvg),
      lifestyle: Math.round(lifestyleAvg),
      emotional: Math.round(emotionalAvg),
    },
  };
}

/**
 * Recomputes all candidates with current criteria weights
 */
export function recomputeAllCandidates(
  candidates: Candidate[],
  weights: CriteriaWeights
): Candidate[] {
  return candidates.map((candidate) => {
    const scores = calculateCandidateScores(
      candidate.subFactors,
      weights,
      candidate.passedDealBreakers
    );
    return {
      ...candidate,
      overallScore: scores.overallScore,
      domainScores: scores.domainScores,
    };
  });
}
