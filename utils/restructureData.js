const randomChoice = (items) => items[Math.floor(Math.random() * items.length)];
const randomBetween = (min, max) => min + Math.random() * (max - min);

export { randomChoice, randomBetween };
