import { Transform } from 'class-transformer';

/**
 * Transforma un valor recibido como query param string a booleano.
 * Acepta: true, false, 'true', 'false', '1', '0', 'yes', 'no', 'si'.
 */
export function toBoolean() {
  return Transform(({ value }) => {
    if (typeof value === 'boolean') return value;
    if (typeof value === 'string') {
      const falsy = ['false', '0', 'no', ''];
      if (falsy.includes(value.toLowerCase())) return false;
      return true;
    }
    return Boolean(value);
  });
}
