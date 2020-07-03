const mongoose = require('mongoose');
const request = require('supertest');
const moment = require('moment');
const { Rental } = require('../../models/rental');
const { User } = require('../../models/user');
const { Motorcycle } = require('../../models/motorcycle');

describe('/api/returns', () => {
    let server;
    let customerId;
    let motorcycleId;
    let rental;
    let token;
    let motorcycle;

    const exec = () => {
        return request(server)
            .post('/api/returns')
            .set('x-auth-token', token)
            .send(({ customerId, motorcycleId }));
    };

    beforeEach(async () => {  
        server = require('../../index'); 

        customerId = mongoose.Types.ObjectId();
        motorcycleId = mongoose.Types.ObjectId();
        token = new User().generateAuthToken();
        
        motorcycle = new Motorcycle({
            _id: motorcycleId,
            mark: { mark: '12345' },
            model: '12345',
            bodyType: 'sport',
            motor: 50,
            year: '1234',
            dailyRentalFee: 100,
            numberInStock: 10
        });
        await motorcycle.save();

        rental = new Rental({
            customer: {
                _id: customerId,
                name: '12345',
                phone: '12345'
            },
            motorcycle: {
                _id: motorcycleId,
                mark: '12345',
                model: '12345',
                dailyRentalFee: 100
            }
        });
        await rental.save();
    });

    afterEach(async () => { 
        await server.close();
        await Rental.deleteMany({});
        await Motorcycle.deleteMany({});
    });

    it('should returned 401 if client is not logged in', async () => {
        token = '';

        const res = await exec();
        
        expect(res.status).toBe(401);
    });

    it('should returned 400 if customer ID is not provided', async () => {
        customerId = '';
        
        const res = await exec();
        
        expect(res.status).toBe(400);
    });

    it('should returned 400 if motorcycle ID is not provided', async () => {
       motorcycleId = '';

        const res = await exec();
         
        expect(res.status).toBe(400);
    });

    it('should returned 404 if no rental is found for this customer/motorcycle', async () => {
        await Rental.deleteMany({});
 
         const res = await exec();
          
         expect(res.status).toBe(404);
    });

    it('should returned 400 if return is already processed', async () => {
        rental.dateReturned = new Date();
        await rental.save();
 
        const res = await exec();
          
        expect(res.status).toBe(400);
    });

    it('should returned 200 if request is valid', async () => {
        const res = await exec();   
        
        expect(res.status).toBe(200);
    });

    it('should set returned date if input is valid', async () => {
        const res = await exec();   

        const rentalInDb = await Rental.findById(rental._id);
        const difference = new Date() - rentalInDb.dateReturned;
        expect(difference).toBeLessThan(10 * 1000);
    });

    it('should set rentalFee if input is valid', async () => {
        rental.dateOut = moment().add(-7, 'days').toDate();
        await rental.save();

        const res = await exec();   

        const rentalInDb = await Rental.findById(rental._id);
        expect(rentalInDb.rentalFee).toBe(700);
    });

    it('should increase movie stock', async () => {
        const res = await exec();   

        const motorcycleInDb = await Motorcycle.findById(motorcycleId);
        expect(motorcycleInDb.numberInStock).toBe(motorcycle.numberInStock + 1 );
    });

    it('should return rental if input is valid', async () => {
        const res = await exec();   

        const rentalInDb = await Rental.findById(rental._id);
        
        expect(Object.keys(res.body)).toEqual(
            expect.arrayContaining(['dateOut', 'dateReturned', 'rentalFee',
            'customer', 'motorcycle']));
    });
});
