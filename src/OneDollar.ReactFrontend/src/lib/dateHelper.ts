/**
 * Helper method to quickly identify if a timestamp has no time information attached.
 * 
 * @param timestamp The timestamp to check.
 * @returns True if no time info is found, otherwise false.
 */
function isTimestampWithoutTimeInfo(timestamp: Date): boolean {
  return (
    timestamp.getHours() === 0 && 
    timestamp.getMinutes() === 0 &&
    timestamp.getSeconds() === 0
  )
};

export { isTimestampWithoutTimeInfo };
