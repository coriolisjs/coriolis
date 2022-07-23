export const useProjection =
  (settings) =>
  (projection, refreshOnNewValue = true) => {
    if (!refreshOnNewValue) {
      settings.skipIndexes.push(settings.sources.length)
    }

    settings.sources.push(projection)
  }
