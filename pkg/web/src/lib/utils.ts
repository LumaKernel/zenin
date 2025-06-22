/**
 * Promiseを安全に処理するための関数
 * エラーが発生した場合はconsole.warnでログ出力
 */
export const consumerPromise = <T>(promise: Promise<T>): void => {
  promise.catch(console.warn);
};
