export default (cond: any, message: string) => {
  if (!cond) {
    throw Error(message);
  }
};
