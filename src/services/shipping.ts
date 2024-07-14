import invariant from 'ts-invariant';

import { DEFUALT_SHIPPING_ZONE } from '@/consts';
import { ShippingDistrictsError, ShippingMethodNotFoundError } from '@/errors/shipping';
import {
  AddressValidationRulesDocument,
  CountryCode,
  FindShippingZonesDocument,
} from '@/gql/graphql';
import { executeGraphQL } from '@/helpers/graphql';

class ShippingService {
  async districts(locale: string, countryArea: CountryCode) {
    const { addressValidationRules } = await executeGraphQL(AddressValidationRulesDocument, {
      variables: {
        countryArea,
      },
    });

    if (!addressValidationRules) {
      throw new ShippingDistrictsError();
    }

    const districts: Array<{ raw: string; verbose: string }> = [];

    for (const city of addressValidationRules.cityChoices) {
      if (city.raw && city.verbose) {
        if (locale === 'en') {
          if (/^[a-zA-Z\s]+$/.test(city.verbose)) {
            districts.push({
              raw: city.raw,
              verbose: city.verbose,
            });
          }
        } else {
          districts.push({
            raw: city.raw,
            verbose: city.verbose,
          });
        }
      }
    }

    return districts.sort((a, b) => {
      if (a.verbose < b.verbose) {
        return -1;
      }
      if (a.verbose > b.verbose) {
        return 1;
      }
      return 0;
    });
  }
  async findShippingMethod(name: string) {
    invariant(process.env.SALEOR_CHANNEL_SLUG, 'Missing SALEOR_CHANNEL_SLUG env variable');

    const { shippingZones } = await executeGraphQL(FindShippingZonesDocument, {
      withAuth: false,
      headers: {
        Authorization: `Bearer ${process.env.SALEOR_APP_TOKEN}`,
      },
      variables: {
        filter: {
          search: DEFUALT_SHIPPING_ZONE,
        },
      },
    });

    const shippingZone = shippingZones && shippingZones.edges[0].node;

    if (!shippingZone) {
      throw new ShippingMethodNotFoundError('cannot find shipping zone');
    }

    const shippingMethod = shippingZone.shippingMethods?.find(
      (shippingMethod) => shippingMethod.name === name
    );

    if (!shippingMethod) {
      throw new ShippingMethodNotFoundError('cannot find shipping method');
    }

    return shippingMethod;
  }
}

const shippingService = new ShippingService();

export default shippingService;
