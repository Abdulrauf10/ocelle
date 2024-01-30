import Seeder from './Seeder';
import BreedSeeder from './BreedSeeder';
import CareerSeeder from './CareerSeeder';

export default [new BreedSeeder(), new CareerSeeder()] as Seeder[];
