'use strict';

const should = require('should');
const request = require('request');
const expect = require('chai').expect;
const util = require('util');

const baseUrl = 'https://swapi.co/api';

describe('returns luke', () => {
  it('should return status code 200', done => {
    request.get({url: baseUrl + '/people/1/'}, (error, response, body) => {
      expect(response.statusCode).to.equal(200);
      done();
    });
  });

  it('should return name as Luke Skywalker', done => {
    request.get({url: baseUrl + '/people/1/'}, (error, response, body) => {
      const bodyObj = JSON.parse(body);
      expect(bodyObj.name).to.equal('Luke Skywalker');
      done();
    });
  });
});
