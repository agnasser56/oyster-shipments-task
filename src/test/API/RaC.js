const request = require('supertest');
const { assert, expect } = require('chai');
const { url, authURL } = require('../../helper/baseUrl');
const fs = require('fs');
const { schema } = require('../../schemas/stock_schema.json');

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
        assert.equal(res.status, 200);
        done();
      });

  });

  it('validate unauthorized access', (done) => {
    request(url)
      .post('/')
      .auth('eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6IjdRSEowN0N2NmliRTNaeS1YbXFMYiJ9.eyJuaWNrbmFtZSI6ImFnbmFzc2VyNTYiLCJuYW1lIjoiYWduYXNzZXI1NkBob3RtYWlsLmNvbSIsInBpY3R1cmUiOiJodHRwczovL3MuZ3JhdmF0YXIuY29tL2F2YXRhci9hNzQzZjBjMGEzZDg3Njk4OTJjNjFmZWVjNDkwZDRkNT9zPTQ4MCZyPXBnJmQ9aHR0cHMlM0ElMkYlMkZjZG4uYXV0aDAuY29tJTJGYXZhdGFycyUyRmFnLnBuZyIsInVwZGF0ZWRfYXQiOiIyMDIzLTAzLTE3VDEwOjEyOjEwLjE3MloiLCJlbWFpbCI6ImFnbmFzc2VyNTZAaG90bWFpbC5jb20iLCJlbWFpbF92ZXJpZmllZCI6dHJ1ZSwiaXNzIjoiaHR0cHM6Ly9kZXYtZG9ucy1yYWMuYXUuYXV0aDAuY29tLyIsImF1ZCI6IjZxamVZU0s4Z2ZqOGZBbGlmeGRnaGxjaGtwMU5QQVoxIiwiaWF0IjoxNjc5MDQ3OTMwLCJleHAiOjE2NzkwODM5MzAsInN1YiI6ImF1dGgwfDY0MGZlMDE5ODMyNjM4MDUxNTAyYmVmOSJ9.wIngII1jnDecmVkLpmnB67P2lCNbJVsWiCI23L_hys3iwM9VNgDNdvMXhIwQCS2wEFIge9T4sA2S-Epmobv2xQnUH51PVnflpV4TAnLeLsJcgez6UwY_8sav9AoFjifQxIwyW9ZvUGIqFPFzgvskSwvh4EQdE0Bv3PeRRhJznqfd6k77bQNFDZc4A_blm9MJKbxo5sI7DocecJe9ppd9Ae2e4RnrisKwxiollj3A_A9Q1iXe5lALM7V13dcS1YkDk9LMmQTQQ1egF5L9AyLVEeALWREOKBMqATVpTMQ-jD_Q51gVn33tqqBWJgwYRJdu8lCs493eRgmRwaPbisPrXA', { type: 'bearer' })
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
        expect(res.body.status).to.include('success');
        expect(res.body.message).to.include('Oyster stock shipment allowed.');
        expect(res.statusCode).to.equal(200);
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
