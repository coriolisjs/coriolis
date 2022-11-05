export const sourceEvent = {};

export const useEvent = (settings) => (...eventTypes) => {
  if (settings.eventTypes !== undefined) {
    throw new Error(
      "useEvent should not be called more than once in an projection definition setup",
    );
  }
  // flag true if catching all events (means skip filtering interesting events)
  settings.allEvents = !eventTypes.length;
  settings.eventTypes = eventTypes.map((eventType) => eventType.toString());

  settings.sources.push(sourceEvent);
};
