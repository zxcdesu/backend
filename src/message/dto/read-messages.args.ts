import { ArgsType, Field, Int } from '@nestjs/graphql';
import { IsInt } from 'class-validator';

@ArgsType()
export class ReadMessagesArgs {
  @Field(() => Int)
  @IsInt()
  chatId: number;

  @Field(() => [Int])
  @IsInt({ each: true })
  ids: number[];
}