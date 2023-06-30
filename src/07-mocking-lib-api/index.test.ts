import axios from 'axios';
import { throttledGetDataFromApi } from './index';

describe('throttledGetDataFromApi', () => {
  beforeAll(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  afterAll(() => {
    jest.useRealTimers();
  });

  test('should create instance with provided base url', async () => {
    const mockedCreate = jest.spyOn(axios, 'create');
    await throttledGetDataFromApi('/users');
    expect(mockedCreate).toHaveBeenLastCalledWith({
      baseURL: 'https://jsonplaceholder.typicode.com',
    });
  });

  test('should perform request to correct provided url', async () => {
    const mockedGet = jest
      .spyOn(axios.Axios.prototype, 'get')
      .mockImplementation(() => Promise.resolve(true));
    await throttledGetDataFromApi('/users');
    jest.runAllTimers();
    expect(mockedGet.mock.calls[0]?.[0]).toBe('/users');
  });

  test('should return response data', async () => {
    const users = [{ name: 'Bob' }];
    const resp = { data: users };
    jest
      .spyOn(axios.Axios.prototype, 'get')
      .mockImplementation(() => Promise.resolve(resp));
    const data = await throttledGetDataFromApi('/users');
    jest.runAllTimers();
    expect(data).toEqual(users);
  });
});
