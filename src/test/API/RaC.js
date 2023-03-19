const request = require('supertest');
const { assert, expect } = require('chai');
const { url, authURL } = require('../../helper/baseUrl');
const fs = require('fs');

var validate = require('jsonschema').validate;
var authToken = '';


describe('testing of RaC endpoint', () => {
  before(function (done) {
    // Get the authorization token to be used in subsequesnt tests
    request(authURL)
      .post('/')
      .set('Content-Type', 'application/x-www-form-urlencoded')
      .send("client_id=6qjeYSK8gfj8fAlifxdghlchkp1NPAZ1&username=agnasser56@hotmail.com&password=YNspq3NyXN6uzP&grant_type=password&scope=openid")
      .end((err, res) => {
        authToken = res.body.id_token;
        console.log(authToken)
        assert.equal(res.status, 200);
        done();
      });

  });

  it('validate api response schema', function (done) {
    var payloadData = JSON.parse(fs.readFileSync('./src/test/testdata/sameEstuaryShipment.json'));
    request(url)
      .post(payloadData)
      .expect(function (res) {
        // Read the JSON Schema from the same directory as RaC.js
        var schema = JSON.parse(fs.readFileSync('./src/schemas/stock_schema.json'));
        console.log(validate(res.body, schema).errors.toString())
        assert.equal(validate(res.body, schema).errors.length, 0);
      })
      .expect(200, done);
  });

  it('validate unauthorized access', (done) => {
    request(url)
      .post('/')
      .auth('eyJhbGciOiJSUzI1NiIsInR5cCI6', { type: 'bearer' })
      .expect('Content-Type', /json/)
      .end((err, res) => {
        assert.equal(res.status, 401);
        done();
      });
  });

  it('validate shipping within same estuary check', (done) => {
    var payloadData = JSON.parse(fs.readFileSync('./src/test/testdata/sameEstuaryShipment.json'));
    request(url)
      .post('/')
      .auth(authToken, { type: 'bearer' })
      .set('Content-Type', 'application/json')
      .send(payloadData)
      .expect('Content-Type', /json/)
      .end((err, res) => {
        console.log(`status code ${res.statusCode}`);
        expect(res.body.status).to.include('success');
        expect(res.body.message).to.include('Oyster stock shipment allowed.');
        expect(res.statusCode).to.equal(200);
        done();
      });
  });


  it('validate shipment timeframe validation', (done) => {
    var payloadData = JSON.parse(fs.readFileSync('./src/test/testdata/timeframeExpired.json'));
    request(url)
      .post('/')
      .auth(authToken, { type: 'bearer' })
      .set('Content-Type', 'application/json')
      .send(payloadData)
      .expect('Content-Type', /json/)
      .end((err, res) => {
        expect(res.body.status).to.include('failure');
        expect(res.body.message).to.include('Shipment prohibited, timeframe check failed.');
        expect(res.statusCode).to.equal(400);
        done();
      });
  });

  it('validate origin estuary is under investigation', (done) => {
    var payloadData = JSON.parse(fs.readFileSync('./src/test/testdata/originEstuaryIsUnderInvestigation.json'));
    request(url)
      .post('/')
      .auth(authToken, { type: 'bearer' })
      .set('Content-Type', 'application/json')
      .send(payloadData)
      .expect('Content-Type', /json/)
      .end((err, res) => {
        expect(res.body.status).to.include('failure');
        expect(res.body.message).to.include('The shipment origin estuary is closed for investigation. Shipments cannot be made from this estuary to another estuary. Please contact Biosecurity for further information.');
        expect(res.statusCode).to.equal(400);
        done();
      });
  });

  it('validate shipment is moving between estuaries with same risk classification', (done) => {
    var payloadData = JSON.parse(fs.readFileSync('./src/test/testdata/sameRiskEstuaries.json'));
    request(url)
      .post('/')
      .auth(authToken, { type: 'bearer' })
      .set('Content-Type', 'application/json')
      .send(payloadData)
      .expect('Content-Type', /json/)
      .end((err, res) => {
        expect(res.body.status).to.include('success');
        expect(res.body.message).to.include('Oyster stock shipment allowed.');
        expect(res.statusCode).to.equal(200);
        done();
      });
  });

  it('validate shipment is moving from low risk to high risk estuary', (done) => {
    var payloadData = JSON.parse(fs.readFileSync('./src/test/testdata/sameRiskEstuaries.json'));
    request(url)
      .post('/')
      .auth(authToken, { type: 'bearer' })
      .set('Content-Type', 'application/json')
      .send(payloadData)
      .expect('Content-Type', /json/)
      .end((err, res) => {
        expect(res.body.status).to.include('success');
        expect(res.body.message).to.include('Oyster stock shipment allowed.');
        expect(res.statusCode).to.equal(200);
        done();
      });
  });

});
