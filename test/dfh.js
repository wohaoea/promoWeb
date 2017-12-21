var should = require("should");
require("mocha");
require("../bin/www.5001");
var request = require("supertest");
var utils = require("../common/utils");
var express = require('express');
var app = express();

var wsclient = require('./dfh_simul');
var url = "http://127.0.0.1:5000";

describe('test dfh ---------', function() {
	it('data is instanceof Object', function(done) {
		wsclient.dfh_sign({
			custId: '15003955'
		}, function(data) {

			data.should.be.an.instanceof(Object);
			done();
		});
	});

	it('dfh_sign', function(done) {
		wsclient.dfh_sign({
			custId: '15003955'
		}, function(data) {
			data.should.have.property('success').and.equal(true);
			done();
		});
	});

	it('dfh_userinfo', function(done) {
		wsclient.dfh_userinfo({
			custId: '15003955'
		}, function(data) {
			data.should.have.property('success').and.equal(true);
			data.data.should.have.property('times');
			console.log(data);
			done();
		});
	});
	//判定时间是否在活动期内
	describe('checkData', function() {

		it('checkData true', function(done) {
			var startDate = new Date("2015-02-12 00:00:00");
			var endDate = new Date("2017-02-12 00:00:00");
			var result = utils.checkExpired(startDate, endDate);

			result.should.equal(true);
			done();
		});
		it('checkData false', function(done) {
			var startDate = new Date("2016-02-12 00:00:00");
			var endDate = new Date("2017-02-12 00:00:00");
			var result = utils.checkExpired(startDate, endDate);

			result.should.equal(false);
			done();
		});
	})



});


//测试正常返回
describe('GET /dfh/index', function() {
	it('/dfh/index', function(done) {
		request(url)
			.get('/dfh/index').expect(200, done);
	});
	//用户签到
	it('/dfh/sign', function(done) {
		request(url)
			.get('/dfh/sign')
			.query({
				id: 'test'
			})
			.set('Accept', 'application/json')
			.expect(200)
			.end(function(err, res) {
				should.not.exist(err);
				done();
			});
	});
	//zhuan
	it('/dfh/zhuan', function(done) {
		request(url)
			.get('/dfh/zhuan')
			.set('Accept', 'application/json')
			.expect(200)
			.end(function(err, res) {
				console.log(res.body);
				should.not.exist(err);
				//res.body.should.have.property('success').and.equal(true);
				done();
			});
	});

})