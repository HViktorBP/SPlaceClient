/**
 * DeleteMessageRequest represents the payload for an API request to delete the message from group.
 */
export interface DeleteMessageRequest {
  userId: number;
  groupId: number;
  messageId: number;
}
