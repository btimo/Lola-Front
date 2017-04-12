export const filterObject = (obj, predicate) => (
  Object.assign({}, ...Object.keys(obj)
  .filter(key => predicate(obj[key]))
  .map(key => ({ [key]: obj[key] })))
);
