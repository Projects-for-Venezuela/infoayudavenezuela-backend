import { User } from 'generated/prisma/browser';
import { ProfileResponseDto } from '../dto/response/profile-response.dto';

export class ProfileMappers {
  static toResponse(user: User): ProfileResponseDto {
    return {
      id: user.id,
      email: user.email,
      role: user.role,
    };
  }

  static toResponseList(users: User[]): ProfileResponseDto[] {
    return users.map((user) => this.toResponse(user));
  }
}
