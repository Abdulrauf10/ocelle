import Seeder from './Seeder';
import BreedSeeder from './BreedSeeder';
import CareerSeeder from './CareerSeeder';
import DogSeeder from './DogSeeder';

export default [new BreedSeeder(), new CareerSeeder(), new DogSeeder()] as Seeder[];
