export interface Credentials {
  email: string;
  password: string;
}

export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  expiresAt: string;
  tokenType: string;
}

export interface Me {
  id: number;
  email: string;
  playerId: number | null;
  createdAt: string;
}
