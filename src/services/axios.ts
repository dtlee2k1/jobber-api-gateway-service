import { envConfig } from '@gateway/config';
import axios, { AxiosInstance } from 'axios';
import jwt from 'jsonwebtoken';

export class AxiosService {
  public instance: AxiosInstance;

  constructor(baseUrl: string, serviceName: string) {
    this.instance = this.axiosCreateInstance(baseUrl, serviceName);
  }

  public axiosCreateInstance(baseUrl: string, serviceName?: string) {
    let gatewayToken = '';

    if (serviceName) {
      gatewayToken = jwt.sign({ id: serviceName }, `${envConfig.GATEWAY_JWT_TOKEN}`);
    }

    const instance: AxiosInstance = axios.create({
      baseURL: baseUrl,
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        gatewayToken
      },
      withCredentials: true
    });

    return instance;
  }
}
