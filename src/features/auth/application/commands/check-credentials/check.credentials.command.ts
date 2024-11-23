import { CheckCredentialsDto } from './check.credentials.dto';

export class CheckCredentialsCommand {
  constructor(public checkCredentialsDto: CheckCredentialsDto) {}
}
