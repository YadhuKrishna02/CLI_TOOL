import { assert } from 'chai';
import { departures, rechargeCard, checkIn, calculateTravelCharge, printSummary } from './metro-card.js';

describe('MetroCard System', () => {
    beforeEach(() => {
        departures.CENTRAL = {
            name: 'CENTRAL',
            passengers: {},
            totalCollection: 0,
            totalDiscount: 0,
            passengerTypeCount: {
                ADULT: 0,
                SENIOR_CITIZEN: 0,
                KID: 0,
            },
        };
        departures.AIRPORT = {
            name: 'AIRPORT',
            passengers: {},
            totalCollection: 0,
            totalDiscount: 0,
            passengerTypeCount: {
                ADULT: 0,
                SENIOR_CITIZEN: 0,
                KID: 0,
            },
        };
    });

    describe('Function: rechargeCard', () => {
        it('should add amount to the card balance', () => {
            const card = { balance: 100 };
            const amount = 50;
            rechargeCard(card, amount);
            assert.equal(card.balance, 150);
        });
    });

    describe('Function: calculateTravelCharge', () => {
        it('should return the correct travel charge for each passenger type', () => {
            assert.equal(calculateTravelCharge(departures.CENTRAL, 'ADULT'), 200);
            assert.equal(calculateTravelCharge(departures.CENTRAL, 'SENIOR_CITIZEN'), 100);
            assert.equal(calculateTravelCharge(departures.CENTRAL, 'KID'), 50);
        });

        it('should return 0 for an invalid passenger type', () => {
            assert.equal(calculateTravelCharge(departures.CENTRAL, 'UNKNOWN_TYPE'), 0);
        });
    });

    describe('Function: checkIn', () => {
        it('should handle check-in with sufficient balance', () => {
            const cardNumber = 'MC1';
            const passengerType = 'ADULT';
            const fromStation = 'AIRPORT';
            departures[fromStation].passengers[cardNumber] = { balance: 200, journey: 0 };
            checkIn(cardNumber, passengerType, fromStation);
            assert.equal(departures[fromStation].passengers[cardNumber].journey, 1);
            assert.equal(departures[fromStation].totalCollection, 200);
            assert.equal(departures[fromStation].passengerTypeCount[passengerType], 1);
        });

        it('should handle check-in with insufficient balance for a single trip', () => {
            const cardNumber = 'MC1';
            const passengerType = 'ADULT';
            const fromStation = 'AIRPORT';
            departures[fromStation].passengers[cardNumber] = { balance: 50, journey: 0 };
            checkIn(cardNumber, passengerType, fromStation);
            assert.equal(departures[fromStation].passengers[cardNumber].journey, 0);
            assert.equal(departures[fromStation].totalCollection, 0);
            assert.equal(departures[fromStation].totalDiscount, 0);
            assert.equal(departures[fromStation].passengerTypeCount[passengerType], 0);
        });

    });

    describe('Function: printSummary', () => {
        it('should print the correct summary', () => {
            // Mock data for testing
            departures.CENTRAL.totalCollection = 100;
            departures.CENTRAL.totalDiscount = 50;
            departures.CENTRAL.passengerTypeCount.ADULT = 2;
            departures.CENTRAL.passengerTypeCount.SENIOR_CITIZEN = 1;

            const consoleOutput = captureConsoleOutput(() => {
                printSummary();
            });

            assert.include(consoleOutput, 'TOTAL_COLLECTION CENTRAL 100 50');
            assert.include(consoleOutput, 'PASSENGER_TYPE_SUMMARY');
            assert.include(consoleOutput, 'ADULT 2');
            assert.include(consoleOutput, 'SENIOR_CITIZEN 1');
        });

    });

    describe('Function: handleInput', () => {
    });
});

function captureConsoleOutput(callback) {
    const log = console.log;
    let consoleOutput = '';
    console.log = function (data) {
        consoleOutput += data + '\n';
    };
    callback();
    console.log = log;
    return consoleOutput;
}
