/**
 * Level Auto-Progression Service
 * 
 * Handles academic level calculations and progression logic for SIWES/SWEP students.
 * Engineering students max out at 500 level.
 */

export type AcademicLevel = '100' | '200' | '300' | '400' | '500';

export interface LevelProgression {
  currentLevel: AcademicLevel;
  nextLevel: AcademicLevel | null;
  canProgress: boolean;
  yearsToProgress: number;
}

/**
 * Calculate the next academic level based on current level
 * @param currentLevel - Current academic level (100, 200, 300, 400, 500)
 * @returns Level progression information
 */
export function calculateNextLevel(currentLevel: AcademicLevel): LevelProgression {
  const levels: AcademicLevel[] = ['100', '200', '300', '400', '500'];
  const currentIndex = levels.indexOf(currentLevel);
  
  if (currentIndex === -1) {
    throw new Error(`Invalid academic level: ${currentLevel}`);
  }

  const nextIndex = currentIndex + 1;
  const canProgress = nextIndex < levels.length;
  const nextLevel = canProgress ? levels[nextIndex] : null;

  return {
    currentLevel,
    nextLevel,
    canProgress,
    yearsToProgress: canProgress ? 1 : 0,
  };
}

/**
 * Validate if a level is valid for the system
 * @param level - Level to validate
 * @returns true if valid, false otherwise
 */
export function isValidLevel(level: string): level is AcademicLevel {
  const validLevels: AcademicLevel[] = ['100', '200', '300', '400', '500'];
  return validLevels.includes(level as AcademicLevel);
}

/**
 * Get all available levels in the system
 * @returns Array of all valid academic levels
 */
export function getAllLevels(): AcademicLevel[] {
  return ['100', '200', '300', '400', '500'];
}

/**
 * Calculate current level based on admission year and current year
 * @param admissionYear - Year student was admitted (e.g., 2021)
 * @param currentYear - Current year (defaults to current year)
 * @returns Calculated academic level
 */
export function calculateCurrentLevelByYear(
  admissionYear: number,
  currentYear: number = new Date().getFullYear()
): AcademicLevel {
  const yearsElapsed = currentYear - admissionYear;
  
  // Map years elapsed to academic levels
  // Year 0-1: 100, Year 1-2: 200, Year 2-3: 300, Year 3-4: 400, Year 4+: 500
  const levelMap: { [key: number]: AcademicLevel } = {
    0: '100',
    1: '200',
    2: '300',
    3: '400',
  };

  if (yearsElapsed >= 4) return '500';
  return levelMap[yearsElapsed] || '500';
}

/**
 * Calculate if a student can participate in SIWES based on their level
 * SIWES typically requires 300 level or higher
 * @param level - Current academic level
 * @returns true if eligible for SIWES
 */
export function isEligibleForSIWES(level: AcademicLevel): boolean {
  const levelNumber = parseInt(level);
  return levelNumber >= 300;
}

/**
 * Calculate if a student can participate in SWEP based on their level
 * SWEP is typically for 200 level students
 * @param level - Current academic level
 * @returns true if eligible for SWEP
 */
export function isEligibleForSWEP(level: AcademicLevel): boolean {
  const levelNumber = parseInt(level);
  return levelNumber >= 200;
}

/**
 * Get recommended program type based on current level
 * @param level - Current academic level
 * @returns 'SIWES' or 'SWEP' recommendation
 */
export function getRecommendedProgramType(level: AcademicLevel): 'SIWES' | 'SWEP' {
  if (isEligibleForSIWES(level)) {
    return 'SIWES';
  }
  return 'SWEP';
}
