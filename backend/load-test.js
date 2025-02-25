import http from 'k6/http';
import { check, sleep } from 'k6';

export let options = {
  stages: [
    { duration: '1m', target: 10 }, // Ramp-up to 10 users over 1 minute
    { duration: '3m', target: 10 }, // Stay at 10 users for 3 minutes
    { duration: '1m', target: 0 },  // Ramp-down to 0 users over 1 minute
  ],
};

export default function () {
  let res = http.get('http://localhost:3000/api/v0/users');
  check(res, { 'status was 200': (r) => r.status == 200 });
  sleep(1);
}
