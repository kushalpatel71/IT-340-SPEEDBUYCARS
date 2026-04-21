import { Injectable } from '@angular/core';

export interface User {
  fullName: string;
  email: string;
  password?: string;
  loggedIn?: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private userKey = 'speedBuyCarsUser';
  private currentUserKey = 'speedBuyCarsCurrentUser';

  register(user: User): { success: boolean; message: string } {
    if (!user.fullName || !user.email || !user.password) {
      return { success: false, message: 'Please fill in all fields.' };
    }

    if (user.password.length < 6) {
      return { success: false, message: 'Password must be at least 6 characters long.' };
    }

    localStorage.setItem(this.userKey, JSON.stringify(user));
    return { success: true, message: 'Registration successful.' };
  }

  login(email: string, password: string): { success: boolean; message: string } {
    const savedUser = JSON.parse(localStorage.getItem(this.userKey) || 'null');

    if (!savedUser) {
      return { success: false, message: 'No registered user found. Please register first.' };
    }

    if (email.toLowerCase() === savedUser.email && password === savedUser.password) {
      const currentUser = {
        fullName: savedUser.fullName,
        email: savedUser.email,
        loggedIn: true
      };

      localStorage.setItem(this.currentUserKey, JSON.stringify(currentUser));
      return { success: true, message: 'Login successful.' };
    }

    return { success: false, message: 'Invalid email or password.' };
  }

  getCurrentUser() {
    return JSON.parse(localStorage.getItem(this.currentUserKey) || 'null');
  }

  isLoggedIn(): boolean {
    const user = this.getCurrentUser();
    return !!(user && user.loggedIn);
  }

  logout(): void {
    localStorage.removeItem(this.currentUserKey);
  }
}
