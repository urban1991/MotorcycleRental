function updateObjFields(inputObject) {
  return Object.entries(inputObject).reduce(
    (acc, [key, value]) => ({
      ...acc,
      ...(value && {[key]: value}),
    }),
    {},
  );
}

module.exports = {updateObjFields};
