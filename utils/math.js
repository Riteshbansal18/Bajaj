function generateFibonacci(n) {
  const result = [];
  for (let i = 0; i < n; i++) {
    if (i === 0) result.push(0);
    else if (i === 1) result.push(1);
    else result.push(result[i - 1] + result[i - 2]);
  }
  return result;
}

function isPrime(num) {
  if (num <= 1) return false;
  for (let i = 2; i <= Math.sqrt(num); i++) {
    if (num % i === 0) return false;
  }
  return true;
}

function getPrimes(arr) {
  return arr.filter(num => typeof num === "number" && isPrime(num));
}

function gcd(a, b) {
  return b === 0 ? a : gcd(b, a % b);
}

function calculateHCF(arr) {
  return arr.reduce((acc, val) => gcd(acc, val));
}

function lcm(a, b) {
  return (a * b) / gcd(a, b);
}

function calculateLCM(arr) {
  return arr.reduce((acc, val) => lcm(acc, val));
}

module.exports = {
  generateFibonacci,
  getPrimes,
  calculateLCM,
  calculateHCF
};
