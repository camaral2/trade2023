import axios from 'axios';

export abstract class RequestUtils {
  static async getRequest(url: string, headers?: any) {
    try {
      const options = {};

      if (headers) {
        options['headers'] = headers;
      }

      const { data } = await axios.get(url, options);

      return data;
    } catch (error) {
      throw new Error(error);
    }
  }
}
