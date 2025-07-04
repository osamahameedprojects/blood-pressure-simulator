/**
 * Blood Pressure Scenario Validation Utilities
 * Ensures generated BP readings match medical guidelines for each scenario
 */

export interface BPReading {
  systolic: number;
  diastolic: number;
}

export interface ScenarioValidation {
  isValid: boolean;
  expectedCategory: string;
  actualCategory: string;
  warnings: string[];
}

/**
 * Validates if a BP reading is appropriate for the given scenario
 */
export const validateScenarioBP = (
  scenarioKey: string,
  reading: BPReading
): ScenarioValidation => {
  const { systolic, diastolic } = reading;
  const warnings: string[] = [];
  let isValid = true;
  let expectedCategory = '';
  let actualCategory = getBPCategory(systolic, diastolic);

  switch (scenarioKey) {
    case 'healthy':
      expectedCategory = 'Normal';
      if (systolic >= 120 || diastolic >= 80) {
        isValid = false;
        warnings.push('BP reading is elevated for a healthy adult scenario');
      }
      if (systolic < 90 || diastolic < 60) {
        warnings.push('BP reading may be too low (hypotensive)');
      }
      break;

    case 'hypertensive':
      expectedCategory = 'Stage 1 or 2 Hypertension';
      if (systolic < 130 && diastolic < 80) {
        isValid = false;
        warnings.push('BP reading is too low for hypertensive scenario');
      }
      if (systolic > 180 || diastolic > 120) {
        warnings.push('BP reading indicates hypertensive crisis - medical emergency');
      }
      break;

    case 'arrhythmic':
      expectedCategory = 'Variable (Normal to Hypertensive)';
      // Arrhythmic can have variable readings, so more lenient validation
      if (systolic < 70 || systolic > 200) {
        warnings.push('Systolic reading outside realistic range for arrhythmic patient');
      }
      if (diastolic < 40 || diastolic > 130) {
        warnings.push('Diastolic reading outside realistic range for arrhythmic patient');
      }
      break;

    default:
      expectedCategory = 'Unknown';
      warnings.push('Unknown scenario type');
      isValid = false;
  }

  return {
    isValid,
    expectedCategory,
    actualCategory,
    warnings,
  };
};

/**
 * Categorizes BP reading according to AHA 2017 Guidelines
 */
export const getBPCategory = (systolic: number, diastolic: number): string => {
  if (systolic < 120 && diastolic < 80) return 'Normal';
  if (systolic < 130 && diastolic < 80) return 'Elevated';
  if ((systolic >= 130 && systolic <= 139) || (diastolic >= 80 && diastolic <= 89)) {
    return 'Stage 1 Hypertension';
  }
  if (systolic >= 140 || diastolic >= 90) return 'Stage 2 Hypertension';
  if (systolic >= 180 || diastolic >= 120) return 'Hypertensive Crisis';
  return 'Unknown';
};

/**
 * Gets expected BP ranges for each scenario (for educational purposes)
 */
export const getScenarioRanges = (scenarioKey: string) => {
  switch (scenarioKey) {
    case 'healthy':
      return {
        systolic: { min: 90, max: 119 },
        diastolic: { min: 60, max: 79 },
        description: 'Normal blood pressure range'
      };
    case 'hypertensive':
      return {
        systolic: { min: 130, max: 170 },
        diastolic: { min: 80, max: 110 },
        description: 'Hypertensive range (Stage 1 & 2)'
      };
    case 'arrhythmic':
      return {
        systolic: { min: 70, max: 200 },
        diastolic: { min: 40, max: 130 },
        description: 'Variable range due to irregular rhythm'
      };
    default:
      return null;
  }
}; 