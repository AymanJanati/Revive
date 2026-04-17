import { asApiError } from "@/lib/errors/apiError";
import { error, ok } from "@/lib/serializers/apiSerializer";
import { partnerService } from "@/lib/services/partnerService";

export async function GET() {
  try {
    return ok(partnerService.listPartners());
  } catch (e) {
    const apiError = asApiError(e);
    return error(apiError.code, apiError.message, apiError.status);
  }
}

