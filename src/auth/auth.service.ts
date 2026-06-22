import * as bcrypt from 'bcrypt';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { JwtService } from '@nestjs/jwt';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { Customer } from '../customer/entities/customer.entity';
import { Store } from '../store/entities/store.entity';
import { CustomerStatus } from '../customer/enums/customer-status.enum';
import { StoreStatus } from '../store/enums/store-status.enum';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,

    @InjectRepository(Customer)
    private readonly customerRepository: Repository<Customer>,

    @InjectRepository(Store)
    private readonly storeRepository: Repository<Store>,
  ) {}

  async loginCustomer(loginDto: LoginDto) {
    const customer = await this.customerRepository.findOne({
      where: {
        email: loginDto.email,
      },
      select: ['id', 'email', 'password', 'status'],
    });

    if (!customer) {
      throw new UnauthorizedException('Invalid credentials');
    }

    this.validateCustomerStatus(customer);

    await this.validatePassword(loginDto.password, customer.password);

    const payload = {
      sub: customer.id,
      email: customer.email,
      type: 'CUSTOMER',
    };

    return {
      accessToken: await this.jwtService.signAsync(payload),
      user: {
        id: customer.id,
        email: customer.email,
        type: 'CUSTOMER',
      },
    };
  }

  async loginStore(loginDto: LoginDto) {
    const store = await this.storeRepository.findOne({
      where: {
        email: loginDto.email,
      },
      select: ['id', 'email', 'password', 'status'],
    });

    if (!store) {
      throw new UnauthorizedException('Invalid credentials');
    }

    this.validateStoreStatus(store);

    await this.validatePassword(loginDto.password, store.password);

    const payload = {
      sub: store.id,
      email: store.email,
      type: 'STORE',
    };

    return {
      accessToken: await this.jwtService.signAsync(payload),
      user: {
        id: store.id,
        email: store.email,
        type: 'STORE',
      },
    };
  }

  private async validatePassword(
    plainPassword: string,
    hashedPassword: string,
  ): Promise<void> {
    const isMatch = await bcrypt.compare(plainPassword, hashedPassword);

    if (!isMatch) {
      throw new UnauthorizedException('Invalid credentials');
    }
  }

  private validateCustomerStatus(customer: Customer): void {
    switch (customer.status) {
      case CustomerStatus.INACTIVE:
        throw new UnauthorizedException('Customer account is inactive');

      case CustomerStatus.BLOCKED:
        throw new UnauthorizedException('Customer account is blocked');

      case CustomerStatus.ACTIVE:
      default:
        return;
    }
  }

  private validateStoreStatus(store: Store): void {
    if (store.status === StoreStatus.INACTIVE) {
      throw new UnauthorizedException('Store account is inactive');
    }
  }
}
