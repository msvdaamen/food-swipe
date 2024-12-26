export async function fetchRecipeFromAh(id: number): Promise<Recipe | null> {
    const response = await fetch('https://www.ah.nl/gql', {
        method: 'POST',
        headers: {
            'access-control-allow-credentials': 'true',
            'access-control-allow-origin': 'https://www.ah.nl',
            'Content-Type': 'application/json',
            'Origin': 'https://www.ah.nl',
            'Cookie': 'i18next=nl-nl; Ahonlnl-Prd-01-DigitalDev-F1=!fRoskYShO1ahSMe0BNaqcoBHZrTlZ4ChH4A+FOOfK0E7E296fctMD9XJ2CBusXLNeVln84+JsOZEbTY=; SSSC=4.G7439819741172267392.3|2786.53881:3178.58325:3214.58777:3219.58804; SSPV=OIsAAAAAAAAAAwAAAAAAAAAAAAIAAAAAAAAAAAAA; SSLB=0; SSID=CQDhYh0AAAAAAACjjD9ngPmCAaOMP2cDAAAAAABhsitrNUppZwBUmg; SSRT=709pZwQBAA; _csrf=Q1O4lhIKIvMZaIeq3PN8-QpO; Ahonlnl-Prd-01-DigitalDev-B2=!qZ/Mtz6T7YAqWEhcW3zSMawkMtSFenJoWArItchoWTyYhRsqP0OkmWjp1GS5NEgBea/BLvtlbfxizg==; bm_ss=ab8e18ef4e; ak_bmsc=0BFCFEFB0655FFE2959E9CE79A90C6FC~000000000000000000000000000000~YAAQVQcQAiDCbb2TAQAAJ1fs+RpglN1qB5tUrP6psEgislBld49V6lriqErMC+o3NkXkvrWoXfGYE4onQ5wukAdGgBrHGEkviyMA9XnIFMPuh8HfsKsooUutG+anA1xn52PXPV79zs41Y5x6SkuIZayuX0NWp+YsP8K5L7AZ2Nk1JpG6WWQGhJRvZEtwlze/JVSK3fiFpdzWMNCfln0XGNKBEwNNVxusA/gd6fG6j9F65Q3kswH3prk+1GMrsRKqj4ila1/hXWk1oBgBt8QC+eKcSx4EIqWiECKRRh0Dm1DWq4sQ+bZXjF5fPEMQCAr9KVmRjbXA6HZ4ChJJGmHgJd4j6N6mR9Stw0Sqrp3iWrFzT6Ruj1NVjrBckOUlILfqz4NY5nRCqfQ=; _abck=DA2A531EF24C2FF7E1013CDCB97FEACA~-1~YAAQVQcQAsDCbb2TAQAAGlns+Q1ZwOcPESxy8qYSxJRcQksLHj7nu5h5PWCosLIQyzUqilmE0FfdMGYyTXbfBNzbcT7M/xmD76Gok9dLctkYAnt0vnI9SytOG/p35SZFEP07ZAhKW9TzEqEzBmHzEXFzKNkxTxlEX6yoeNqg69f4ai3tIMbqnf1lqgtlyz29H1B19oU7VHZ+BU/vAwqotr/FvhMOqyNJ7DLnJpQg3KIHekeUwEyP1vw66HyBLUx8ESxKIvAjZwh44jATa4duR+YemD9G69PnwZgK3phh3r/f1eDNWKYQ5+MZHYyNP6sD7zRUiLjd/lcH2aNV7SAYnAKcoQ8Szjr30FfgwQVoTY3wvdWN+G2IGJe8jbk2AnPhRHfI8iVAee0TCaCERCSZiVCl9hqVqVfER+tR5eJ9wFqqBC8dzLQ8bSxo~-1~-1~-1; bm_sz=0F0789B61B5749A5ED0F82CFAFDDA6E4~YAAQVQcQAsPCbb2TAQAAGlns+RpJaKT7D7t0jXmqyexV6exv92mjj3Ew0XvwQF5KP2Ssvjc2fYRDj2ykvZzapjSkQ9JzyvCN8VoWy+Mjd2RyTi46+3do/yZXBs3NX9h1VyIXjgW0jk/GnDjBspRJqJ+S9S87X+RNk/fbJIQLUOuZrqC4o5o16NlvsMuTvxmwJUqI9EzkqototWetynLbKHpuBdaUibQMEWUCywqtVm+LonpXmgOIm8YSb4sr9eHzYnOTbW3iBRKONfprJpjGgWZTJb6e8MLJXKSNWxJyBYQWwg+gZ4CDQ7v8h3e2ScSg7IHy0FxFrdL0CDnxIYXx4CiBa/rt2k/h3yYIvKz8jNDEN/9e9g==~3425592~4539717; bm_lso=62A6ACF20E132046D5AE33A47D3BB2D714EACA89EDB1F5DAD9F588366D603264~YAAQVQcQAiPCbb2TAQAAJ1fs+QIHu0p0WXx1yzToQX4SvjpjwVTUH9tNpiUVTL7vW8x2h29qtstIYRJ3UBBXOZxx1W16hvROgfiSCo8+j7eVTF1rkn1df4QAezBFG4YIWBhxOXvi/32quvcfWv13MtvgTE34P8iXB0YsV9+TT0ho0VQFJCIThAWD3CW4zqGVC4GaH7H/C/X1EzepTUvNeknaqMqywtKZ5mjO8DDxWeqlV1zObJwR4A4h6ichXS+WXHjLCeBZeawtwAo/FfxsmcAkOhj8qSpQeRcIz6eMaiwRKKucb5m6t6YoK7rPhcto/rNsKy8uFBWSJcxAls4vCsn0csUjX4E5Br/oExWYpgSbRyEnhED7921NQzqjXxO562XvUybQStSNe8hfk/KsB4Xg75n1pzw56EJC8R7AgVndcuWBN4udaETl/XDPH2QfOzQOgPjWfy0=^1735064836758; bm_mi=2AD1B02864F66FE7948FE1F9D48FAA1F~YAAQVQcQAlRzbr2TAQAAhzvu+RqfR05XS3p1nT2sN5FSd2O9u01eKvN9v4LofrRk/PngNgbVVvPYFzKVuS8jo8xL+cUowiAbJXPjtu06BaHQVIhZ0sYgt9g1vifuZyFHWFUD1kXFL3goMyWNv0yE/f6hEygeRrEr7E3ebj3H0GkEpMNLAQHlEkmgoYcrFCWZ0xRiZHbC79zLuON9S4aJVy9u+c1j7AF3Pd58239l6XOdFdHuZB7NYiGCgb8so/Yw/9ikW/xMmUYKV6qeSSqwszDlTYKCUWd+9GrGpCpSkOVGA8kA2f5Pe5DVk0UAJTJGHP5BWd8Yx0V+DyEhRMZn7PcTQCExZz2nkGui68GKhmDpi+r2pBfVOS3wcbPzIlazdxZMqQ==~1; bm_s=YAAQVQcQAlVzbr2TAQAAiDvu+QJAMF39ls/QHvVCNUX8nfvjMJngpf0iAZvDDzOOdPjpOaDM7DvPq2oHg741xzWcSAcS8iWk8LR0PT3IQ5qyqYwV4AChCb/obvOh7rSDjeWI/4w9miABpaV0VCIQBzC7JIPU/iAZsHctpTQk7SiHKovQJnO4nF3W1PF0GKxOTjUsehqdo3Fn27u1xLR/XEhblvdEF2OJ8aAxAgSXdYuSsx/pPzChTK0+0CdhfX5OyWuFnCVqQ02qD42ENKB4uYWO58iNi7G3BowQcYB57QD+ACdpQnN9LvVicaT/PGyQHXWZmseO0Ef7LmoiRcukEV4=; bm_so=0BE3E7269192826F8848258C2685D0058D6E1942AD2486EF79A1FC808D78AFD0~YAAQVQcQAlZzbr2TAQAAiDvu+QJ5ezhjoQDsqcQZjZ9nhGspnpxvYd6jhA5BRoLqEtF2CC85vrRnF1XiQyW6pf5B9mhmDgQsnnVLvV633yR3PKsY2aCuVd1YJ824p2flwErpk/Wfz6Ao6+wcUYtd5Hbwuxo8WI2jVEc9YeEPvgfwZwefZoETma7DZkPVgI/Y45Ssq/Jg+mAy8K8NrmEtjYE+B1VmVAQ4Dw2tGrKDlQQgnh0ZjArMNEbtqxzYQj3xXiWeLpr431zeYlnD/DeA2X1+jfQuDGM9xB4zxHwJujhN/7+BXPYsERSmZy+mbTD18uirQFVoahpQ9WenrD03acxEdATISt+cyNKCoZ9424EP48HHz95Ev7zNTUIBuJGi7VMvsF7Mn6UiFkNqEfc4lr5QEmiJp/Fc3QWddyrIFWeWkhxMwJcFE039wY0LIQ62wa4Xwiawb3A=; bm_sv=5F44B3569FB0CED162ECF8DA456DD6BE~YAAQVQcQAvxzbr2TAQAAED3u+RpmuwfT9O5Z8ZHZBHgovq1ngB7yV3FXtKRUjpDgWm1lkAJkyRz4MAVuc7Y1fcLAYFp2HewAYPuNlFPAiWqNElPGqnrWnfE0BeKMyh6taZdOP9OhufSVmQzrfrEpWMpNQjZdvd2AfKc7O2NeWi+x4Kg9i6FWtBZ9numTYoazPiJRJWaRcLhqRYUtSYOpOVIjiSoFu4aIDB/yCB5wOWk3uPiVdwxSiP33bO6hYded~1',
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