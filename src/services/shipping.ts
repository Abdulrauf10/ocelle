import invariant from 'ts-invariant';

import { DEFUALT_SHIPPING_ZONE } from '@/consts';
import {
  ShippingCountryAreasError,
  ShippingDistrictsError,
  ShippingMethodNotFoundError,
} from '@/errors/shipping';
import {
  AddressValidationRulesDocument,
  CountryCode,
  FindShippingZonesDocument,
} from '@/gql/graphql';
import { executeGraphQL } from '@/helpers/graphql';
import { choiceToOptions } from '@/helpers/saleor';

class ShippingService {
  async countryAreas(locale: string, countryCode: CountryCode) {
    const { addressValidationRules } = await executeGraphQL(AddressValidationRulesDocument, {
      variables: {
        countryCode,
      },
    });

    if (!addressValidationRules) {
      throw new ShippingCountryAreasError();
    }

    return choiceToOptions(addressValidationRules.countryAreaChoices, locale);
  }
  async districts(locale: string, countryCode: CountryCode, countryArea: string) {
    const { addressValidationRules } = await executeGraphQL(AddressValidationRulesDocument, {
      variables: {
        countryCode,
        countryArea,
      },
    });

    if (!addressValidationRules) {
      throw new ShippingDistrictsError();
    }

    return choiceToOptions(addressValidationRules.cityChoices, locale);
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
