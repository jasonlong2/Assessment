import HttpException from './HttpException';

class AuthFailedException extends HttpException {
  constructor() {
    super(401, 'Authorization Failed');
  }
}

export default AuthFailedException;