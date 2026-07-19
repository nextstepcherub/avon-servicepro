import { v4 as uuidv4, validate as uuidValidate } from 'uuid';

export const uuidHelper = {
  /**
   * Generates a new secure v4 UUID.
   */
  generate(): string {
    return uuidv4();
  },

  /**
   * Validates if a string is a valid v4 UUID.
   */
  isValid(uuid: string): boolean {
    return uuidValidate(uuid);
  },

  /**
   * Asserts that a string is a valid v4 UUID, otherwise throws an error.
   */
  assertValid(uuid: string, name = 'ID'): void {
    if (!this.isValid(uuid)) {
      throw new Error(`Invalid format for ${name}. Expected a valid UUID v4.`);
    }
  }
};
