'use server';

import Joi from 'joi';

import { getLoginedMe } from '@/actions';
import { Dog, DogBreed } from '@/entities';
import {
  ActivityLevel,
  AmountOfTreats,
  BodyCondition,
  DateOfBirthMethod,
  DogFood,
  FoodAllergies,
  Gender,
  Pickiness,
} from '@/enums';
import { executeQuery } from '@/helpers/queryRunner';

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
  eating: DogFood[];
  amountOfTreats: AmountOfTreats;
  pickiness: Pickiness;
}

const schema = Joi.object<UpdateDogAction>({
  id: Joi.number().positive().required(),
  name: Joi.string().required(),
  breeds: Joi.array().items(Joi.number().positive().required()).required(),
  gender: Joi.valid(...Object.values(Gender)).required(),
  isNeutered: Joi.boolean().required(),
  dateOfBirthMethod: Joi.valid(...Object.values(DateOfBirthMethod)).required(),
  dateOfBirth: Joi.date().required(),
  weight: Joi.number().positive().required(),
  bodyCondition: Joi.valid(...Object.values(BodyCondition)).required(),
  activityLevel: Joi.valid(...Object.values(ActivityLevel)).required(),
  allergies: Joi.number().positive().required(),
  eating: Joi.array()
    .items(Joi.valid(...Object.values(DogFood)).required())
    .required(),
  amountOfTreats: Joi.valid(...Object.values(AmountOfTreats)).required(),
  pickiness: Joi.valid(...Object.values(Pickiness)).required(),
});

export default async function updateDogAction(data: UpdateDogAction) {
  const { value, error } = schema.validate(data);

  if (error) {
    throw new Error('schema is not valid');
  }

  const me = await getLoginedMe();

  await executeQuery(async (queryRunner) => {
    const data = await queryRunner.manager.findOne(Dog, {
      where: {
        id: value.id,
        user: { id: me.id },
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
