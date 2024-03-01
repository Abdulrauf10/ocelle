'use server';

import { getStoreMe } from '@/storeUserProvider';
import { Dog, DogBreed } from '@/entities';
import Joi from 'joi';
import { executeQuery } from '@/helpers/queryRunner';
import { ActivityLevel, AmountOfTreats, BodyCondition, CurrentlyEating, Pickiness } from '@/types';
import { DateOfBirthMethod, Gender } from '@/types/dog';
import { FoodAllergies } from '@/enums';

interface UpdateDogAction {
  id: number;
  name: string;
  breeds: number[];
  gender: Gender;
  isNeutered: boolean;
  dateOfBirthMethod: DateOfBirthMethod;
  dateOfBirth: Date;
  weight: number;
  bodyCondition: BodyCondition;
  activityLevel: ActivityLevel;
  allergies: FoodAllergies;
  eating: CurrentlyEating;
  amountOfTreats: AmountOfTreats;
  pickiness: Pickiness;
}

const schema = Joi.object<UpdateDogAction>({
  id: Joi.number().positive().required(),
  name: Joi.string().required(),
  breeds: Joi.array().items(Joi.number().positive().required()).required(),
  gender: Joi.valid('M', 'F').required(),
  isNeutered: Joi.boolean().required(),
  dateOfBirthMethod: Joi.valid('Manually', 'Calendar').required(),
  dateOfBirth: Joi.date().required(),
  weight: Joi.number().positive().required(),
  bodyCondition: Joi.valid('TooSkinny', 'JustRight', 'Rounded', 'Chunky').required(),
  activityLevel: Joi.valid('Mellow', 'Active', 'VeryActive').required(),
  allergies: Joi.number().positive().required(),
  eating: Joi.valid('Dry', 'Wet', 'Raw', 'Dehydrated', 'Fresh', 'Homemade', 'Other').required(),
  amountOfTreats: Joi.valid('None', 'Some', 'Lots').required(),
  pickiness: Joi.valid('Picky', 'GoodEater', 'EatAnything').required(),
});

export default async function updateDogAction(data: UpdateDogAction) {
  const { value, error } = schema.validate(data);

  if (error) {
    throw new Error('schema is not valid');
  }

  const me = await getStoreMe();

  await executeQuery(async (queryRunner) => {
    const data = await queryRunner.manager.findOne(Dog, {
      where: {
        user: { saleorId: me.id },
      },
    });

    if (!data) {
      throw new Error('data not found');
    }

    data.name = value.name;
    data.sex = value.gender;
    data.isNeutered = value.isNeutered;
    data.dateOfBirthMethod = value.dateOfBirthMethod;
    data.dateOfBirth = value.dateOfBirth;
    data.weight = value.weight;
    data.bodyCondition = value.bodyCondition;
    data.activityLevel = value.activityLevel;
    data.foodAllergies = value.allergies;
    data.currentEating = value.eating;
    data.amountOfTreats = value.amountOfTreats;
    data.pickiness = value.pickiness;

    await queryRunner.manager.save(data);

    const dogBreedRepository = queryRunner.manager.getRepository(DogBreed);
    const breeds = await dogBreedRepository.find({
      where: {
        dogId: data.id,
      },
    });
    await dogBreedRepository.remove(breeds);
    await dogBreedRepository.save(
      value.breeds.map((id) => dogBreedRepository.create({ breedId: id, dog: data }))
    );
  });
}
