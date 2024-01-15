import AppDataSource from '@/AppDataSource';
import { Breed } from '@/entities';

export default AppDataSource.getRepository(Breed);
