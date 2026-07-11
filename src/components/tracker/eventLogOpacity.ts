const EVENT_LOG_FULL_OPACITY_AGE = 3 * 60 * 1000;
const EVENT_LOG_MIN_OPACITY_AGE = 60 * 60 * 1000;
const EVENT_LOG_FULL_OPACITY = 1;
const EVENT_LOG_INITIAL_FADED_OPACITY = 0.75;
const EVENT_LOG_MIN_OPACITY = 0.4;

export function getEventLogEntryOpacity(timestamp: number, now: number) {
  const age = Math.max(0, now - timestamp);

  if (age < EVENT_LOG_FULL_OPACITY_AGE) {
    return EVENT_LOG_FULL_OPACITY;
  }

  if (age >= EVENT_LOG_MIN_OPACITY_AGE) {
    return EVENT_LOG_MIN_OPACITY;
  }

  const fadeProgress =
    (age - EVENT_LOG_FULL_OPACITY_AGE) /
    (EVENT_LOG_MIN_OPACITY_AGE - EVENT_LOG_FULL_OPACITY_AGE);

  return EVENT_LOG_INITIAL_FADED_OPACITY - (fadeProgress * (EVENT_LOG_INITIAL_FADED_OPACITY - EVENT_LOG_MIN_OPACITY));
}
