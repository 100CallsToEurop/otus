import http from 'k6/http';
import { check, sleep } from 'k6';

export const options = {
  stages: [
    { duration: '4m', target: 100 },
    { duration: '5m', target: 200 },
    { duration: '1m', target: 0 },
  ],
};

export default function () {
  const responsePost = http.post('http://arch.homework:30804/user', {
    username: 'johndoe58999',
    firstName: 'John',
    lastName: 'Doe',
    email: 'bestjohn@doe.com',
    phone: '+71002003040',
  });
  check(responsePost, {
    'is status 201': (r) => r.status === 201,
    'is status 500': (r) => r.status !== 500,
    'is status 502': (r) => r.status !== 502,
    'is status 504': (r) => r.status !== 504,
  });

  const responseGet = http.get(
    `http://arch.homework:30804/user/${responsePost.body}`,
  );
  check(responseGet, {
    'is status 200': (r) => r.status === 200,
    'is status 500': (r) => r.status !== 500,
    'is status 502': (r) => r.status !== 502,
    'is status 504': (r) => r.status !== 504,
  });

  const responseDelete = http.del(
    `http://arch.homework:30804/user/${responsePost.body}`,
  );
  check(responseDelete, {
    'is status 204': (r) => r.status === 204,
    'is status 500': (r) => r.status !== 500,
    'is status 502': (r) => r.status !== 502,
    'is status 504': (r) => r.status !== 504,
  });
}
