export class CreateUserDto {
  login: string;
  password: string;
  constructor(login, password) {
    this.login = login;
    this.password = password;
  }
  public get dto() {
    return { login: this.login, password: this.password };
  }
}
