export async function fetchRecipeFromAh(id: number): Promise<Recipe | null> {
    const response = await fetch('https://www.ah.nl/gql', {
        method: 'POST',
        headers: {
            'access-control-allow-credentials': 'true',
            'access-control-allow-origin': 'https://www.ah.nl',
            'Content-Type': 'application/json',
            'Origin': 'https://www.ah.nl',
            'Cookie': 'SSLB=1; i18next=nl-nl; Ahonlnl-Prd-01-DigitalDev-F1=!m+UGd6DGpEOlVhnxYaMc4hAQSM24W3dxg2Ykz8HPiUBzTJokFvkocX3Lnhwi7hD9rVEGFD2VVi1XsVo=; rnumber=1427023187; _gcl_au=1.1.219917162.1730721019; _SI_VID_1.773dde7634000118911cd1bd=9fd96dfbaaa1bd3b2c931ddd; _SI_DID_1.773dde7634000118911cd1bd=d0250498-647e-3b75-84a3-07c22a1bb87b; _fbp=fb.1.1730721019589.388191473284940196; _pin_unauth=dWlkPU5tTTNOV1F4TnpJdE5qY3paaTAwTW1Rd0xUbGtNekl0TnpZNE5qZzNPVFE0TUdOag; _csrf=Ze3NA3STkXikNk0ImnazsAzC; consentBeta={%22consentDate%22:%2220241107%22%2C%22consentVersion%22:%224.0%22%2C%22gtmContainerVersion%22:%221232%22%2C%22consentStatus%22:%22accepted%22%2C%22consentCategories%22:{%22marketingAH%22:true%2C%22marketing3P%22:true%2C%22analyticsPA%22:true%2C%22necessary%22:true}%2C%22consentHost%22:%22.ah.nl%22}; cookie-consent={%22consent%22:%22yes%22%2C%22social%22:%224.0%22%2C%22ad%22:%224.0%22%2C%22version%22:%224.0%22%2C%22gtmContainerVersion%22:%221232%22%2C%22date%22:%2220241107%22%2C%22host%22:%22.ah.nl%22}; _gcl_aw=GCL.1732198302.Cj0KCQiA0fu5BhDQARIsAMXUBOITygC3336ZQ27dffG062ahqLCazFMcJ5Jd7CgITTGb4KXrdCM3O3AaAqxBEALw_wcB; _gcl_gs=2.1.k1$i1732198302$u177404533; _uetvid=f7021e909aa211ef8626191e07310c2b; ah_cid_cs=%7B%22sct%22%3A4%2C%22cid%22%3A%22ah.1.1730721017011.1221393987%22%2C%22cid_t%22%3A1730721017011%2C%22sid%22%3A1733151720393%2C%22sid_t%22%3A1733154111804%2C%22pct%22%3A28%2C%22seg%22%3A1%7D; _SI_SID_1.773dde7634000118911cd1bd=027823784b3f314bc631a877.1733154111824.1443706; _abck=53980E70AB05674DABF1743D31E0CA4C~-1~YAAQVQcQAm6LXWqTAQAAcdo7kQ21ZDFdTb0XKKvlTiT1b7a78SgsCGo1YWlHXVeGdO0lIhGmBfbyz7rO6umBAX+ZaznwgIJlLH+dQomT1Jd3tgmshPIJ8PyGxAcpqXI50RPv4rzk+pyZX2gxFiVMTzRouKSUUfLSBaF1Yx6FLT+Y52P2Z2+2uxpQcpXXs4L9rTFDMmayxzemUoKz/ynW35GOiONrAHaX0YOUYanD0ars5oxDqibHjZP69wFmMyCoNTEyczjpwI3rGOBpXvVWxj7L0YlUa86nBBjzeRWZ66tNVkVoTJPw60Ff5juoDUSp8fMAZsnNWpr6eSDY7baK7P8OuzKt4br9kaDkl6+xWdnzxfmDOeFqhZVeC/UW/gGipqLqakmAOhVupKyezNnQ3iCU9c0WMupwn2bRNujiX7Hj3bFJ+YWCdvNn~-1~-1~-1; bm_lso=8A30CC4A8AD0E40CA6567B4B6CDC6FFF91E735228F511FC65EB1DE0687EBA91F~YAAQVQcQAmGuXWqTAQAAFSw8kQGIzNei7iimXkldBDzkP5rI9QfYr5qs7mWeIeAF8dYe7WYnilaU91+v8WJdfH08I0cs+OCZ8Z3BWLcLRNq8W8NvKtMCrWD6mrma9umstX4+NkOm0TNBxPT2yh89gbRam/W9N44iYizHvUG2Yvqu6MMHfhkKufR4s0tiw0KOgd6yRdtZjkd2pntV97mRNGLT3MGheBYXhC1I711vVSK4Bv9W8zVOdD65ECLyyQb8+EsFk5qfIOxPnCGmH6HxEUGpijwtDUuij07abWku6Vaun4VvZ4hCP32H4qeYFANBktmLkfPlPaxRE1LMj2DfZYLnuiOSpimDx12XgceUMzvz1HGHTxMCEiUpBtJn0aCsbLe7ylIP0gMsEEzM9/cEcrD14k7sVBXKUjDYi+neKIYPilOrbsqVYIYtTXlPqICUmHZL9jFI0PQ=^1733308460889; Ahonlnl-Prd-01-DigitalDev-B2=!Ts0rWDbF1sEZtKybYnwKLx++Ys+KRVSfFerx12+xy9KxN/e6j/lLr4iU0Cx4pcT5z/n1NqXOLRB7Dg==; SSID=CQCFHR0qAAQAAADytChnCYtCAfK0KGcGAAAAAABBmBJrPCpxZwBUmo4MAAOY5QAAFTBQZwIA4goAA3nSAADny01nAwBqDAAB1OMAADwqcWcBAHQMAAA; SSSC=4.G7433390136471227145.6|2786.53881:3178.58324:3214.58776; SSRT=PCpxZwADAA; bm_ss=ab8e18ef4e; ak_bmsc=8B38B13E15B3814C492AA3A67FA4D150~000000000000000000000000000000~YAAQVQcQAiYXpMSTAQAAmgANEhqGsaUE5/S/KTgimblydlqJptaUIO1dkuGHRIxn07QuQvKsLwuTxwGr59CmKQAK4wFCnaaCpINbPT4LOxLIG56sjvi76P0dxQBz7Hk31Y6BIKR5I2tf4ky4M/gFdh6q9J4ZK2ia5CNbaelCmGbQD0w0rBE3PvWOhPaBrNBpaAQuhPv4C1LsJaNf3GfToSB0m4E82daKsSe3vY9Rt3y4yD//LwGYl4lkc/JFCdX/hfuxQ8cAczFKJl5aqBGEacxk+Umf+lgG8ftqbUVsMmMsoNE6PDo/ztPQtVXaf6CWiehzO4VkxhdjCXpJ5FLcBzUGWYvF46FyOauA9DN+rG5jdg/hHdJe1Q0w/6pZBrRJFInWIDTk; bm_s=YAAQVQcQAigXpMSTAQAAmgANEgIkz2ndywqa/UvfCm25sRgNTvz9TQ4QBF2js9BAcDEqAiQEQWWaTFA/+GNTM7u0jV+LUBXuEcVEy9bfC/ZD+Qf4r0FQlAiJ4rCv6VmJmfDHKGqoMD8/trAGH8ASYMlL3lT7fIAahxZa+vRb+97iQnGP4PudSDgEHqru5ha+KmQh5V7XvJQ0vKnDCpyG67Kmd24hEqBltnrf79rknD/+CwdTEl1CvUQe/rdATKztrJbZxM13Qqv16E5XUEy8iajr/xvpvD8mh5ey+P0cH2/Ons5jxrF3EctLvte2BB20NN+3THm30cM8/oyOaxY9; bm_so=0E018E5A19CCB7F4EC1B89C2A89418283AB0BC7733F7049DDF86C6F6A74D0095~YAAQVQcQAikXpMSTAQAAmgANEgI3i43ggrOzRW1mKnZKe6clUhOEiNSnm3xKsnEbF1wuFPuMBYr18wcZDFlHlCWMzRFoQYmsWIdquyZ2H0aUgaFdWGvGB4zfvGb66vtVnOtFEEsUHHl7hVnwlhCZaGoAGQjw3ducp6zLeRWG6Mz9j94tR/CslYM1wXpaMeQX3z6gNJUckX+aSnQSPy1jRB5wYbEhYofFCao0FZ8AuTR6D82hXynXb//9kRGRasUnTIAmXcRhNgRyXSN4hxzt+nPSN94QCngaQ6JQ47CvBcqhcb33Z22uniQhioofFjQ5hOSbaq2MoeNN30NkiUpxm6BTQ9XRXw6VJEKDpr7fDgfudFX7ygbVoY5Z9DtHX1AbvGTh+7iFEq8DE3/w2lGJlwTXQCIfTEman/wObAOeRd/ccD+OuiOs8zfJvKoQRHaPs6vA8AVt; SSPV=OIsAAAAAAAAAAwAAAAAAAAAAAAIAAAAAAAAAAAAA; bm_sv=33FD1E37FB707495E23644B1D0C91B51~YAAQVQcQAowepMSTAQAAWxINEhpz4uJJiaSCZ4H2+CDvb4uBVjMOvQajQgJF8Lg3U/vjOY7G5hkmHUnlweWo+wQQN1qv96nQbjPeVsP4QOSXsdvXgiUU3M6kZ3NPCBaoXDIIwwszapuVPaxpmBHkCmpirm83OdvcqRO8gK/92eBVUPFVwH9ylSL7Yttl1pXlKjLJlAlxaltd1ZtijXgMi59hvBDhOs5SieCXAsGw9W5860yvSCa/5iS/TKYMn4w=~1\n',
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