import axios from "axios";

export class HttpAuthService {
  constructor() {
    this.httpClient = axios.create({
      baseURL: 'http://auth-service:5001'
    });
    this.httpClient.interceptors.response.use((response) => response.data);
  }

  async signIn(username, password) {
    return await this.httpClient.post('/sign-in', { username, password });
  }

  async signUp(username, password) {
    return await this.httpClient.post('/sign-up', { username, password });
  }

  async currentUser({ bearerToken }) {
    return this.httpClient.get('/current-user', {
      headers: {
        Authorization: `Bearer ${bearerToken}`,
      },
    });
  }
}