export function classNames(...classNamesList: (string | Record<string, boolean> | null | undefined)[]) {
  let result = '';

  classNamesList.forEach(item => {
    if (typeof item === "string" && item) {
      result += ' ' + item;
    }

    if (typeof item === 'object' && item !== null) {
      for (const objKey in item) {
        if (item[objKey]) {
          result += ' ' + objKey;
        }
      }
    }
  });

  return result;
}
