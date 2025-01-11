export function replaceSearchParams(params: Record<string, string | undefined | boolean | null>): void {
  const sParams = new URLSearchParams();
  Object.entries(params).filter(([,value]) => value).forEach(([key, value]) => {
    sParams.set(key, String(value));
  });

  window.history.replaceState({}, '', `?${sParams.toString()}`);
}