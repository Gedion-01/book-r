// Email validation function
export function validateEmail(email: string) {
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailPattern.test(email);
}

// Password validation function
export function validatePassword(password: string) {
    return password && password.length >= 6;
}