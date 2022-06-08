import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { Auth } from 'src/auth/auth.decorator';
import { Project } from 'src/project/entities/project.entity';
import { UpdateUserInput } from './dto/update-user.input';
import { User } from './entities/user.entity';
import { UserService } from './user.service';

@Resolver(() => User)
export class UserResolver {
  constructor(private readonly userService: UserService) {}

  @Query(() => User)
  user(@Auth() authorization: string): Promise<User> {
    return this.userService.getMe(authorization);
  }

  @Query(() => [Project])
  userProjects(@Auth() authorization: string): Promise<Project[]> {
    return this.userService.getProjects(authorization);
  }

  @Mutation(() => User)
  updateUser(
    @Auth() authorization: string,
    @Args() input: UpdateUserInput,
  ): Promise<User> {
    return this.userService.update(authorization, input);
  }

  @Mutation(() => User)
  removeUser(@Auth() authorization: string): Promise<User> {
    return this.userService.remove(authorization);
  }
}
