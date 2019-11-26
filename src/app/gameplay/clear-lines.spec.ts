import { fakeAsync, tick } from '@angular/core/testing';

import { ClearLines } from './clear-lines';
import { Field } from './field';
import { Events } from './events';
import { BlockData } from './model';

describe('ClearLines', () => {

  describe('when there field is empty', () => {

    let sut: ClearLines;
    let field: Field;
    let events: Events;

    beforeAll(() => {
      const linesCleared$ = { next: jasmine.createSpy('next') };
      events = { linesCleared$ } as unknown as Events;

      field = new Field();
      field.init();

      sut = new ClearLines(field, events);
    });

    it('should not do anything', () => {
      sut.clearLines();
      expect(events.linesCleared$.next).toHaveBeenCalledTimes(0);
    });

  });

  describe('when there is a single complete line', () => {

    let sut: ClearLines;
    let field: Field;
    let events: Events;

    beforeEach(() => {
      const linesCleared$ = { next: jasmine.createSpy('next') };
      events = { linesCleared$ } as unknown as Events;

      field = new Field();
      field.init();
      field.data[8]  = createLineOBlocks('0000000100');
      field.data[9]  = createLineOBlocks('1101111111');
      field.data[10] = createLineOBlocks('1111111111');
      field.data[11] = createLineOBlocks('1000000100');

      sut = new ClearLines(field, events);
    });

    it('should clear one line', () => {
      sut.clearLines();
      expect(events.linesCleared$.next).toHaveBeenCalledWith(1);
    });

    it('should move the remaining lines down', fakeAsync(() => {
      sut.clearLines();
      tick(600);

      expect(lineToString(field.data[ 8])).toBe('0000000000');
      expect(lineToString(field.data[ 9])).toBe('0000000100');
      expect(lineToString(field.data[10])).toBe('1101111111');
      expect(lineToString(field.data[11])).toBe('1000000100');
    }));

  });

  describe('when there are five complete lines', () => {

    let sut: ClearLines;
    let field: Field;
    let events: Events;

    beforeAll(() => {
      const linesCleared$ = { next: jasmine.createSpy('next') };
      events = { linesCleared$ } as unknown as Events;

      field = new Field();
      field.init();
      field.data[10] = createLineOBlocks('1111111111');
      field.data[11] = createLineOBlocks('1111111111');
      field.data[12] = createLineOBlocks('1111111111');
      field.data[13] = createLineOBlocks('1111111111');
      field.data[14] = createLineOBlocks('1111111111');

      sut = new ClearLines(field, events);
    });

    it('should clear five lines', () => {
      sut.clearLines();
      expect(events.linesCleared$.next).toHaveBeenCalledWith(5);
    });

  });

});

describe('when there are three complete lines with a single incomplete line in between', () => {

  let sut: ClearLines;
  let field: Field;
  let events: Events;

  beforeAll(() => {
    const linesCleared$ = { next: jasmine.createSpy('next') };
    events = { linesCleared$ } as unknown as Events;

    field = new Field();
    field.init();
    field.data[10] = createLineOBlocks('0000000100');
    field.data[11] = createLineOBlocks('1111111111');
    field.data[12] = createLineOBlocks('1111111111');
    field.data[13] = createLineOBlocks('1011111111');
    field.data[14] = createLineOBlocks('1111111111');

    sut = new ClearLines(field, events);
  });

  it('should clear three lines', () => {
    sut.clearLines();
    expect(events.linesCleared$.next).toHaveBeenCalledWith(3);
  });

  it('should move the remaining lines down', fakeAsync(() => {
    sut.clearLines();
    tick(600);

    expect(lineToString(field.data[10])).toBe('0000000000');
    expect(lineToString(field.data[11])).toBe('0000000000');
    expect(lineToString(field.data[12])).toBe('0000000000');
    expect(lineToString(field.data[13])).toBe('0000000100');
    expect(lineToString(field.data[14])).toBe('1011111111');
  }));

});




function createLineOBlocks(data: string) {
  return data.split('').map(x => {
    if (x === '1') {
      return {
        x: 0, y: 0, px: 0, py: 0, type: 'cyan'
      };
    } else {
      return {
        x: 0, y: 0, px: 0, py: 0, type: null
      };
    }
  });
}

function lineToString(data: BlockData[]) {
  return data.map(b => (b.type && (b.type.indexOf('explode') < 0)) ? '1' : '0').join('');
}
