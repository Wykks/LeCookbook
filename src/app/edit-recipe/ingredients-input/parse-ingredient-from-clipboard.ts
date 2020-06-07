import { Ingredient, IngredientType } from 'models/recipe';

const INGREDIENT_TYPE_REGEX = new RegExp(/^[·•-](.*)/);
const PART_TYPE_REGEX = new RegExp(/^(.*):$/);

export function parseIngredientFromClipboard(
  event: ClipboardEvent
): Ingredient[] {
  const text = event.clipboardData?.getData('text');
  if (!text) {
    return [];
  }
  const rawIngredients = text.split('\n').filter((i) => !!i.trim());
  return rawIngredients.map(
    (ingredient): Ingredient => {
      let cleanIngredient = ingredient.trim();
      let type = IngredientType.INGREDIENT;
      const ingredientMatch = cleanIngredient.match(INGREDIENT_TYPE_REGEX);
      const partMatch = cleanIngredient.match(PART_TYPE_REGEX);
      if (partMatch) {
        cleanIngredient = partMatch[1].trim();
        type = IngredientType.PART;
      }
      if (ingredientMatch) {
        cleanIngredient = ingredientMatch[1].trim();
      }
      return {
        text: cleanIngredient,
        type,
      };
    }
  );
}
