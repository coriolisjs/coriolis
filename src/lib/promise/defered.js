export const defered = () => {
  let externalResolve;
  let externalReject;
  const promise = new Promise((resolve, reject) => {
    externalResolve = resolve;
    externalReject = reject;
  });

  return {
    promise,
    resolve: externalResolve,
    reject: externalReject,
  };
};
