import { printDefaultDeliveryDate, printIsRecommendedRecipe } from './dog';

async function run() {
  await printDefaultDeliveryDate();
  printIsRecommendedRecipe();
}

run();
