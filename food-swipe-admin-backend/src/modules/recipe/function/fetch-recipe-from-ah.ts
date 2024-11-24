export async function fetchRecipeFromAh(id: number): Promise<Recipe | null> {
    const response = await fetch('https://www.ah.nl/gql', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Origin': 'https://www.ah.nl',
            'Cookie': 'SSLB=1; SSID=CQA4VR1-AAAAAACjjD9ngPmCAaOMP2cBAAAAAAAAAAAAo4w_ZwBUmnQMAAEU5AAAo4w_ZwEAggwAAePkAACjjD9nAQAvDAABi98AAKOMP2cBAHcMAAEx5AAAo4w_ZwEA4goAAXnSAACjjD9nAQB1DAABF-QAAKOMP2cBAMcKAAGh0QAAo4w_ZwEAagwAAdXjAACjjD9nAQB8DAABVeQAAKOMP2cBAA; SSSC=4.G7439819741172267392.1|2759.53665:2786.53881:3119.57227:3178.58325:3188.58388:3189.58391:3191.58417:3196.58453:3202.58595; SSRT=o4w_ZwABAA; i18next=nl-nl; Ahonlnl-Prd-01-DigitalDev-F1=!fRoskYShO1ahSMe0BNaqcoBHZrTlZ4ChH4A+FOOfK0E7E296fctMD9XJ2CBusXLNeVln84+JsOZEbTY=; ak_bmsc=2F98A860C4A922DE4FB36C6F0FE1A0F5~000000000000000000000000000000~YAAQVwcQArWVX0eTAQAARV49UBkVpHymgs/lJwO7UiT2KiFX5U5Kzi9+wdS0zm1KGtlqWKphcY4IcJvLu/d56ZAn6lH3UEtieJpbHiezPH0L/94t/A0RrVHGl2RA/uzlHxigpC7T98eDxDeacG3VS6BL3Pwk6v/Rzpw/PKAjLS5+EJMeRKL6U8IkueJ70qQ2BAQnm/5bgbpKbaWB8JPjdYkDvB8lLTmc7Tmlg/wE+Mfvma2YceB/ic8k/wTVav8cvmnIYkyHGtpUfP9/ASd6wpnt2B29+Afdf/1t7bdrFMZC5UOlF5JYCYlTLcvOXLr7yjboT9r0NNhjY6zOfHUqGKFRWXgF/ilxXX79WmRpze6mkcLKpbRCSNeYB3Du7+2oA48zTWPoPuk=; SSPV=1eUAAAAAAAAAHAAAAAAAAAAAAAIAAAAAAAAAAAAA; Ahonlnl-Prd-01-DigitalDev-B2=!GBdu6MgZ7N9zVZhcW3zSMawkMtSFep+ROoeJkoSvTqECOAcCeCgEQbMn40f0wVxdrP4i/uW9wD6UZg==; bm_ss=ab8e18ef4e; _abck=DA2A531EF24C2FF7E1013CDCB97FEACA~-1~YAAQVwcQAm+YX0eTAQAAn2E9UAxFMnvGl9xlXifjgxIvyJxx4vWug8dnlglWHrwJCI2Q2TwEKorOxuDLVOEc+82Rl5NEvRb0zusQbUTLNF0cYduSO2gSI8ADMw5zvKPSmfNc9W7uQoYCjLXQmGXxbA5FjnZ5Lk7rTVoUmVP6+YSVAFyKrUiF7y4SzOMCipObIRYTbri6QE8jNITRfqubRK7f/GRYElT/ll4vW2062ldlR6iTyUx2vzlCZxqQgQqvvPDkbaJ1UrFh+GX7y0qF8jbWlLwWecSzfYAFc9qyO/MgM8tk3DzisBX01l25TBITHO0uWnrTFbTnu2HX72PyqfalrxR3BWnhD7lgX/QuDAIl3S62RjNEyq0/b34UEhPfmTaa7Q5gHftsVx4Hr+9/QjnEAq/ZnTwwLmPWOw==~-1~-1~-1; bm_sz=01C233180A4B5D7CCD5F1A3384A34C9C~YAAQVwcQAnKYX0eTAQAAn2E9UBkoeI4pRTystwLVG8DSJpv8HtUPm5WhYoPQJvkfI8ku+at71dZ0Wa0gYRZiRvV6GG9XV7KcHnlBNXWqWyPRNFNdgKtO3ufvWBSk3YbIGhFCyQJVCbUAX4HcM5b61AddgWw22SCtoLFYVH87b6uWHEAeHPDzzqUiJWZpdn5/NcO0fyWxZaj0mKlB6osNyvoNHqVeiDGBLzwQd3JFZQsDE9/X5u+iwrt0t2+p87w6qbVk8p30jDIFgtCDYz1WV3qqhRQ/ApyUP4Oe0Gwv6DkKqwnCovMF37YKxdAE6pZjgu8qfVFnp4iABsRmnq/BeJ8E9433R05//ZbOR5J9FYCRjQ9Dzg==~3293497~4343364; bm_s=YAAQVwcQAhyaX0eTAQAAimM9UAIf/VK7bIzIxYXKxWyQ+Cm9awkxrSL/mTj4d0U7K6vcHDAvwjVWK3t59ns19moXs9zHA/zv7pdpzJ14pEufLiQpG3odDlWItH9ovb/0cuyEE2rsX1yL8xB+IQ/og2Ka2mFKvwd60HgRb/qTKfFyzL2/JqTb72kMEPdHF76hfnW9Eb1FY2ByVEFCA0Q//oTyhiG6jsoMGr84MkJlPV4YWMbionJuRvwj/RD/jKUjXSbcM8jb4dh2LwIrZqbksP60ZiHFikt8N9Sd7sHjVf9T8KK6fcOB+MCB8VpBiLtUvepypiuq3Z77VsTp4ra3xOM=; bm_sv=20C43485F5C168EB8A19894A3998EFBD~YAAQVwcQAh2aX0eTAQAAimM9UBn8LwLe5VO7SMC073Xk+QStI5U/oKXxe/FYD0JAzpqJKiakjRrPJNHWyfHPBX9321yUa6X7hdNYaQbpw4gug4rorJJ/y91QdX/rf73uyN+BrZxNbaSj5wuZNqqv8UyMPitwwYV0k4AU4H8tyY0IjRA0s1EtpabOStQgNaiAIaKHXmkwNUS8+ZeUKZUXaRNbW+NGlYUvoqpjh7AQcNNMvEvRbnLe2SRSyFG/CFA=~1'
        },
        body: JSON.stringify({
            query: sqlStr,
            variables: {
                id: id,
            },
        }),
    });
    if  (!response.ok) {
        throw new Error(`Failed to fetch recipe: ${await response.text()}`);
    }
    const data = await response.json();
    if ('errors' in data) {
        const error = data.errors[0];
        if (error?.extensions?.httpStatusCode) {
            return null;
        }
        throw new Error(`Failed to fetch recipe: ${JSON.stringify(data.errors)}`);
    }
    return data.data.recipe as Recipe;
}

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
    }
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
    }
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
}


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