export class UserRepository {
  async findById(id: string): Promise<any> {
    return null;
  }
}

export const userRepository = new UserRepository();
