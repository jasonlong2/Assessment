import NotFoundException from './NotFoundException';

class UserNotFoundException extends NotFoundException {
  constructor(id: string) {
    console.log(id);
    super(`User '${id}' not found`);
  }
}

export default UserNotFoundException;