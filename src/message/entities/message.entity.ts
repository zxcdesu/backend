import { Field, Int, ObjectType, PickType } from '@nestjs/graphql';
import GraphQLJSON from 'graphql-type-json';
import { Chat } from 'src/chat/entities/chat.entity';

@ObjectType()
class ChatId extends PickType(Chat, ['id']) {}

@ObjectType()
class Attachment {
  @Field(() => String)
  type: string;

  @Field(() => String)
  url: string;

  @Field(() => String, { nullable: true })
  name?: string;
}

@ObjectType()
class Content {
  @Field(() => String, { nullable: true })
  text?: string;

  @Field(() => [Attachment])
  attachments: Attachment[];

  @Field(() => GraphQLJSON, { nullable: true })
  buttons: any;
}

@ObjectType()
export class Message {
  @Field(() => Int)
  id: number;

  @Field(() => Boolean)
  fromMe: boolean;

  @Field(() => String)
  status: string;

  @Field(() => ChatId)
  chat: ChatId;

  @Field(() => [Content])
  content: Content[];

  @Field(() => String)
  createdAt: string;

  @Field(() => String)
  updatedAt: string;
}
