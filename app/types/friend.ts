export interface User {
  id: number;
  email: string;
}

export interface AddFriendPayload {
  friendUserId: number;
}
