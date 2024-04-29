import BreedSeeder from './BreedSeeder';
import CareerSeeder from './CareerSeeder';
import DogSeeder from './DogSeeder';
import Seeder from './Seeder';

export default [new BreedSeeder(), new CareerSeeder(), new DogSeeder()] as Seeder[];
