import * as React from 'react';
import { renderDate } from '../renderDate';
import {describe, expect} from '@jest/globals';

describe('format readable date', () => {
  test('1', () => {
    expect(renderDate('2023-04-26 17:02:00.0')).toBe('April 26, 2023')
  })
  test('2', () => {
    expect(renderDate('2022-11-22 19:27:36.0')).toBe('November 22, 2022')
  })
  test('undefined date input should return undefined', () => {
    expect(renderDate('')).toBe('');
  })
})