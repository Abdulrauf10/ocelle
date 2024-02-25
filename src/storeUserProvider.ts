import { executeGraphQL } from './helpers/graphql';
import { CurrentUserDocument } from './gql/graphql';

const isDebugMode = true;

async function getStoreMe() {
  if (isDebugMode) {
    return {
      id: '1',
      email: 'string',
      firstName: 'charile',
      lastName: 'wong',
    };
  }

  const { me } = await executeGraphQL(CurrentUserDocument, {
    cache: 'no-cache',
  });

  if (!me) {
    throw new Error('get current user failed');
  }

  return me;
}

export { getStoreMe };
