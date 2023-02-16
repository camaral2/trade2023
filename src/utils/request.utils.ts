import axios from 'axios';

export class RequestUtils {
  public async getRequest(url: string, headers?: any): Promise<any> {
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
