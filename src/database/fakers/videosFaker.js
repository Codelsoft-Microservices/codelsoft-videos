import { faker } from '@faker-js/faker';
import { v4 as uuidv4 } from 'uuid';

const genres = ["Action", "Comedy", "Drama", "Horror", "Sci-Fi", "Documentary", "Adventure", "Romance"];

export const generateFakeVideo = () => {
  return {
    uuid: uuidv4(),
    title: faker.lorem.words({ min: 2, max: 5 }),
    description: faker.lorem.sentences(2),
    genre: faker.helpers.arrayElement(genres),
    likes: faker.number.int({ min: 0, max: 1000 }),
    deleted: false
  };
};
