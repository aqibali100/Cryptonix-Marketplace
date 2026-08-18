export const API_URL =
  process.env.NEXT_PUBLIC_API_URL?.trim().replace(/\/$/, "") || "http://localhost:4000";

export async function apiRequest<T>(path: string, init?: RequestInit): Promise<T> {
  const isFormData = typeof FormData !== "undefined" && init?.body instanceof FormData;
  const response = await fetch(`${API_URL}${path}`, {
    ...init,
    credentials: "include",
    headers: { ...(isFormData ? {} : { "Content-Type": "application/json" }), ...init?.headers },
  });

  if (!response.ok) {
    const body = (await response.json().catch(() => null)) as {
      error?: string;
      message?: string;
    } | null;
    throw new Error(body?.message ?? body?.error ?? "The server request failed.");
  }

  if (response.status === 204) return undefined as T;
  return response.json() as Promise<T>;
}

type GraphQLResponse<T> = {
  data?: T;
  errors?: Array<{ message: string }>;
};

export async function graphQLRequest<T>(
  query: string,
  variables?: Record<string, unknown>,
): Promise<T> {
  const response = await apiRequest<GraphQLResponse<T>>("/graphql", {
    method: "POST",
    body: JSON.stringify({ query, variables }),
  });
  if (response.errors?.length) {
    throw new Error(response.errors.map((error) => error.message).join(" "));
  }
  if (!response.data) throw new Error("The GraphQL response did not include data.");
  return response.data;
}
