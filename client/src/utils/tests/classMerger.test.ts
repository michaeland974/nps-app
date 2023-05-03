import * as React from 'react';
import { classMerger } from '../classMerger';
import {describe, expect} from '@jest/globals';

describe('conditionally add class to html element', () => {
  test('add class name "foo" to element', () => {
    expect(classMerger(true, "bar", "foo")).toBe("bar foo")
  })
  test('class name will remain the same on element', () => {
    expect(classMerger(false, "bar", "foo")).toBe("bar")
  })
})