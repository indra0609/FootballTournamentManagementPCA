export class IdUtil {
  /** Example: T-7F2A1C */
  static short(prefix: string = 'ID'): string {
    const rand = crypto.randomUUID().replaceAll('-', '').slice(0, 6).toUpperCase();
    return `${prefix}-${rand}`;
  }

  /** Example: 7F2A1C */
  static code(length: number = 6): string {
    return crypto.randomUUID().replaceAll('-', '').slice(0, length).toUpperCase();
  }

  /** Full UUID */
  static uuid(): string {
    return crypto.randomUUID();
  }
}
