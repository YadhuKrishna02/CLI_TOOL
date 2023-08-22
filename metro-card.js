export const departures = {
    CENTRAL: {
        name: 'CENTRAL',
        passengers: {},
        totalCollection: 0,
        totalDiscount: 0,
        passengerTypeCount: {
            ADULT: 0,
            SENIOR_CITIZEN: 0,
            KID: 0,
        },
    },
    AIRPORT: {
        name: 'AIRPORT',
        passengers: {},
        totalCollection: 0,
        totalDiscount: 0,
        passengerTypeCount: {
            ADULT: 0,
            SENIOR_CITIZEN: 0,
            KID: 0,
        },
    },
};

export const TRAVEL_CHARGES = {
    ADULT: 200,
    SENIOR_CITIZEN: 100,
    KID: 50,
};

export function rechargeCard(card, amount) {
    card.balance += amount;
}




export function checkIn(cardNumber, passengerType, fromStation) {
    const station = departures[fromStation];
    const card = station.passengers[cardNumber];

    if (!card) {
        console.log('Invalid MetroCard number:', cardNumber);
        return;
    }

    let travelCharge = calculateTravelCharge(station, passengerType);
    if (card.journey % 2 == 1) {
        if (card.balance < travelCharge) {
            travelCharge *= 0.5;
            const requiredAmount = travelCharge - card.balance;
            const balance = card.balance
            const serviceFee = Math.ceil(requiredAmount * 0.02);
            rechargeCard(card, requiredAmount + serviceFee);
            station.totalCollection += requiredAmount + serviceFee + balance;
            station.totalDiscount += travelCharge;

        }
        else {
            travelCharge *= 0.5;
            station.totalDiscount += travelCharge;
            station.totalCollection += travelCharge

        }
    }
    else {
        if (card.balance < travelCharge) {
            const requiredAmount = travelCharge - card.balance;
            const balance = card.balance
            const serviceFee = Math.ceil(requiredAmount * 0.02);
            rechargeCard(card, requiredAmount + serviceFee);
            station.totalCollection += requiredAmount + serviceFee + balance;
        }
        else {

            station.totalCollection += travelCharge
        }
    }

    card.journey++;
    if (card.balance > travelCharge) {
        card.balance -= travelCharge;
    }
    card.passengerType = passengerType; // Update the passengerType
    station.passengerTypeCount[passengerType]++;
}


export function calculateTravelCharge(station, passengerType) {
    const stationTravelCharges = TRAVEL_CHARGES[passengerType];
    return stationTravelCharges
        ? stationTravelCharges
        : 0;
}

export function printSummary() {
    for (const station of Object.values(departures)) {
        const { name, totalCollection, totalDiscount, passengerTypeCount } = station;

        console.log(`TOTAL_COLLECTION ${name} ${totalCollection} ${totalDiscount}`);
        console.log('PASSENGER_TYPE_SUMMARY');

        const sortedPassengerTypes = Object.keys(passengerTypeCount).sort((a, b) => {
            const countDiff = passengerTypeCount[b] - passengerTypeCount[a];
            return countDiff !== 0 ? countDiff : a.localeCompare(b);
        });

        for (const passengerType of sortedPassengerTypes) {
            const count = passengerTypeCount[passengerType];
            if (count > 0) {
                console.log(`${passengerType} ${count}`);
            }
        }
    }
}



let summaryPrinted = false;
export function handleInput(command) {
    if (!command.trim()) {
        return;
    }
    const args = command.split(' ');
    const commandType = args[0];

    switch (commandType) {
        case 'BALANCE':
            const cardNumber = args[1];
            const balance = parseInt(args[2]);
            const newCard = { balance, journey: 0 };
            departures.CENTRAL.passengers[cardNumber] = newCard;
            departures.AIRPORT.passengers[cardNumber] = newCard;
            break;

        case 'CHECK_IN':
            const cardNumberCheckIn = args[1];
            const fromStation = args[3];
            const passengerType = args[2]; // Moved this line here

            const card = departures[fromStation].passengers[cardNumberCheckIn];

            if (!card) {
                console.log('Invalid MetroCard number:', cardNumberCheckIn);
                return;
            }

            checkIn(cardNumberCheckIn, passengerType, fromStation);
            break;

        case 'PRINT_SUMMARY':
            if (!summaryPrinted) {
                printSummary();
                summaryPrinted = true;
            }
            break;

        default:
            console.log('Invalid command:', commandType);
            break;
    }
}

