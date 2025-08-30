import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useLocalStorage } from './useLocalStorage';

// Mock localStorage
const localStorageMock = (() => {
  let store: Record<string, string> = {};

  return {
    getItem: vi.fn((key: string) => store[key] || null),
    setItem: vi.fn((key: string, value: string) => {
      store[key] = value;
    }),
    removeItem: vi.fn((key: string) => {
      delete store[key];
    }),
    clear: vi.fn(() => {
      store = {};
    }),
  };
})();

Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
});

describe('useLocalStorage hook', () => {
  beforeEach(() => {
    localStorageMock.clear();
    vi.clearAllMocks();
  });

  it('should return initial value when localStorage is empty', () => {
    const { result } = renderHook(() => useLocalStorage('test-key', 'default-value'));
    
    expect(result.current[0]).toBe('default-value');
  });

  it('should return stored value from localStorage', () => {
    localStorageMock.setItem('test-key', JSON.stringify('stored-value'));
    
    const { result } = renderHook(() => useLocalStorage('test-key', 'default-value'));
    
    expect(result.current[0]).toBe('stored-value');
  });

  it('should update localStorage when setValue is called', () => {
    const { result } = renderHook(() => useLocalStorage('test-key', 'initial'));
    
    act(() => {
      result.current[1]('new-value');
    });

    expect(localStorageMock.setItem).toHaveBeenCalledWith('test-key', JSON.stringify('new-value'));
    expect(result.current[0]).toBe('new-value');
  });

  it('should handle function updates correctly', () => {
    const { result } = renderHook(() => useLocalStorage('counter', 0));
    
    act(() => {
      result.current[1](prev => prev + 1);
    });

    expect(result.current[0]).toBe(1);
    expect(localStorageMock.setItem).toHaveBeenCalledWith('counter', JSON.stringify(1));
  });

  it('should handle arrays and objects', () => {
    const initialArray = [1, 2, 3];
    const { result } = renderHook(() => useLocalStorage('array-key', initialArray));
    
    const newArray = [4, 5, 6];
    act(() => {
      result.current[1](newArray);
    });

    expect(result.current[0]).toEqual(newArray);
    expect(localStorageMock.setItem).toHaveBeenCalledWith('array-key', JSON.stringify(newArray));
  });

  it('should handle invalid JSON gracefully', () => {
    // Set invalid JSON in localStorage
    localStorageMock.getItem.mockReturnValueOnce('invalid-json{');
    
    const { result } = renderHook(() => useLocalStorage('test-key', 'default'));
    
    // Should fall back to default value
    expect(result.current[0]).toBe('default');
  });

  it('should handle localStorage errors gracefully', () => {
    // Mock localStorage.setItem to throw an error
    localStorageMock.setItem.mockImplementationOnce(() => {
      throw new Error('localStorage is full');
    });

    const { result } = renderHook(() => useLocalStorage('test-key', 'initial'));
    
    // Should not throw when setting value fails
    expect(() => {
      act(() => {
        result.current[1]('new-value');
      });
    }).not.toThrow();
  });

  it('should work with boolean values', () => {
    const { result } = renderHook(() => useLocalStorage('boolean-key', false));
    
    act(() => {
      result.current[1](true);
    });

    expect(result.current[0]).toBe(true);
    expect(localStorageMock.setItem).toHaveBeenCalledWith('boolean-key', JSON.stringify(true));
  });

  it('should work with null values', () => {
    const { result } = renderHook(() => useLocalStorage('null-key', null));
    
    expect(result.current[0]).toBe(null);
    
    act(() => {
      result.current[1]('not-null');
    });

    expect(result.current[0]).toBe('not-null');
  });
});