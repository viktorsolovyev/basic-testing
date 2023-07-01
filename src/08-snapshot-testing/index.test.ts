import { generateLinkedList } from './index';

describe('generateLinkedList', () => {
  const linkedList = {
    value: 1,
    next: { value: 2, next: { value: 3, next: { value: null, next: null } } },
  };
  test('should generate linked list from values 1', () => {
    expect(generateLinkedList([1, 2, 3])).toStrictEqual(linkedList);
  });

  test('should generate linked list from values 2', () => {
    expect(generateLinkedList([1, 2, 3])).toMatchSnapshot();
  });
});
