import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { User } from './entities/user.entity';
import { CreateUserDto, LoginUserDto } from './dto';
import { JwtPayload } from './interfaces/jwt-payload.interface';
import { JwtService } from '@nestjs/jwt';
import { Billing } from "../billing/entities/billing.entity";
import { UpdateUserDto } from './dto/update-user.dto';
import passport from 'passport';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,

    private readonly jwtService: JwtService,
  ) {}

  async create(createUserDto: CreateUserDto) {
    try {
      const { password, ...userData } = createUserDto;

      const user = this.userRepository.create({
        ...userData,
        password: bcrypt.hashSync(password, 10),
        billing: new Billing(),
      });

      await this.userRepository.save(user);

      return {
        ...user,
        token: this.getJwtToken({ id: user.id }),
      };
    } catch (error) {
      this.handleDBErrors(error);
    }
  }

  async findAll() {
    return await this.userRepository.find();
  }

  async login(loginUserDto: LoginUserDto) {
    const { password, email } = loginUserDto;

    const user = await this.userRepository.findOne({
      where: { email },
      select: {email: true, password: true, id: true },
    });

    if (!user) {
      throw new UnauthorizedException('Credentials are not valid');
    }

    if (!bcrypt.compareSync(password, user.password)) {
      throw new UnauthorizedException('Credentials are not valid');
    }
    return {
      ...user,
      token: this.getJwtToken({ id: user.id }),
    };
  }

  async update(id: string, updateUserDto: UpdateUserDto) {

    const userData = updateUserDto;

    const updatedUser = await this.userRepository.preload({
      id: id,
      ...userData, 
    });
  
    if (!updatedUser) {
      throw new NotFoundException(`User with id: ${id} not found`);
    }
  
    await this.userRepository.save(updatedUser);
  
    return {
      ...updatedUser,
      token: this.getJwtToken({ id: updatedUser.id }),
    };
  }

  async updatePassword(id: string, currentPassword: string, newPassword: string) {
  
  const user = await this.userRepository.findOne({where:  { id },select: { password: true }});

  if (!bcrypt.compareSync(currentPassword, user.password)) {
    throw new UnauthorizedException('La contraseña actual no es válida');
  }

  const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(newPassword, saltRounds);
  
    const updatedUser = await this.userRepository.preload({
      id: id,
      password: hashedPassword,
    });
  
    if (!updatedUser) {
      throw new NotFoundException(`User with id: ${id} not found`);
    }
  
    await this.userRepository.save(updatedUser);
  
    return {
      ...updatedUser,
      token: this.getJwtToken({ id: updatedUser.id }),
    };
  }

  private getJwtToken(payload: JwtPayload) {
    const token = this.jwtService.sign(payload);
    return token;
  }

  private handleDBErrors(error: any): never {
    if (error.code === '23505') throw new BadRequestException(error.detail);
    console.log(error);

    throw new InternalServerErrorException('Check server logs');
  }
}
