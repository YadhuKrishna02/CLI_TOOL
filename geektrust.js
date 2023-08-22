import fs from 'fs'
import { handleInput } from './metro-card.js';

const filename = process.argv[2];

fs.readFile(filename, 'utf8', (err, data) => {
    if (err) {
        console.error('Error reading file:', err);
        return;
    }

    const commands = data.split('\n');
    commands.forEach(command => handleInput(command.trim()));

});

