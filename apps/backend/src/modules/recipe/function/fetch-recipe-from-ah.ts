export async function fetchRecipeFromAh(id: number): Promise<Recipe | null> {
	const cookies = await getCookies();
	if (!cookies) {
		throw new Error("No cookies found");
	}
	const response = await fetch("https://www.ah.nl/gql", {
		method: "POST",
		headers: {
			"access-control-allow-credentials": "true",
			"access-control-allow-origin": "https://www.ah.nl",
			"Content-Type": "application/json",
			Origin: "https://www.ah.nl",
			Cookie: cookies,
			"user-agent":
				"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36",
			"x-client-name": "ah-allerhande",
			"x-client-platform-type": "Web",
			"x-client-version": "1.1023.3",
		},
		mode: "cors",
		credentials: "include",
		referrerPolicy: "strict-origin-when-cross-origin",
		body: JSON.stringify({
			query: sqlStr,
			variables: {
				id: id,
			},
		}),
	});
	if (!response.ok) {
		throw new Error(`Failed to fetch recipe: ${await response.text()}`);
	}
	const data = await response.json();
	if ("errors" in data) {
		const error = data.errors[0];
		if (error?.extensions?.httpStatusCode) {
			return null;
		}
		throw new Error(`Failed to fetch recipe: ${JSON.stringify(data.errors)}`);
	}
	return data.data.recipe as Recipe;
}

async function getCookies() {
	const response = await fetch("https://www.ah.nl/allerhande", {
		headers: {
			accept:
				"text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7",
			"accept-language": "en-US,en;q=0.9",
			"cache-control": "no-cache",
			pragma: "no-cache",
			priority: "u=0, i",
			"sec-ch-ua": '"Chromium";v="133", "Not(A:Brand";v="99"',
			"sec-ch-ua-mobile": "?0",
			"sec-ch-ua-platform": '"macOS"',
			"sec-fetch-dest": "document",
			"sec-fetch-mode": "navigate",
			"sec-fetch-site": "none",
			"sec-fetch-user": "?1",
			"upgrade-insecure-requests": "1",
		},
	});
	const setCookie = response.headers.get("set-cookie");
	if (!setCookie) {
		throw new Error("No set-cookie header found");
	}

	return setCookie;
}

export type { Recipe as AHRecipe };

type Recipe = {
	id: number;
	title: string;
	nutritions: {
		carbohydrates: {
			name: string;
			unit: string;
			value: number;
		};
		energy: {
			name: string;
			unit: string;
			value: number;
		};
		fat: {
			name: string;
			unit: string;
			value: number;
		};
		fibers: {
			name: string;
			unit: string;
			value: number;
		};
		protein: {
			name: string;
			unit: string;
			value: number;
		};
		saturatedFat: {
			name: string;
			unit: string;
			value: number;
		};
		sodium: {
			name: string;
			unit: string;
			value: number;
		};
		sugar: {
			name: string;
			unit: string;
			value: number;
		};
	};
	cookTime: number;
	ovenTime: number | null;
	waitTime: number | null;
	servings: {
		isChangeable: boolean;
		max: number;
		min: number;
		scale: number;
		type: string;
		number: number;
	};
	images: {
		rendition: string;
		url: string;
		width: number;
		height: number;
	}[];
	preparation: {
		steps: string[];
		summary: string;
	};
	spiciness: number;
	description: string;
	tags: {
		key: string;
		value: string;
	}[];
	ingredients: {
		id: number;
		name: {
			singular: string;
			plural: string;
		};
		quantity: number;
		quantityUnit: {
			singular: string;
			plural: string;
		};
		servingsScale: number;
		text: string;
	}[];
	kitchenAppliances: {
		quantity: number;
		name: string;
		scalable: boolean;
	}[];
	tips: {
		type: string;
		value: string;
	}[];
	href: string;
	classifications: string[];
	meta: {
		description: string;
		title: string;
	};
	cuisines: string[];
	nutriScore: number;
};

const sqlStr = `
    query recipeWithVariants($id: Int!) {
  recipe(id: $id) {
    ...recipeWithVariants
    __typename
  }
}

fragment recipeWithVariants on Recipe {
  ...recipe
  variants {
    ...recipeVariant
    __typename
  }
  __typename
}

fragment recipe on Recipe {
  id
  title
  alternateTitle
  slugifiedTitle
  courses
  modifiedAt
  publishedAt
  nutritions {
    ...recipeNutritionInfo
    __typename
  }
  cookTime
  ovenTime
  waitTime
  servings {
    isChangeable
    max
    min
    scale
    type
    number
    __typename
  }
  images(
    renditions: [D220X162, D302X220, D440X324, D612X450, D1024X748, D1224X900]
  ) {
    ...recipeImage
    __typename
  }
  preparation {
    steps
    summary
    __typename
  }
  spiciness
  description
  tags {
    key
    value
    __typename
  }
  ingredients {
    ...recipeIngredient
    __typename
  }
  kitchenAppliances {
    quantity
    name
    scalable
    __typename
  }
  tips {
    ...recipeTip
    __typename
  }
  href
  classifications
  meta {
    description
    title
    __typename
  }
  cuisines
  nutriScore
  __typename
}

fragment recipeNutritionInfo on RecipeNutritionInfo {
  carbohydrates {
    ...recipeNutrition
    __typename
  }
  energy {
    ...recipeNutrition
    __typename
  }
  fat {
    ...recipeNutrition
    __typename
  }
  fibers {
    ...recipeNutrition
    __typename
  }
  protein {
    ...recipeNutrition
    __typename
  }
  saturatedFat {
    ...recipeNutrition
    __typename
  }
  sodium {
    ...recipeNutrition
    __typename
  }
  sugar {
    ...recipeNutrition
    __typename
  }
  __typename
}

fragment recipeNutrition on RecipeNutrition {
  name
  unit
  value
  __typename
}

fragment recipeImage on RecipeImage {
  rendition
  url
  width
  height
  __typename
}

fragment recipeIngredient on RecipeIngredient {
  id
  name {
    ...singularPlural
    __typename
  }
  quantity
  quantityUnit {
    ...singularPlural
    __typename
  }
  servingsScale
  text
  __typename
}

fragment singularPlural on SingularPluralName {
  singular
  plural
  __typename
}

fragment recipeTip on RecipeTip {
  type
  value
  __typename
}

fragment recipeVariant on RecipeSummary {
  time {
    cook
    __typename
  }
  title
  images(renditions: [D220X162, D302X220, D440X324]) {
    url
    rendition
    width
    height
    __typename
  }
  id
  slug
  __typename
}
`;
