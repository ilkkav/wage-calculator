const should = require('should');
const { getOvertimeWeightedHours } = require('../src/calculateWages');

describe('overtime hours', () => {

  it('calculate weighted hours with and without overtime', () => {
    getOvertimeWeightedHours(7).should.equal(7);
    getOvertimeWeightedHours(8).should.equal(8);
    getOvertimeWeightedHours(9).should.equal(8 + (1.0 * 1.25));
    getOvertimeWeightedHours(9.7).should.equal(8 + (1.7 * 1.25));
    getOvertimeWeightedHours(10.25).should.equal(8 + (2 * 1.25) + (0.25 * 1.5));
    getOvertimeWeightedHours(12).should.equal(8 + (2 * 1.25) + (2 * 1.5));
    getOvertimeWeightedHours(14).should.equal(8 + (2 * 1.25) + (2 * 1.5) + (2 * 2.0));
    getOvertimeWeightedHours(20).should.equal(8 + (2 * 1.25) + (2 * 1.5) + (8 * 2.0));
  });
});