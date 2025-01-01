export async function fetchRecipeFromAh(id: number): Promise<Recipe | null> {
    const response = await fetch('https://www.ah.nl/gql', {
        method: 'POST',
        headers: {
            'access-control-allow-credentials': 'true',
            'access-control-allow-origin': 'https://www.ah.nl',
            'Content-Type': 'application/json',
            'Origin': 'https://www.ah.nl',
            'Cookie': 'i18next=nl-nl; Ahonlnl-Prd-01-DigitalDev-F1=!fRoskYShO1ahSMe0BNaqcoBHZrTlZ4ChH4A+FOOfK0E7E296fctMD9XJ2CBusXLNeVln84+JsOZEbTY=; SSSC=4.G7439819741172267392.3|2786.53881:3178.58325:3214.58777:3219.58804; SSPV=OIsAAAAAAAAAAwAAAAAAAAAAAAIAAAAAAAAAAAAA; SSLB=0; SSID=CQDhYh0AAAAAAACjjD9ngPmCAaOMP2cDAAAAAABhsitrNUppZwBUmg; SSRT=709pZwQBAA; _csrf=Q1O4lhIKIvMZaIeq3PN8-QpO; Ahonlnl-Prd-01-DigitalDev-B2=!qZ/Mtz6T7YAqWEhcW3zSMawkMtSFenJoWArItchoWTyYhRsqP0OkmWjp1GS5NEgBea/BLvtlbfxizg==; bm_ss=ab8e18ef4e; _abck=DA2A531EF24C2FF7E1013CDCB97FEACA~-1~YAAQVQcQApJ3RMqTAQAA893qIg1xEBstWWTYd9RsCVfUsmw7L4gZbcpzoilUJWJ/Uhpl+7ghb6K0v8AdEjB5lgzBPa6ZF4UyzSL+/7Fkm3A5jynJMiA4yHYvDOhKLx9rDmsfJRADdONIqz/xtXh3xYR0qbD9xbSa8a/Rc40TTHi3mASLqyXvqVz907HSRm16FSHshI90pRAJDeZBsDeKG/E3xyyxDFQ25pdPu70VrepSY0RyUaWltJQlbV8mkZBEwxIGv9A734EHGTosIH/1RtAUolfEMusZYKryI+WXd03I6gDDGtC7iC81zUtUTLDyhHC0oyuEZW72157WBVF8D1YvRdjz6ysHlHECnCPcId47F8NPRqducm5pFttucEnC3cq1BVarGIP9DPTB/AIfbiAT52gl2auQ7iTBgFh219qp9ZrGP+/hCZX/~-1~-1~-1; bm_sz=AD19BF7C965E3D1EC7986D114254B492~YAAQVQcQApV3RMqTAQAA893qIho3PCcTwb7L5Es3FB/vxu95X9HGX5LZL61b3BAFKCMw7Fb2I3r/Spdt81tv0Nffz/yTfCGUoQ2cFBOATfX5NqIcjLvIqAMUip34KJuhwjaEvMmGx5D1eHIL+9VjOdxIsnvxGdhrpNu8FQ3+m2t8kttURzAN2auE068Vb8dIeAjW/5CfxwbwyWwztS72TKFKxjrDIWDe5n9XwiyWv2KOhj0BW0EIDpPKhkmIFCOgIV1LkIG8wk2JiHU9JvSPdApnPuEC+3YXLL55rCubCzBUF4ynHZMpWhzEf2JgJ19iI5522DnVHWN3568b1hk/XFjviAMEJmLuujGvF9FwjCzLaK6lZw==~3752243~4339782; bm_mi=5E62695023AB1DA59977F110407862AD~YAAQVQcQAm4FRcqTAQAAVjHsIhoMMrrEoULZ0dA8NHHaPr3wWQjvRO0eJmrSvrcjeybnaDoSKeNAgC0+aBWQ64AEd2rByLmlN5XbmgYEnb+xlFMCWz8lezrLTp5bblDNlqcMB88AgaD2EWtLlI7UZ3ChHbAwf3pbTvfxQJ+YGNIy7qFyhsjiKqmfcKQJwru+9jIIruJtWaDV8WHRGxjZOloBNTBC0dqoNLEHrhQImBWyTLpZ5IP4w3/G417PFtA42HKrpuHLcpVnrQ6qaTbQ94KWOgbmWAAuS6Ai7tK5G7W7GdZJYL1hs3ZI1UdKXpml16jhtGK/ATlzMcP2XfZ6O+6AihzV2Q==~1; bm_sv=27D4DD2F814D612CCF4E6305A04D06AB~YAAQVQcQApocRcqTAQAA02zsIhrpq+8pi/SPWfFKqwGhiLdNKI3+A6K9ubqdQRFH3qGfnffV+8vbwsW3B0oKKr3ksafn7fjUj44cGVsdPyRJhOALNQxRGNbuRQHw0KVFJPnh+LV4bkMos81DVOgpDkmdVjfbbIuKjorDtHnHFe0pHEILceY6Y8MpmrS8iR7aTYrTvnrrqu3+1CE+yQ6R9R++BY/nNoFVwnPEpkzX9eDFZyydIKP97haN2Pmea1Ra~1; ak_bmsc=3CB9B91106F9845AAD67EC971361333F~000000000000000000000000000000~YAAQVQcQAn4eRcqTAQAACHLsIhqnywfS5vGtm3vuoweOG8mqgfEPXghhiC/Mzi4jAelB9aIanRXlbJDoyceUpbzkQSGDtAmcKRv4q8OuwVJfPXpf03KlQU9Hi6aIxFRJ2wE6EHDLndMHJewd9xUE7P0PyCF5Rm8mNYDeeP3Hgjt7nlO3GG/VvedBq1KLz/+DjPHg9Yoy99C1b+t5O/ciZuzHvuHrHyzjIfv9WlMXIxEMabCin6UH9qyn+nQnkHnuR61yYuO5GJUNbR0sTtHQ/Hyq7Y+dItUShCCwad5Q/dN+S1BHcsd6VjDlzynKCnNcuft2Z3lNnhiPlCdYVGlSFT3SWxhjfCoZk6yYk2bs8gAdZhO+QV5GoQC7kNwdJzON35l3xGR02AS1do4xTyQgATMGDaUrWuLWL85Vi2tLTLWwJ7rBz9RlX1H43LOd34t5UGT8+SaCVw==; bm_lso=54979CF647AE0FE19C74C36C42283D98E72A0A9D8611961C00048058D9DE7651~YAAQYgcQAruZ5h+UAQAAvZf1IgKppQGbrqe9tbGCtiyz2WGgr++2mDJDW1n36YJZL2iOnqgY/QGj7rmKLHB/zt7FVx7bzYNvwVCHkRN5FmWaJitG4kdP0L2EVYtdjl9DBDXZ/osAArTaZq53jbOSwhYbloLz79P3Hlaa4O0EhQCBZ63gYSc93UQScN12YZ9qbZACg+VjAgU5nkeRzkwEdKgbjGI41tquRFfhpkL/BDP10s2muYA8J9GDTX9H/FgkHTTtQHqFxwNTZzUxm9Fg08VuMHaXm+O7YudQlFVIdz9c80g601R3DRWqwGSFwuHX7R2GsZjP7Me428gxQ+OKQUkJTcOOz6Xdobu5P+Y1kMyxmfUwIOdkdHJyZ0tWKVkQfiUN9uG8py/4m0QIj5F29VKq89APGn3K/4mdgh/DuSigQsaPZ+iJubrXY99XDhI0zZ9flGW35kA=^1735753315933; bm_s=YAAQYgcQAhrb5h+UAQAA+Bn2IgIFDUzw/MpoXcR7Jj7n1ioGYpowi/03enHPv3ZLEIajQIIXvLI0YwZh65GaB+S/EOB88a58tJHS9ytOgYfsOICpb8oyBznth45pZe4fD4M5wS3DAEUFOZnbpijNgrFtEpOzSUBI2dS2qIbhwmKSr52L1UVg/RDSnldsjGV3S4rOwmy4yjjfn5YbSRwngESB1GxorZxWmaMcjFuycMjmsqOZzq/nPIytfRpUro3cqf2N4uQEYc2pYUQkAXbG+ry4yuKx4ow8Z74bn1kqFz3hy7QvC0z49kY1S+xL6Zhr/Ejowz5uTvuhhR8QCSE4GN0=; bm_so=12A2AC6426F00BD7474CD69E6B7324BC6984C8E612DA2DFBDC7A7B280BAFE368~YAAQYgcQAhvb5h+UAQAA+Bn2IgJMO3IqnIGnp70m08wc5Cf/3O26XfDZTd+dskxg3H9nsHSzc715PBv5alKLeo+tp5UkZJuwIiWA0rx8H24bQZ+fP3dNtFScnXbUuFM5BbXx8pW2oUiL8Vwyxy1XxYgw9ALuVAiZKh6ptqUD0BlYrkLB8vfzkWX0vinKmA1+D8MMwYRLuyzXarKfuSQlk6wu+bmOvsSoHMdEGAGqgiuAcyppe71bM8Zcc6iIV54A4QeMUmca04NN2SWUNWCQVe0n58/oiIQNVMkfvhK3EGn9811LF/ZkVYh01bZjzwLdVMdn7EAqDvLVsjspCKEM45jfVmEBu7ecE5Unp6GYp1rl+gq1FfZNOV32hCIFhde/0R4/eGV5NGsffwNvbFFRn5P739+oGjaFH3ddBziKznrAiOrJhOHm/EqUmiiyCFgJGnu7uXooCJE=',
            'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36',
            'x-client-name': 'ah-allerhande',
            'x-client-platform-type': 'Web',
            'x-client-version': '1.1023.3',
        },
        mode: 'cors',
        credentials: 'include',
        referrerPolicy: 'strict-origin-when-cross-origin',
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

export type {Recipe as AHRecipe};

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