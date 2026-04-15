import { Injectable, UnauthorizedException } from '@nestjs/common';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
  login(dto: LoginDto): { access_token: string; user: { email: string; name: string } } {
    // Mock authentication — any non-empty email/password is accepted
    if (!dto.email || !dto.password) {
      throw new UnauthorizedException('Invalid credentials');
    }

    return {
      access_token: 'mock-jwt-token-' + Date.now(),
      user: {
        email: dto.email,
        name: dto.email.split('@')[0] ?? 'User',
      },
    };
  }
}
