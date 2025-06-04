export function generateTempId() {
  return new Date().valueOf().toString(36) + Math.random().toString(36).substring(2);
}
