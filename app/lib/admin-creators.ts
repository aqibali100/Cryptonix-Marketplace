export type AdminManagedCreator = {
  id: string;
  name: string;
  username: string;
  email: string;
  category: string;
  country: string;
  wallet: string;
  nftCount: number;
  creatorStatus: "approved" | "pending" | "rejected" | "suspended";
  accountStatus: "ACTIVE" | "REVIEW" | "SUSPENDED";
  joinedAt: string;
  lastActiveAt: string;
};

export type AdminCreatorsPayload = {
  success: boolean;
  code: string;
  message: string;
  data: null | {
    metrics: {
      totalCreators: number;
      approved: number;
      pending: number;
      activeCreators: number;
      restricted: number;
    };
    creators: AdminManagedCreator[];
    pagination: { page: number; limit: number; total: number; pages: number };
  };
  errors?: Array<{ field: string; message: string }> | null;
};

export const ADMIN_CREATORS_QUERY = /* GraphQL */ `
  query AdminCreators($input: AdminCreatorsQueryInput) {
    adminCreators(input: $input) {
      success
      code
      message
      errors {
        field
        message
      }
      data {
        metrics {
          totalCreators
          approved
          pending
          activeCreators
          restricted
        }
        creators {
          id
          name
          username
          email
          category
          country
          wallet
          nftCount
          creatorStatus
          accountStatus
          joinedAt
          lastActiveAt
        }
        pagination {
          page
          limit
          total
          pages
        }
      }
    }
  }
`;
