import { ArgsType, Field } from '@nestjs/graphql';
import { Transform, TransformFnParams } from 'class-transformer';
import { IsNotEmpty, IsOptional, IsUrl } from 'class-validator';

@ArgsType()
export class UpdateUserInput {
  @Field(() => String, { nullable: true })
  @IsOptional()
  @IsNotEmpty()
  @Transform(({ value }: TransformFnParams) => value.trim())
  name?: string;

  @Field(() => String, { nullable: true })
  @IsOptional()
  @IsUrl()
  avatarUrl?: string;
}
