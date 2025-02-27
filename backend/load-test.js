import http from 'k6/http';
import { check, sleep } from 'k6';

// Possible test types include smoke, stress, spike, soak and load.
// Smoke: verify system can habdle a minimal load w/o issues.
// Stress: determine breaking point by increading number of VUs until the API starts returning errors or response times degrade significantly.
// Spike: test how the system handles sudden spikes in load. A sudden increase in the number of VUs to simulate a traffic spike, followed by a return to normal load.
// Soak (endurance): test the system's stability and performance over an extended period. Running a constant load for several hours or days to identify memory leaks or performance degradation over time.
// Load: test the system under expected peak load conditions. Running a constant load for a period of time to verify that the system can handle the expected number of users.
export let options = {
  stages: [
    { duration: '1m', target: 10 }, // Ramp-up to 10 users over 1 minute
    { duration: '3m', target: 10 }, // Stay at 10 users for 3 minutes
    { duration: '1m', target: 0 },  // Ramp-down to 0 users over 1 minute
  ],
};

const BASE_URL = __ENV.BASE_URL || 'https://localhost:3000';

export default function () {
  let res = http.get(`${BASE_URL}/api/v0/users`);
  check(res, {
    'status was 200': (r) => r.status == 200,
    'response time was < 500ms': (r) => r.timings.duration < 500,
});
  sleep(1);
}
