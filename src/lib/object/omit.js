export const omit = (obj, keys) => {
  const newObj = { ...obj };

  keys.forEach((key) => delete newObj[key]);

  return newObj;
};
