
export const validateName = (name: string): string | null => {
    if (!name) return "Name is required";
    if (name.length < 20) return "Name must be at least 20 characters long";
    if (name.length > 60) return "Name must be at most 60 characters long";
    return null;
};

export const validateAddress = (address: string): string | null => {
    if (!address) return "Address is required";
    if (address.length > 400) return "Address cannot exceed 400 characters";
    return null;
};

export const validatePassword = (password: string): string | null => {
    if (!password) return "Password is required";
    if (password.length < 8) return "Password must be at least 8 characters long";
    if (password.length > 16) return "Password must be at most 16 characters long";
    if (!/[A-Z]/.test(password)) return "Password must contain at least one uppercase letter";
    if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) return "Password must contain at least one special character";
    return null;
};

export const validateEmail = (email: string): string | null => {
    if (!email) return "Email is required";
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) return "Invalid email format";
    return null;
};
