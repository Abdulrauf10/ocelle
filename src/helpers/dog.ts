import { startOfDay, subMonths, subYears } from 'date-fns';
import dayjs from 'dayjs';

import { ActivityLevel, BodyCondition, FoodAllergies, Pickiness, Recipe, Size } from '@/enums';
import { LifeStage } from '@/types';
import { BreedDto } from '@/types/dto';

function isExactSize(breeds: BreedDto[], sizes: Array<Size>) {
  return breeds.filter((x) => sizes.indexOf(x.size) > -1).length === breeds.length;
}

function isContainsSize(breeds: BreedDto[], sizes: Array<Size>) {
  return breeds.filter((x) => sizes.indexOf(x.size) > -1).length > 0;
}

export default class DogHelper {
  static getDateOfBirth(years?: number, months?: number) {
    return subMonths(subYears(startOfDay(new Date()), years ?? 0), months ?? 0);
  }
  /**
   * Refer to `Excel: customization variables v1.01 > Customization Variables`
   */
  static getLifeStage(breeds: BreedDto[], dateOfBirth: Date): LifeStage {
    const ageM = dayjs().diff(startOfDay(dateOfBirth), 'month', true);
    const ageY = dayjs().diff(startOfDay(dateOfBirth), 'year', true);

    // Puppy
    if (isExactSize(breeds, [Size.Small])) {
      if (ageM < 12) return 'Puppy';
      else if (ageM >= 12 && ageY < 9) return 'Adult';
      else return 'Senior';
    }

    if (isExactSize(breeds, [Size.Medium]) || breeds.length === 0) {
      if (ageM < 12) return 'Puppy';
      else if (ageM >= 12 && ageY < 7) return 'Adult';
      else return 'Senior';
    }

    if (isExactSize(breeds, [Size.Large])) {
      if (ageM < 16) return 'Puppy';
      else if (ageM >= 16 && ageY < 5) return 'Adult';
      else return 'Senior';
    }

    if (isContainsSize(breeds, [Size.Small]) && isContainsSize(breeds, [Size.Medium, Size.Large])) {
      if (ageM < 12) return 'Puppy';
      else if (ageM >= 12 && ageY < 7) return 'Adult';
      else return 'Senior';
    }

    if (isContainsSize(breeds, [Size.Medium]) && isContainsSize(breeds, [Size.Large])) {
      if (ageM < 16) return 'Puppy';
      else if (ageM >= 16 && ageY < 5) return 'Adult';
      else return 'Senior';
    }

    throw new Error('Cannot calculate the life stage');
  }
  /**
   * Refer to `Excel: customization variables v0.12 > Customization Variables`
   * @deprecated v1.01
   */
  static isYoungPuppy(birth: Date) {
    const age = dayjs().diff(birth, 'month', true);
    return age < 4;
  }
  /**
   * Refer to `Excel: customization variables v1.01 > Customization Variables`
   */
  static getWeightModifier(condition: BodyCondition) {
    if (condition === BodyCondition.TooSkinny) return 1.15;
    else if (condition === BodyCondition.JustRight) return 1;
    else return 0.85;
  }
  /**
   * Refer to `Excel: customization variables v1.01 > Customization Variables`
   */
  static calculateIdealWeight(currentWeight: number, condition: BodyCondition) {
    return currentWeight * this.getWeightModifier(condition);
  }
  /**
   * Refer to `Excel: customization variables v1.01 > Customization Variables`
   */
  static getDerMultiplier(
    breeds: BreedDto[],
    dateOfBirth: Date,
    neutered: boolean,
    activityLevel: ActivityLevel
  ) {
    const stage = this.getLifeStage(breeds, dateOfBirth);
    if (stage === 'Puppy') {
      return 2;
    }
    if (activityLevel === ActivityLevel.Mellow) {
      return neutered ? 1.1 : 1.2;
    } else if (activityLevel === ActivityLevel.Active) {
      return neutered ? 1.4 : 1.5;
    } else {
      return neutered ? 1.6 : 1.8;
    }
  }
  /**
   * Refer to `Excel: customization variables v1.01 > Product Recommendations`
   */
  static isAllergies(recipe: Recipe, allergies: FoodAllergies) {
    switch (recipe) {
      case Recipe.Chicken:
        return (allergies & FoodAllergies.Chicken) === FoodAllergies.Chicken;
      case Recipe.Beef:
        return (allergies & FoodAllergies.Beef) === FoodAllergies.Beef;
      case Recipe.Pork:
        return (allergies & FoodAllergies.Pork) === FoodAllergies.Pork;
      case Recipe.Lamb:
        return (
          (allergies & FoodAllergies.Beef) === FoodAllergies.Beef ||
          (allergies & FoodAllergies.Lamb) === FoodAllergies.Lamb
        );
      case Recipe.Duck:
        return (
          (allergies & FoodAllergies.Chicken) === FoodAllergies.Chicken ||
          (allergies & FoodAllergies.Duck) === FoodAllergies.Duck
        );
    }
  }
}
