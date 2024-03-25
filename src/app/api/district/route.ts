import { AddressValidationRulesDocument } from '@/gql/graphql';
import { executeGraphQL } from '@/helpers/graphql';
import { NextResponse } from 'next/server';
import invariant from 'ts-invariant';

export async function GET(request: Request) {
  const language = request.headers.get('x-language');
  const countryArea = request.headers.get('x-countryArea');

  invariant(language, 'missing language header');
  invariant(countryArea, 'missing countryArea header');

  const { addressValidationRules } = await executeGraphQL(AddressValidationRulesDocument, {
    variables: {
      countryArea,
    },
  });

  if (!addressValidationRules) {
    throw new Error('failed to get districts');
  }

  const districts = [];

  for (const city of addressValidationRules.cityChoices) {
    if (city.verbose) {
      if (language === 'en') {
        if (/^[a-zA-Z\s]+$/.test(city.verbose)) {
          districts.push(city);
        }
      } else {
        districts.push(city);
      }
    }
  }

  districts.sort((a, b) => {
    if (a.verbose! < b.verbose!) {
      return -1;
    }
    if (a.verbose! > b.verbose!) {
      return 1;
    }
    return 0;
  });

  return NextResponse.json(districts);
}
