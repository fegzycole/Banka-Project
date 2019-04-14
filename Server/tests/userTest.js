import chai from 'chai';

import chaiHttp from 'chai-http';

import app from '../app';

const { expect } = chai;

chai.use(chaiHttp);

describe('Tests for all Auth(signup and signin) Endpoints', () => {
  describe('POST api/v1/auth/signup', () => {
    it('Should successfully sign up a user and return a token', (done) => {
      chai
        .request(app)
        .post('/api/v1/auth/signup')
        .send({
          firstName: 'jon',
          lastName: 'bellion',
          email: 'jon@gmail.com',
          password: 'simpleandweet',
          type: 'client',
        })
        .end((err, res) => {
          expect(res).to.have.status(201);
          expect(res.body.status).to.be.equal(201);
          expect(res.body.data).to.have.key('id', 'token', 'firstName', 'lastName', 'email', 'type', 'password', 'isAdmin');
          expect(res.body.data.token).to.be.a('string');
          done();
        });
    });
    it('Should return an error if the user provides an invalid email', (done) => {
      chai
        .request(app)
        .post('/api/v1/auth/signup')
        .send({
          firstName: 'jon',
          lastName: 'bellion',
          email: 'wrongmailaddress',
          password: 'simpleandweet',
          type: 'client',
        })
        .end((err, res) => {
          expect(res).to.have.status(400);
          expect(res.body.status).to.be.equal(400);
          expect(res.body.message).to.be.equal('Your Email is required, example fergusoniyara@banka.com');
          done();
        });
    });
    it('Should return an error if the user provides password with whitespace in between', (done) => {
      chai
        .request(app)
        .post('/api/v1/auth/signup')
        .send({
          firstName: 'jon',
          lastName: 'bellion',
          email: 'jon@gmail.com',
          password: 'simpl eand',
          type: 'client',
        })
        .end((err, res) => {
          expect(res).to.have.status(400);
          expect(res.body.status).to.be.equal(400);
          expect(res.body.message).to.be.equal('Password should be at least 4 characters without any whitespace(s)');
          done(err);
        });
    });
    it('Should return an error if the user provides no firstname', (done) => {
      chai
        .request(app)
        .post('/api/v1/auth/signup')
        .send({
          firstName: '',
          lastName: 'bellion',
          email: 'jon@gmail.com',
          password: 'simpleandsweet',
          type: 'client',
        })
        .end((err, res) => {
          expect(res).to.have.status(400);
          expect(res.body.status).to.be.equal(400);
          expect(res.body.message).to.be.equal('First Name is required, It should have no whitespace(s) in between its characters');
          done();
        });
    });
    it('Should return an error if the user provides no lastname', (done) => {
      chai
        .request(app)
        .post('/api/v1/auth/signup')
        .send({
          firstName: 'jon',
          lastName: '',
          email: 'jon@gmail.com',
          password: 'simpleandsweet',
          type: 'client',
        })
        .end((err, res) => {
          expect(res).to.have.status(400);
          expect(res.body.status).to.be.equal(400);
          expect(res.body.message).to.be.equal('Last Name is required, It should have no whitespace(s) in between its characters');
          done();
        });
    });
    it('Should return an error if firstname has a  whitespace', done => {
      chai
        .request(app)
        .post('/api/v1/auth/signup')
        .send({
          firstName: 'jon y',
          lastName: 'middlename',
          email: 'jon@gmail.com',
          password: 'simpleandsweet',
          type: 'client',
        })
        .end((err, res) => {
          expect(res).to.have.status(400);
          expect(res.body.status).to.be.equal(400);
          expect(res.body.message).to.be.equal('First Name is required, It should have no whitespace(s) in between its characters');

          done();
        });
    });
    it('Should return an error if laststname has a  whitespace', done => {
      chai
        .request(app)
        .post('/api/v1/auth/signup')
        .send({
          firstName: 'Ferguson',
          lastName: 'middl ename',
          email: 'jon@gmail.com',
          password: 'simpleandsweet',
          type: 'client',
        })
        .end((err, res) => {
          expect(res).to.have.status(400);
          expect(res.body.status).to.be.equal(400);
          expect(res.body.message).to.be.equal('Last Name is required, It should have no whitespace(s) in between its characters');
          done();
        });
    });
    it('Should return an error if the user tries to sign up with an existing email', done => {
      chai
        .request(app)
        .post('/api/v1/auth/signup')
        .send({
          firstName: 'john',
          lastName: 'joe',
          email: 'fergusoniyara@gmail.com',
          password: 'simplepassword',
          type: 'client',
        })
        .end((err, res) => {
          expect(res).to.have.status(409);
          expect(res.body.status).to.be.equal(409);
          expect(res.body.message).to.be.equal('Email Already exists');
          done();
        });
    });
  });
  describe('POST api/v1/auth/signin', () => {
    it('Should successfully log in a user and return a token', done => {
      chai
      .request(app)
      .post('/api/v1/auth/signin')
      .send({
        firstName: 'jon',
        lastName: 'bellion',
        email: 'fergusoniyara@gmail.com',
        password: 'somepassword',
        type: 'client',
      })
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body.status).to.be.equal(200);
        expect(res.body.data).to.have.key('id', 'token', 'firstName', 'lastName', 'email');
        expect(res.body.data.token).to.be.a('string');
        done();
      });
    });
    it('Should return an error if the user provides wrong login credentials', done => {
      chai
        .request(app)
        .post('/api/v1/auth/signin')
        .send({
          email: 'wrong@gmail.com',
          password: 'wrongpassword'
        })
        .end((err, res) => {
          expect(res).to.have.status(409);
          expect(res.body.status).to.be.equal(409);
          expect(res.body.message).to.be.equal('Email or password invalid');
          done();
        });
    });
  });
});