/**
 * MessageDto provides a data transfer object for message.
 */
export interface MessageDto {
  id : number
  userId: number;
  userName : string;
  groupId: number;
  message: string;
  timestamp: Date;
  isEdited : boolean
}
