import { z } from "zod";

export const adminUsersFilterSchema = z.object({
  page: z.number().int().min(1),
  limit: z.number().int().min(1).max(50),
  search: z.string().trim().max(100),
  status: z.enum(["ACTIVE", "REVIEW", "SUSPENDED"]).optional(),
  dateRange: z.enum(["ALL", "TODAY", "7_DAYS", "30_DAYS"]),
  sort: z.enum(["NEWEST", "OLDEST", "NAME_ASC"]),
});

export type AdminManagedUser = {
  id: string;
  name: string;
  username: string;
  wallet: string;
  role: string;
  joinedAt: string;
  lastActiveAt: string;
  status: "ACTIVE" | "REVIEW" | "SUSPENDED";
};

export type AdminUsersPayload = {
  success: boolean;
  code: string;
  message: string;
  data: null | {
    metrics: {
      totalUsers: number;
      totalChangePercent: number;
      activeToday: number;
      activeSharePercent: number;
      newThisWeek: number;
      newChangePercent: number;
      restricted: number;
      reviewRequired: number;
    };
    users: AdminManagedUser[];
    pagination: { page: number; limit: number; total: number; pages: number };
    filters: { search: string; status: string | null; dateRange: string; sort: string };
  };
  errors?: Array<{ field: string; message: string }> | null;
};

export const ADMIN_USERS_QUERY = /* GraphQL */ `
  query AdminUsers($input: AdminUsersQueryInput) {
    adminUsers(input: $input) {
      success
      code
      message
      errors {
        field
        message
      }
      data {
        metrics {
          totalUsers
          totalChangePercent
          activeToday
          activeSharePercent
          newThisWeek
          newChangePercent
          restricted
          reviewRequired
        }
        users {
          id
          name
          username
          wallet
          role
          joinedAt
          lastActiveAt
          status
        }
        pagination {
          page
          limit
          total
          pages
        }
        filters {
          search
          status
          dateRange
          sort
        }
      }
    }
  }
`;

export type AdminUserStatusPayload = {
  success: boolean;
  code: string;
  message: string;
  data: null | { id: string; status: "ACTIVE" | "REVIEW" | "SUSPENDED" };
};

export const UPDATE_ADMIN_USER_STATUS_MUTATION = /* GraphQL */ `
  mutation UpdateAdminUserStatus($userId: ID!, $status: String!) {
    updateAdminUserStatus(userId: $userId, status: $status) {
      success
      code
      message
      data {
        id
        status
      }
      errors {
        field
        message
      }
    }
  }
`;

export type AdminUserDetails = {
  id: string;
  name: string;
  username: string;
  email: string;
  profileImage: string;
  website: string;
  role: string;
  creatorStatus: string;
  status: "ACTIVE" | "REVIEW" | "SUSPENDED";
  joinedAt: string;
  updatedAt: string;
  lastActiveAt: string;
  wallets: Array<{
    id: string;
    address: string;
    chainId: number;
    isPrimary: boolean;
    connectedAt: string;
  }>;
  creator: null | {
    displayName: string;
    creatorType: string;
    country: string;
    bio: string;
    primaryCategory: string;
    experience: string;
    portfolioUrl: string;
    status: string;
    submittedAt: string;
    reviewedAt: string | null;
  };
  nftStats: { total: number; minted: number; awaitingMint: number; failed: number };
  recentNfts: Array<{
    id: string;
    name: string;
    status: string;
    tokenId: string | null;
    chainId: number;
    createdAt: string;
  }>;
};

export type AdminUserDetailsPayload = {
  success: boolean;
  code: string;
  message: string;
  data: AdminUserDetails | null;
  errors?: Array<{ field: string; message: string }> | null;
};

export const ADMIN_USER_DETAILS_QUERY = /* GraphQL */ `
  query AdminUserDetails($userId: ID!) {
    adminUserDetails(userId: $userId) {
      success
      code
      message
      errors {
        field
        message
      }
      data {
        id
        name
        username
        email
        profileImage
        website
        role
        creatorStatus
        status
        joinedAt
        updatedAt
        lastActiveAt
        wallets {
          id
          address
          chainId
          isPrimary
          connectedAt
        }
        creator {
          displayName
          creatorType
          country
          bio
          primaryCategory
          experience
          portfolioUrl
          status
          submittedAt
          reviewedAt
        }
        nftStats {
          total
          minted
          awaitingMint
          failed
        }
        recentNfts {
          id
          name
          status
          tokenId
          chainId
          createdAt
        }
      }
    }
  }
`;
