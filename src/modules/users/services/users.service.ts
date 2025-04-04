// @Injectable()
// export class UsersService {
//   constructor(
//     private readonly usersRepository: UsersRepository,
//     private readonly authService: AuthService
//   ) {}

//   async create(createUserDto: CreateUserDto) {
//     // Validate, hash password, create user
//     const user = await this.usersRepository.create(createUserDto);
//     return user;
//   }
// }