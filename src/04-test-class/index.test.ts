import {
  getBankAccount,
  BankAccount,
  InsufficientFundsError,
  TransferFailedError,
  SynchronizationFailedError,
} from '.';
import lodash from 'lodash';

describe('BankAccount', () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  const bankAccount = getBankAccount(100);
  const corrBankAccount = getBankAccount(100);

  test('should create account with initial balance', () => {
    expect(bankAccount).toBeInstanceOf(BankAccount);
    expect(bankAccount.getBalance()).toBe(100);
  });

  test('should throw InsufficientFundsError error when withdrawing more than balance', () => {
    expect(() => bankAccount.withdraw(200)).toThrow(InsufficientFundsError);
  });

  test('should throw error when transferring more than balance', () => {
    expect(() => bankAccount.transfer(200, corrBankAccount)).toThrow(
      InsufficientFundsError,
    );
  });

  test('should throw error when transferring to the same account', () => {
    expect(() => bankAccount.transfer(200, bankAccount)).toThrow(
      TransferFailedError,
    );
  });

  test('should deposit money', () => {
    bankAccount.deposit(50);
    expect(bankAccount.getBalance()).toBe(150);
  });

  test('should withdraw money', () => {
    bankAccount.withdraw(50);
    expect(bankAccount.getBalance()).toBe(100);
  });

  test('should transfer money', () => {
    bankAccount.transfer(50, corrBankAccount);
    expect(bankAccount.getBalance()).toBe(50);
    expect(corrBankAccount.getBalance()).toBe(150);
  });

  test('fetchBalance should return number in case if request did not failed', async () => {
    jest.spyOn(lodash, 'random').mockImplementation(() => 1);
    const balance = await bankAccount.fetchBalance();
    expect(balance).toBeDefined();
  });

  test('should set new balance if fetchBalance returned number', async () => {
    jest.spyOn(lodash, 'random').mockImplementation(() => 1);
    await bankAccount.synchronizeBalance();
    expect(bankAccount.getBalance()).toBe(1);
  });

  test('should throw SynchronizationFailedError if fetchBalance returned null', async () => {
    jest.spyOn(lodash, 'random').mockImplementation(() => 0);
    await expect(bankAccount.synchronizeBalance()).rejects.toThrow(
      SynchronizationFailedError,
    );
  });
});
