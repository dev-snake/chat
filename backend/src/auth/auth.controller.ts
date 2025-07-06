import {
  Controller,
  Post,
  Body,
  ValidationPipe,
  Get,
  Headers,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto, LoginDto } from './dto/auth.dto';
import { ResponseHelper, ApiResponse } from '../common/response.interface';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('register')
  async register(
    @Body(ValidationPipe) registerDto: RegisterDto,
  ): Promise<ApiResponse> {
    try {
      const result = await this.authService.register(registerDto);
      return ResponseHelper.success(
        result,
        'User registered successfully',
        201,
      );
    } catch (error) {
      return ResponseHelper.error(
        'Registration failed',
        400,
        error instanceof Error ? error.message : 'Unknown error',
      );
    }
  }

  @Post('login')
  async login(@Body(ValidationPipe) loginDto: LoginDto): Promise<ApiResponse> {
    try {
      const result = await this.authService.login(loginDto);
      return ResponseHelper.success(result, 'Login successful', 200);
    } catch (error) {
      return ResponseHelper.error(
        'Login failed',
        401,
        error instanceof Error ? error.message : 'Unknown error',
      );
    }
  }

  @Get('verify')
  async verifyToken(
    @Headers('authorization') authHeader: string,
  ): Promise<ApiResponse> {
    try {
      if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return ResponseHelper.error(
          'Authentication required',
          401,
          'No token provided',
        );
      }

      const token = authHeader.substring(7);
      const result = await this.authService.validateToken(token);
      return ResponseHelper.success(result, 'Token verified successfully', 200);
    } catch (error) {
      return ResponseHelper.error(
        'Token verification failed',
        401,
        error instanceof Error ? error.message : 'Unknown error',
      );
    }
  }
}
