import invariant from 'ts-invariant';

import { ChannelNotFoundError } from '@/errors/channel';
import { GetChannelDocument } from '@/gql/graphql';
import { executeGraphQL } from '@/helpers/graphql';

class ChannelService {
  async getDefault() {
    invariant(process.env.SALEOR_CHANNEL_SLUG, 'Missing SALEOR_CHANNEL_SLUG env variable');
    return this.getBySlug(process.env.SALEOR_CHANNEL_SLUG);
  }
  async getBySlug(slug: string) {
    const { channel } = await executeGraphQL(GetChannelDocument, {
      withAuth: false,
      headers: {
        Authorization: `Bearer ${process.env.SALEOR_APP_TOKEN}`,
      },
      variables: { slug },
    });

    if (!channel) {
      throw new ChannelNotFoundError();
    }

    return channel;
  }
}

const channelService = new ChannelService();

export default channelService;
