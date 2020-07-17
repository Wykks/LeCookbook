export enum RecipeCategory {
  STARTER = 'STARTER',
  MAIN = 'MAIN',
  DESSERT = 'DESSERT',
  OTHER = 'OTHER',
}

export const CategoriesLabel: { [key in RecipeCategory]: string } = {
  STARTER: 'Entrée',
  MAIN: 'Plat principal',
  DESSERT: 'Dessert',
  OTHER: 'Autre',
};

export enum IngredientType {
  PART = 'PART',
  INGREDIENT = 'INGREDIENT',
}

export interface Ingredient {
  text: string;
  type: IngredientType;
}

export const IMAGE_WIDTH = 640;
export const IMAGE_HEIGHT = 360;

export interface Image {
  jpeg: string;
  webp: string;
  thumbnail_webp: string;
  thumbnail_jpeg: string;
}

export interface Recipe {
  id: string;
  createdBy: { username: string; uid: string };
  createdAt: string;
  updatedAt: string;
  title: string;
  category: RecipeCategory;
  imageNames: (string | null)[];
  ingredients: Ingredient[];
  directives: string[];
  rating: number;
  timeToPrepare: number;
  cookTime: number;
  servingCount: number;
  tags: string[];
  source: string;
  showInPublicList: boolean;
  preHeatTemp: string;

  // Controlled server side
  viewCount: number;
  imageByName?: { [imageName: string]: Image };
}
