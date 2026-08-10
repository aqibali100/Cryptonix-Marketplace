import { z } from "zod";
import { API_URL } from "./api";

export const adminLoginFormSchema = z.object({
  email: z.string().trim().min(1, "Admin email is required.").email("Enter a valid email address."),
  password: z.string().min(8, "Password must contain at least 8 characters.").max(128),
});

export const adminMfaFormSchema = z.object({
  code: z.string().regex(/^\d{6}$/, "Enter the complete 6-digit code."),
});

export type AdminAuthPayload = {
  success: boolean;
  code: string;
  message: string;
  data: null | {
    status?: "MFA_SETUP_REQUIRED" | "MFA_REQUIRED";
    challengeToken?: string;
    qrCodeDataUrl?: string | null;
    otpAuthUri?: string | null;
    admin?: { id: string; name: string; email: string };
    recoveryCodes?: string[];
  };
  errors?: Array<{ field: string; message: string }> | null;
};

export async function adminGraphql<T = AdminAuthPayload>(
  query: string,
  variables?: Record<string, unknown>,
): Promise<T> {
  const response = await fetch(`${API_URL}/api/admin/auth`, {
    method: "POST",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ query, variables }),
  });
  const body = (await response.json().catch(() => null)) as {
    data?: Record<string, AdminAuthPayload>;
    errors?: Array<{ message: string }>;
  } | null;
  if (!response.ok || !body) throw new Error("The admin service is currently unavailable.");
  if (body.errors?.length) throw new Error(body.errors[0]?.message ?? "The request failed.");
  const payload = body.data ? Object.values(body.data)[0] : undefined;
  if (!payload) throw new Error("The admin service returned an invalid response.");
  return payload as T;
}

export const ADMIN_LOGIN_MUTATION = /* GraphQL */ `
  mutation AdminLogin($input: AdminLoginInput!) {
    adminLogin(input: $input) {
      success
      code
      message
      errors {
        field
        message
      }
      data {
        status
        challengeToken
        qrCodeDataUrl
        otpAuthUri
      }
    }
  }
`;

export const ADMIN_ENROLL_MFA_MUTATION = /* GraphQL */ `
  mutation CompleteAdminMfaEnrollment($input: AdminMfaInput!) {
    completeAdminMfaEnrollment(input: $input) {
      success
      code
      message
      errors {
        field
        message
      }
      data {
        admin {
          id
          name
          email
        }
        recoveryCodes
      }
    }
  }
`;

export const ADMIN_VERIFY_MFA_MUTATION = /* GraphQL */ `
  mutation VerifyAdminMfa($input: AdminMfaInput!) {
    verifyAdminMfa(input: $input) {
      success
      code
      message
      errors {
        field
        message
      }
      data {
        admin {
          id
          name
          email
        }
      }
    }
  }
`;

export const ADMIN_ME_QUERY = /* GraphQL */ `
  query AdminMe {
    adminMe {
      success
      code
      message
      data {
        admin {
          id
          name
          email
        }
      }
    }
  }
`;

export const ADMIN_LOGOUT_MUTATION = /* GraphQL */ `
  mutation AdminLogout {
    adminLogout {
      success
      code
      message
    }
  }
`;
