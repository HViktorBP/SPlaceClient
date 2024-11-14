/**
 * UserRegistrationRequest represents the payload for an API request to register a user.
 */
export interface UserRegistrationRequest {
  username : string,
  password: string,
  email: string
}
