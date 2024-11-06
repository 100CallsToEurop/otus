import http from 'k6/http';
import { check, sleep } from 'k6';

export const options = {
  // stages: [
  //     { duration: '1m', target: 10 },
  //     { duration: '4m', target: 50 },
  //     { duration: '1m', target: 0 },
  // ],
};

export default function () {
  const responsePost = http.post('http://arch.homework:31023/user', {
    username: 'johndoe58999',
    firstName: 'John',
    lastName: 'Doe',
    email: 'bestjohn@doe.com',
    phone: '+71002003040',
  });
  check(responsePost, {
    'is status 201': (r) => r.status === 201,
    'is status 500': (r) => r.status === 500,
  });

  console.log(responsePost.body);
  const responseDelete = http.del('http://arch.homework:31023/user/1');
  check(responseDelete, {
    'is status 200': (r) => r.status === 200,
    'is status 500': (r) => r.status === 500,
  });
}
