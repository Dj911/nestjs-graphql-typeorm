import { ObjectType, Field, Int } from '@nestjs/graphql';

@ObjectType()
export class User {
  @Field()
  email: string;

  @Field()
  password: string;
}
