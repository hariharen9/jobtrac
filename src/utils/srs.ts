
// A simple Fibonacci sequence generator for SRS intervals
const fibonacci = (num: number): number => {
  if (num <= 1) return 1;
  let a = 0, b = 1, temp;
  for (let i = 0; i < num; i++) {
    temp = a + b;
    a = b;
    b = temp;
  }
  return b;
};

/**
 * Calculates the next review date and SRS stage based on confidence.
 * @param confidence The user's confidence level (1-5).
 * @param currentStage The current SRS stage of the topic.
 * @returns An object with the next review date and the new stage.
 */
export const calculateNextReview = (confidence: number, currentStage: number = 0) => {
  let nextStage = currentStage;
  let daysToAdd = 0;

  switch (confidence) {
    case 1: // Knew nothing
      nextStage = 0;
      daysToAdd = 1;
      break;
    case 2: // Barely knew
      nextStage = Math.floor(currentStage / 2);
      daysToAdd = fibonacci(nextStage);
      break;
    case 3: // Knew it, but was slow
      nextStage += 1;
      daysToAdd = fibonacci(nextStage);
      break;
    case 4: // Knew it well
      nextStage += 2;
      daysToAdd = fibonacci(nextStage);
      break;
    case 5: // Knew it perfectly
      nextStage += 3;
      daysToAdd = fibonacci(nextStage);
      break;
    default:
      daysToAdd = 1;
      break;
  }

  // Cap the stage to avoid excessively long intervals
  nextStage = Math.min(nextStage, 10); // Max interval of fib(10) = 89 days

  const nextReviewDate = new Date();
  nextReviewDate.setDate(nextReviewDate.getDate() + daysToAdd);

  return {
    nextReviewDate: nextReviewDate.toISOString().split('T')[0],
    srsStage: nextStage,
  };
};
