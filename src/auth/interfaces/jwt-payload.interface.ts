export interface JwtPayload {
  sub: string;
  email: string;
  type: 'CUSTOMER' | 'STORE';
}
