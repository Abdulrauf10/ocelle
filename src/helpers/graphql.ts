import { invariant } from 'ts-invariant';

import { type TypedDocumentString } from '../gql/graphql';

import saleorAuthClient from '@/saleorAuthClient';

type GraphQLErrorResponse = {
  errors: readonly {
    message: string;
  }[];
};

type GraphQLRespone<T> = { data: T } | GraphQLErrorResponse;

export async function executeGraphQL<Result, Variables>(
  operation: TypedDocumentString<Result, Variables>,
  options: {
    headers?: HeadersInit;
    cache?: RequestCache;
    revalidate?: number;
    withAuth?: boolean;
  } & (Variables extends Record<string, never> ? { variables?: never } : { variables: Variables })
): Promise<Result> {
  invariant(process.env.SALEOR_API_URL, 'Missing SALEOR_API_URL env variable');
  const { variables, headers, cache, revalidate, withAuth = true } = options;

  const input = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...headers,
    },
    body: JSON.stringify({
      query: operation.toString(),
      ...(variables && { variables }),
    }),
    cache: cache,
    next: { revalidate },
  };

  const response = withAuth
    ? await saleorAuthClient.fetchWithAuth(process.env.SALEOR_API_URL, input)
    : await fetch(process.env.SALEOR_API_URL, input);

  if (!response.ok) {
    const body = await (async () => {
      try {
        return await response.text();
      } catch {
        return '';
      }
    })();
    console.error(input.body);
    throw new HTTPError(response, body);
  }

  const body = (await response.json()) as GraphQLRespone<Result>;

  if ('errors' in body) {
    throw new GraphQLError(operation, body);
  }

  return body.data;
}

class GraphQLError<Result, Variables> extends Error {
  constructor(
    public operation: TypedDocumentString<Result, Variables>,
    public errorResponse: GraphQLErrorResponse
  ) {
    const message = errorResponse.errors.map((error) => error.message).join('\n');
    super(message);
    let doc = '';
    for (const line of operation.toString().split('\n')) {
      if (line.trim().length > 0) {
        doc = line;
        break;
      }
    }
    this.name = `${this.constructor.name} [${doc.replace('{', '').trim()}]`;
    Object.setPrototypeOf(this, new.target.prototype);
  }
}
class HTTPError extends Error {
  constructor(response: Response, body: string) {
    const message = `HTTP error ${response.status}: ${response.statusText}\n${body}`;
    super(message);
    this.name = this.constructor.name;
    Object.setPrototypeOf(this, new.target.prototype);
  }
}
